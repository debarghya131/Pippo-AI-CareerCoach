import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";

export class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = "RateLimitError";
  }
}

export const AI_RATE_LIMITS = {
  resumeImprove: {
    action: "resume-improve",
    limits: [
      {
        maxRequests: 1,
        windowMs: 24 * 60 * 60 * 1000,
        message:
          "You have reached your daily limit for AI resume improvements. Please try again tomorrow.",
      },
    ],
  },
  coverLetterGenerate: {
    action: "cover-letter-generate",
    limits: [
      {
        maxRequests: 1,
        windowMs: 24 * 60 * 60 * 1000,
        message:
          "You have reached your daily limit for cover letter generation. Please try again tomorrow.",
      },
    ],
  },
  quizGenerate: {
    action: "quiz-generate",
    limits: [
      {
        maxRequests: 1,
        windowMs: 24 * 60 * 60 * 1000,
        message:
          "You have reached your daily limit for quiz generation. Please try again tomorrow.",
      },
    ],
  },
  quizImprovementTip: {
    action: "quiz-improvement-tip",
    limits: [
      {
        maxRequests: 1,
        windowMs: 24 * 60 * 60 * 1000,
        message:
          "You have reached your daily limit for AI quiz feedback. Please try again tomorrow.",
      },
    ],
  },
  industryInsightGenerate: {
    action: "industry-insight-generate",
    limits: [
      {
        maxRequests: 2,
        windowMs: 24 * 60 * 60 * 1000,
        message:
          "You have reached your daily limit for industry insight refreshes. Please try again tomorrow.",
      },
    ],
  },
};

export async function enforceRateLimit({ action, subject, limits }) {
  const normalizedLimits = limits?.length ? limits : [];

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await db.$transaction(
        async (tx) => {
          if (!normalizedLimits.length) {
            return;
          }

          const longestWindowMs = Math.max(
            ...normalizedLimits.map((limit) => limit.windowMs)
          );
          const oldestCutoff = new Date(Date.now() - longestWindowMs);

          await tx.rateLimitEvent.deleteMany({
            where: {
              action,
              subject,
              createdAt: { lt: oldestCutoff },
            },
          });

          const recentEvents = await tx.rateLimitEvent.findMany({
            where: {
              action,
              subject,
              createdAt: { gte: oldestCutoff },
            },
            select: {
              createdAt: true,
            },
          });

          const now = Date.now();
          for (const limit of normalizedLimits) {
            const cutoff = now - limit.windowMs;
            const recentCount = recentEvents.filter(
              (event) => event.createdAt.getTime() >= cutoff
            ).length;

            if (recentCount >= limit.maxRequests) {
              throw new RateLimitError(limit.message);
            }
          }

          await tx.rateLimitEvent.create({
            data: {
              action,
              subject,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );

      return;
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }

      if (error?.code === "P2034" && attempt < 2) {
        continue;
      }

      throw error;
    }
  }
}
