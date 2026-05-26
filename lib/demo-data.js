export const demoProfile = {
  name: "Debarghya Banerjee",
  industry: "technology-it-services",
  experience: 3,
  bio: "Full-stack developer focused on practical AI products, career tools, and thoughtful user experiences for early-career professionals.",
  skills: ["C", "React", "Next.js", "Prisma", "PostgreSQL"],
};

export const demoIndustryInsights = {
  id: "demo-industry-insight",
  industry: demoProfile.industry,
  salaryRanges: [
    {
      role: "Junior Software Engineer",
      min: 55000,
      max: 85000,
      median: 70000,
      location: "Remote / Global",
    },
    {
      role: "Full-Stack Developer",
      min: 75000,
      max: 125000,
      median: 98000,
      location: "Remote / Global",
    },
    {
      role: "Backend Engineer",
      min: 80000,
      max: 135000,
      median: 108000,
      location: "US / Europe",
    },
    {
      role: "Platform Engineer",
      min: 90000,
      max: 145000,
      median: 118000,
      location: "Hybrid / Global",
    },
    {
      role: "Technical Product Engineer",
      min: 70000,
      max: 120000,
      median: 95000,
      location: "India / Global",
    },
  ],
  growthRate: 18.4,
  demandLevel: "High",
  topSkills: [
    "API Design",
    "React",
    "Cloud Fundamentals",
    "SQL",
    "System Thinking",
  ],
  marketOutlook: "Positive",
  keyTrends: [
    "AI copilots inside internal tools",
    "Faster adoption of serverless workflows",
    "Higher demand for product-minded engineers",
    "Security reviews earlier in delivery cycles",
    "Lean teams relying on automation for ops",
  ],
  recommendedSkills: [
    "TypeScript",
    "Distributed systems basics",
    "Prompt engineering",
    "Monitoring and observability",
    "Business communication",
  ],
  lastUpdated: new Date("2026-05-20T08:00:00.000Z"),
  nextUpdate: new Date("2026-05-31T08:00:00.000Z"),
};

const demoAssessmentQuestions = [
  {
    question: "What is the main purpose of indexing in a relational database?",
    answer: "To speed up data retrieval for frequent queries",
    userAnswer: "To speed up data retrieval for frequent queries",
    isCorrect: true,
    explanation:
      "Indexes optimize lookup performance by helping the database find rows more efficiently.",
  },
  {
    question: "Why is input validation important in API development?",
    answer: "It prevents malformed or unsafe data from entering the system",
    userAnswer: "It prevents malformed or unsafe data from entering the system",
    isCorrect: true,
    explanation:
      "Input validation protects application integrity and reduces security and data quality risks.",
  },
  {
    question: "What is a strong first step when debugging a production issue?",
    answer: "Reproduce the issue and isolate the failing condition",
    userAnswer: "Restart every service immediately",
    isCorrect: false,
    explanation:
      "A reproducible case makes it much easier to confirm the root cause and verify the fix.",
  },
];

