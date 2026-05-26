"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { demoAssessments } from "@/lib/demo-data";
import { getViewerContext, requireWritableUser } from "@/lib/demo-server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const buildFallbackQuestions = (industry, skills = []) => {
  const industryLabel = industry || "your field";
  const primarySkill = skills[0] || industry?.split("-").pop() || "problem solving";
  const secondarySkill = skills[1] || "debugging";
  const tertiarySkill = skills[2] || "system design";

  return [
    {
      question: `When starting a ${industryLabel} task, what is the best first step to show strong ${primarySkill} fundamentals?`,
      options: [
        "Clarify requirements, constraints, and success criteria before implementation",
        "Start coding immediately to save time",
        "Skip stakeholder discussion and rely on assumptions",
        "Copy a previous solution without reviewing fit",
      ],
      correctAnswer:
        "Clarify requirements, constraints, and success criteria before implementation",
      explanation:
        "Strong fundamentals begin with understanding the problem clearly before choosing an approach.",
    },
    {
      question: `Which behavior best demonstrates good ${secondarySkill} practice in ${industryLabel}?`,
      options: [
        "Reproduce the issue consistently and isolate the failing condition",
        "Change multiple parts at once and hope one works",
        "Ignore logs and error messages",
        "Assume the bug will disappear after a restart",
      ],
      correctAnswer:
        "Reproduce the issue consistently and isolate the failing condition",
      explanation:
        "Reliable debugging depends on controlled reproduction and narrowing the root cause.",
    },
    {
      question: `What is the most effective way to evaluate tradeoffs in a ${industryLabel} solution?`,
      options: [
        "Compare scalability, maintainability, cost, and delivery speed",
        "Choose the most complex option to seem advanced",
        "Only optimize for speed and ignore reliability",
        "Pick the first workable idea without review",
      ],
      correctAnswer:
        "Compare scalability, maintainability, cost, and delivery speed",
      explanation:
        "Good technical decisions balance multiple constraints instead of optimizing one dimension blindly.",
    },
    {
      question: `Which option best reflects strong communication during a ${industryLabel} project?`,
      options: [
        "Explain decisions, risks, and assumptions clearly to teammates",
        "Keep implementation details private until the end",
        "Avoid documenting changes to move faster",
        "Only speak up when something breaks",
      ],
      correctAnswer:
        "Explain decisions, risks, and assumptions clearly to teammates",
      explanation:
        "Clear communication helps teams align early and reduces costly misunderstandings.",
    },
    {
      question: `How should a professional validate a solution involving ${tertiarySkill} in ${industryLabel}?`,
      options: [
        "Test with realistic scenarios, edge cases, and measurable outcomes",
        "Assume it works if it passes one happy-path case",
        "Skip testing if the design looks correct",
        "Wait for users to report issues in production",
      ],
      correctAnswer:
        "Test with realistic scenarios, edge cases, and measurable outcomes",
      explanation:
        "Validation should cover normal usage, edge cases, and expected business results.",
    },
    {
      question: `Which practice best improves long-term maintainability in ${industryLabel}?`,
      options: [
        "Use clear structure, readable naming, and concise documentation",
        "Pack everything into one large file for convenience",
        "Avoid comments and naming conventions entirely",
        "Optimize prematurely before the design is stable",
      ],
      correctAnswer:
        "Use clear structure, readable naming, and concise documentation",
      explanation:
        "Maintainable work is easier to debug, extend, and hand off to others.",
    },
    {
      question: `When prioritizing work in a ${industryLabel} environment, what should come first?`,
      options: [
        "High-impact tasks that reduce key risk or unblock progress",
        "The easiest task regardless of business value",
        "Only the most visible task even if it is low value",
        "Random tasks based on personal preference",
      ],
      correctAnswer:
        "High-impact tasks that reduce key risk or unblock progress",
      explanation:
        "Strong prioritization focuses on business impact and delivery risk, not just convenience.",
    },
    {
      question: `What is the best response when a chosen ${industryLabel} approach is not working?`,
      options: [
        "Reassess assumptions, gather evidence, and adapt the plan",
        "Keep pushing the same plan without reviewing results",
        "Hide the issue until deadlines pass",
        "Blame tooling before investigating",
      ],
      correctAnswer:
        "Reassess assumptions, gather evidence, and adapt the plan",
      explanation:
        "Effective professionals adjust quickly based on evidence instead of clinging to a failing approach.",
    },
    {
      question: `Which option best shows quality awareness in ${industryLabel}?`,
      options: [
        "Check edge cases, failure modes, and user-facing impact before shipping",
        "Ship as soon as the main case works once",
        "Treat QA as someone else's responsibility",
        "Ignore small defects because users might not notice",
      ],
      correctAnswer:
        "Check edge cases, failure modes, and user-facing impact before shipping",
      explanation:
        "Quality comes from thinking beyond the happy path and reducing user risk.",
    },
    {
      question: `How can someone keep improving their ${primarySkill} capability in ${industryLabel}?`,
      options: [
        "Practice regularly, review outcomes, and learn from feedback",
        "Repeat the same habits without reflection",
        "Avoid feedback to protect confidence",
        "Only study theory and never apply it",
      ],
      correctAnswer:
        "Practice regularly, review outcomes, and learn from feedback",
      explanation:
        "Skill growth comes from iteration, reflection, and applying feedback in real situations.",
    },
  ];
};

const extractJsonObject = (text) => {
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const start = cleanedText.indexOf("{");
    const end = cleanedText.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("No JSON object found in model response");
    }

    return JSON.parse(cleanedText.slice(start, end + 1));
  }
};

const normalizeQuestions = (industry, skills, rawQuestions) => {
  if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
    return buildFallbackQuestions(industry, skills);
  }

  const normalized = rawQuestions
    .map((question, index) => {
      const options = Array.isArray(question?.options)
        ? question.options.filter(Boolean).slice(0, 4)
        : [];

      if (!question?.question || options.length < 2) {
        return null;
      }

      const correctAnswer =
        typeof question?.correctAnswer === "string" &&
        options.includes(question.correctAnswer)
          ? question.correctAnswer
          : options[0];

      return {
        question: question.question,
        options,
        correctAnswer,
        explanation:
          typeof question?.explanation === "string" && question.explanation.trim()
            ? question.explanation
            : `Review the core concept behind question ${index + 1} and compare each option carefully.`,
      };
    })
    .filter(Boolean);

  const uniqueQuestions = normalized.filter((question, index, questions) => {
    const normalizedText = question.question.trim().toLowerCase();

    return (
      questions.findIndex(
        (candidate) =>
          candidate.question.trim().toLowerCase() === normalizedText
      ) === index
    );
  });

  if (!uniqueQuestions.length) {
    return buildFallbackQuestions(industry, skills);
  }

  const fallbackQuestions = buildFallbackQuestions(industry, skills);

  while (uniqueQuestions.length < 10) {
    const fallbackQuestion = fallbackQuestions[uniqueQuestions.length % 10];
    const alreadyExists = uniqueQuestions.some(
      (question) => question.question === fallbackQuestion.question
    );

    if (!alreadyExists) {
      uniqueQuestions.push(fallbackQuestion);
    } else {
      break;
    }
  }

  return uniqueQuestions.slice(0, 10);
};

export async function generateQuiz() {
  const { userId } = await requireWritableUser();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const quiz = extractJsonObject(text);

    return normalizeQuestions(user.industry, user.skills, quiz.questions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return buildFallbackQuestions(user.industry, user.skills);
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await requireWritableUser();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId, isDemoMode } = await getViewerContext();

  if (isDemoMode) {
    return demoAssessments;
  }

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
