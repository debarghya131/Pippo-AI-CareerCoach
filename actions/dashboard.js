"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const buildFallbackInsights = (industry) => ({
  salaryRanges: [
    {
      role: `${industry} Specialist`,
      min: 60000,
      max: 120000,
      median: 90000,
      location: "Global",
    },
  ],
  growthRate: 12,
  demandLevel: "Medium",
  topSkills: ["Communication", "Problem Solving", "Adaptability"],
  marketOutlook: "Positive",
  keyTrends: ["AI adoption", "Automation", "Remote collaboration"],
  recommendedSkills: ["Domain expertise", "Analytics", "Digital tools"],
});

const normalizeInsights = (industry, raw) => {
  const fallback = buildFallbackInsights(industry);

  return {
    salaryRanges:
      Array.isArray(raw?.salaryRanges) && raw.salaryRanges.length
        ? raw.salaryRanges
        : fallback.salaryRanges,
    growthRate:
      typeof raw?.growthRate === "number"
        ? raw.growthRate
        : Number.parseFloat(raw?.growthRate) || fallback.growthRate,
    demandLevel:
      typeof raw?.demandLevel === "string"
        ? raw.demandLevel
        : fallback.demandLevel,
    topSkills:
      Array.isArray(raw?.topSkills) && raw.topSkills.length
        ? raw.topSkills
        : fallback.topSkills,
    marketOutlook:
      typeof raw?.marketOutlook === "string"
        ? raw.marketOutlook
        : fallback.marketOutlook,
    keyTrends:
      Array.isArray(raw?.keyTrends) && raw.keyTrends.length
        ? raw.keyTrends
        : fallback.keyTrends,
    recommendedSkills:
      Array.isArray(raw?.recommendedSkills) && raw.recommendedSkills.length
        ? raw.recommendedSkills
        : fallback.recommendedSkills,
  };
};

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return normalizeInsights(industry, JSON.parse(cleanedText));
  } catch (error) {
    console.error("Failed to generate AI insights:", error);
    return buildFallbackInsights(industry);
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