export const demoAssessments = [
  {
    id: "demo-assessment-1",
    userId: "demo-user",
    quizScore: 52,
    questions: demoAssessmentQuestions,
    category: "Technical",
    improvementTip:
      "Spend time practicing root-cause analysis and production debugging workflows under realistic constraints.",
    createdAt: new Date("2026-01-20T09:00:00.000Z"),
    updatedAt: new Date("2026-01-20T09:00:00.000Z"),
  },
  {
    id: "demo-assessment-2",
    userId: "demo-user",
    quizScore: 100,
    questions: demoAssessmentQuestions,
    category: "Technical",
    improvementTip: null,
    createdAt: new Date("2026-02-05T11:30:00.000Z"),
    updatedAt: new Date("2026-02-05T11:30:00.000Z"),
  },
  {
    id: "demo-assessment-3",
    userId: "demo-user",
    quizScore: 80,
    questions: demoAssessmentQuestions,
    category: "Technical",
    improvementTip:
      "Your foundations are strong. Push further on performance tradeoffs and edge-case reasoning.",
    createdAt: new Date("2026-03-02T16:00:00.000Z"),
    updatedAt: new Date("2026-03-02T16:00:00.000Z"),
  },
  {
    id: "demo-assessment-4",
    userId: "demo-user",
    quizScore: 40,
    questions: demoAssessmentQuestions,
    category: "Technical",
    improvementTip:
      "Review core backend concepts like validation, monitoring, and safe rollout practices before the next round.",
    createdAt: new Date("2026-04-11T13:15:00.000Z"),
    updatedAt: new Date("2026-04-11T13:15:00.000Z"),
  },
  {
    id: "demo-assessment-5",
    userId: "demo-user",
    quizScore: 60,
    questions: demoAssessmentQuestions,
    category: "Technical",
    improvementTip:
      "Keep building confidence in architecture tradeoffs and how to communicate them clearly under interview pressure.",
    createdAt: new Date("2026-05-21T18:45:00.000Z"),
    updatedAt: new Date("2026-05-21T18:45:00.000Z"),
  },
];

export const demoQuizQuestions = [
  {
    question:
      "What is the strongest reason to validate API input before processing it?",
    options: [
      "It blocks malformed or unsafe data from reaching application logic",
      "It guarantees every request will succeed",
      "It removes the need for database constraints",
      "It makes frontend testing unnecessary",
    ],
    correctAnswer:
      "It blocks malformed or unsafe data from reaching application logic",
    explanation:
      "Input validation protects data quality, reduces security risk, and helps keep downstream logic predictable.",
  },
  {
    question:
      "Which approach is best when debugging a bug that only appears in production?",
    options: [
      "Reproduce the issue with logs, isolate the failing condition, and verify the fix",
      "Restart every service and mark it resolved",
      "Change multiple systems at once to increase the chance of success",
      "Wait for more users to report the same issue before investigating",
    ],
    correctAnswer:
      "Reproduce the issue with logs, isolate the failing condition, and verify the fix",
    explanation:
      "A reproducible path plus targeted logging helps you find root cause and confirm the fix with confidence.",
  },
  {
    question:
      "When designing a new feature, what should come before choosing the implementation details?",
    options: [
      "Clarifying requirements, constraints, and success criteria",
      "Selecting the most complex architecture available",
      "Copying an earlier project without reviewing fit",
      "Optimizing prematurely for scale before defining the workflow",
    ],
    correctAnswer:
      "Clarifying requirements, constraints, and success criteria",
    explanation:
      "Strong technical decisions start with a clear problem definition and shared understanding of what success looks like.",
  },
  {
    question:
      "What best demonstrates maintainable frontend or full-stack code?",
    options: [
      "Clear structure, readable names, and focused components",
      "Putting every feature into one file for convenience",
      "Avoiding documentation because code should explain everything alone",
      "Using abstractions only because they feel advanced",
    ],
    correctAnswer:
      "Clear structure, readable names, and focused components",
    explanation:
      "Maintainability comes from making the code easy to understand, test, and extend over time.",
  },
  {
    question:
      "How should a candidate talk about technical tradeoffs in an interview?",
    options: [
      "Compare reliability, complexity, speed, and long-term maintenance",
      "Always choose the fastest option regardless of risk",
      "Only discuss tools and avoid business impact",
      "Pick one answer quickly without acknowledging assumptions",
    ],
    correctAnswer:
      "Compare reliability, complexity, speed, and long-term maintenance",
    explanation:
      "Interviewers usually look for balanced reasoning, not just a final answer.",
  },
];

export const demoResume = {
  id: "demo-resume",
  userId: "demo-user",
  content: `## <div align="center">Debarghya Banerjee</div>

<div align="center">

📧 debarghya@example.com | 📱 +91 98765 43210 | 💼 [LinkedIn](https://linkedin.com/in/debarghya) | 🐦 [Twitter](https://twitter.com/debarghya)

</div>

## Professional Summary

Product-minded full-stack developer with 3+ years of experience building career tools, dashboard workflows, and AI-assisted user experiences. Comfortable across React, Next.js, Prisma, PostgreSQL, and developer-focused product thinking.

## Skills

React, Next.js, TypeScript, Prisma, PostgreSQL, REST APIs, Tailwind CSS, Prompt Engineering, Product Thinking

## Work Experience

### Full-Stack Developer
Career Growth Studio | 2024 - Present

- Built AI-assisted career tooling used in demo onboarding, dashboard insights, and interview workflows
- Designed scalable CRUD flows across Prisma, Clerk, and server actions
- Improved reliability by adding fallbacks, validation, and safer state handling for AI-generated content

### Software Developer
Independent Projects | 2022 - 2024

- Developed portfolio-ready SaaS applications with strong UI polish and responsive behavior
- Integrated authentication, analytics, and markdown-driven export workflows
- Shipped resume and cover letter tooling with reusable component architecture

## Education

### Bachelor of Technology in Computer Science
Sample University | 2018 - 2022

## Projects

### PippoAI

- Built a career coaching platform with dashboards, AI content generation, and interview prep modules
- Added a guided demo mode so visitors can explore the product safely before signing in`,
  createdAt: new Date("2026-05-10T09:00:00.000Z"),
  updatedAt: new Date("2026-05-22T09:00:00.000Z"),
};

export const demoCoverLetters = [
  {
    id: "demo-cover-letter-1",
    userId: "demo-user",
    companyName: "NovaStack",
    jobTitle: "Frontend Engineer",
    jobDescription:
      "Build polished product interfaces, collaborate with backend engineers, and improve user-facing performance across the platform.",
    status: "completed",
    content: `# Debarghya Banerjee

Dear Hiring Team,

I am excited to apply for the Frontend Engineer role at NovaStack. My recent work has focused on building polished, user-centered web applications with React, Next.js, and modern product workflows.

In my current projects, I have shipped dashboard experiences, AI-assisted workflows, and responsive UI systems that balance speed, clarity, and maintainability. I enjoy translating product needs into interfaces that feel intuitive while still being technically robust.

I would bring a strong mix of frontend craftsmanship, cross-functional communication, and ownership over the user experience. I am especially excited by opportunities where thoughtful design and engineering quality directly shape customer trust.

Thank you for your time and consideration.

Sincerely,

Debarghya Banerjee`,
    createdAt: new Date("2026-05-12T08:30:00.000Z"),
    updatedAt: new Date("2026-05-12T08:30:00.000Z"),
  },
  {
    id: "demo-cover-letter-2",
    userId: "demo-user",
    companyName: "ScaleForge",
    jobTitle: "Full-Stack Developer",
    jobDescription:
      "Own product features end-to-end, work with APIs and data stores, and support fast iteration for internal and customer tools.",
    status: "completed",
    content: `# Debarghya Banerjee

Dear ScaleForge Team,

I am writing to express my interest in the Full-Stack Developer position at ScaleForge. I enjoy building end-to-end product experiences, from reliable backend flows to interfaces that make complex tasks feel simple.

Across recent projects, I have worked with Next.js, Prisma, PostgreSQL, and modern AI integrations to deliver practical tools for users. I care deeply about maintainable systems, clear product thinking, and shipping features that solve real workflow problems.

ScaleForge's emphasis on rapid product iteration and ownership across the stack is especially compelling to me. I would be excited to contribute both technical execution and user-focused decision making to your team.

Thank you for considering my application.

Best regards,

Debarghya Banerjee`,
    createdAt: new Date("2026-05-18T10:15:00.000Z"),
    updatedAt: new Date("2026-05-18T10:15:00.000Z"),
  },
];
