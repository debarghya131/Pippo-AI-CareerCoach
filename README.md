# 🤖 PippoAI : AI-powered career coach

PippoAI helps users build resumes, generate cover letters, practice interviews, and explore personalized career insights with AI.

## 🌐 Live Demo

Please check **Watch Demo** first to explore PippoAI in read-only demo mode before signing in.

<p>
  <a href="https://pippoai.debarghya.org/demo/start"><img src="public/watch-demo-button.svg" alt="Watch Demo" align="middle" /></a> 👈 Click Here
</p>

 Live link  : https://pippoai.debarghya.org

## 💡 Motivation

Job preparation can feel scattered across resume tools, cover letter templates, interview practice sites, and career research. PippoAI brings these workflows into one focused platform so users can prepare smarter and move with more confidence.

## ✨ Features

- 📄 AI-powered resume builder with markdown editing and PDF export
- 📝 Personalized cover letter generation for specific roles and companies
- 🎯 Mock interview quizzes with score tracking and improvement tips
- 📊 Industry insights with salary ranges, trends, demand level, and recommended skills
- 👀 Read-only demo mode for exploring the app before signing in
- 🔐 Secure authentication and user-specific saved career data

## 🏗️ Architecture

### 1. 3-Tier Client-Server Architecture

#### 👀 Demo Login Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 1: Client / Presentation Layer                                 │
│                                                                     │
│ Browser UI                                                          │
│ ├─ Landing Page                                                     │
│ ├─ Watch Demo Button                                                │
│ ├─ Demo Dashboard                                                   │
│ ├─ Demo Resume Preview                                              │
│ ├─ Demo Cover Letter Preview                                        │
│ └─ Demo Interview Preview                                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 2: Application / Business Logic Layer                          │
│                                                                     │
│ Next.js App Router + Server Actions + Middleware                    │
│ ├─ /demo/start sets demo cookie                                     │
│ ├─ Middleware allows protected pages for demo visitors               │
│ ├─ Demo helpers return sample profile, resume, letters, assessments │
│ ├─ Write actions are blocked in demo mode                           │
│ └─ Sign-in CTA exits demo for full access                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 3: Data / External Services Layer                              │
│                                                                     │
│ Demo Data + Optional External Auth                                  │
│ ├─ Static sample profile and career data                            │
│ ├─ Static sample resume                                             │
│ ├─ Static sample cover letters                                      │
│ ├─ Static sample interview assessments                              │
│ └─ Clerk only when user chooses to sign in                          │
└─────────────────────────────────────────────────────────────────────┘
```

#### 🔐 Authenticated User Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 1: Client / Presentation Layer                                 │
│                                                                     │
│ Browser UI                                                          │
│ ├─ Clerk Sign In / Sign Up                                          │
│ ├─ Onboarding Form                                                  │
│ ├─ Personalized Dashboard                                           │
│ ├─ Resume Builder                                                   │
│ ├─ Cover Letter Generator                                           │
│ └─ Interview Prep                                                   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 2: Application / Business Logic Layer                          │
│                                                                     │
│ Next.js App Router + Server Actions + Middleware                    │
│ ├─ Clerk middleware protects private routes                         │
│ ├─ User sync stores Clerk profile in Prisma                         │
│ ├─ Onboarding saves industry, experience, skills, and bio           │
│ ├─ Server actions manage resume, cover letters, quizzes, insights   │
│ ├─ Gemini AI generates personalized career content                  │
│ ├─ Rate limiter controls AI-heavy actions                           │
│ └─ Inngest refreshes industry insights on a schedule                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 3: Data / External Services Layer                              │
│                                                                     │
│ Neon PostgreSQL + Prisma + External APIs                            │
│ ├─ User profiles                                                    │
│ ├─ Resumes                                                          │
│ ├─ Cover letters                                                    │
│ ├─ Interview assessments                                            │
│ ├─ Industry insights                                                │
│ ├─ Rate limit events                                                │
│ ├─ Clerk authentication                                             │
│ └─ Gemini AI                                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. System Architecture & Workflow Diagram

#### 👀 Demo Login Workflow

```mermaid
flowchart TD
    A[Visitor opens PippoAI] --> B[Click Watch Demo]
    B --> C[/demo/start/]
    C --> D[Set pippo_demo cookie]
    D --> E[Redirect to Demo Dashboard]
    E --> F[Load sample industry insights]
    F --> G{Choose demo tool}
    G -->|Resume| H[Preview sample resume]
    G -->|Cover Letter| I[Preview sample cover letters]
    G -->|Interview| J[Preview sample assessments]
    G -->|Dashboard| K[View sample salary and trend insights]
    H --> L{Try to save or generate?}
    I --> L
    J --> L
    K --> L
    L -->|Yes| M[Show read-only demo message]
    L -->|No| N[Continue exploring]
    M --> O[Sign in for full access]
    N --> O
    O --> P[/demo/exit/]
    P --> Q[Clerk sign in or sign up]
```

#### 🔐 Authenticated User Workflow

```mermaid
flowchart TD
    A[Visitor opens PippoAI] --> B[Sign In or Sign Up]
    B --> C[Clerk authentication]
    C --> D{Authenticated?}
    D -->|No| E[Stay on auth page]
    D -->|Yes| F[Sync Clerk user to Prisma]
    F --> G{Profile onboarded?}
    G -->|No| H[Complete onboarding]
    H --> I[Save industry, experience, skills, bio]
    I --> J[Generate or load industry insights]
    G -->|Yes| J
    J --> K[Open personalized dashboard]
    K --> L{Choose career tool}
    L -->|Resume| M[Build, improve, save, export resume]
    L -->|Cover Letter| N[Generate and save cover letter]
    L -->|Interview| O[Generate quiz and save assessment]
    L -->|Insights| P[View salary, trends, demand, skills]
    M --> Q[(Neon PostgreSQL via Prisma)]
    N --> Q
    O --> Q
    P --> Q
    I --> Q
    M --> R[Gemini AI]
    N --> R
    O --> R
    J --> R
    S[Inngest weekly refresh] --> J
```

## 🗄️ Database Design

### 1. Database Schema / Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER {
        string id PK
        string clerkUserId UK
        string email UK
        string name
        string imageUrl
        string industry FK
        string bio
        int experience
        string[] skills
        datetime createdAt
        datetime updatedAt
    }

    INDUSTRY_INSIGHT {
        string id PK
        string industry UK
        json[] salaryRanges
        float growthRate
        string demandLevel
        string[] topSkills
        string marketOutlook
        string[] keyTrends
        string[] recommendedSkills
        datetime lastUpdated
        datetime nextUpdate
    }

    RESUME {
        string id PK
        string userId UK,FK
        string content
        float atsScore
        string feedback
        datetime createdAt
        datetime updatedAt
    }

    COVER_LETTER {
        string id PK
        string userId FK
        string content
        string jobDescription
        string companyName
        string jobTitle
        string status
        datetime createdAt
        datetime updatedAt
    }

    ASSESSMENT {
        string id PK
        string userId FK
        float quizScore
        json[] questions
        string category
        string improvementTip
        datetime createdAt
        datetime updatedAt
    }

    RATE_LIMIT_EVENT {
        string id PK
        string action
        string subject
        datetime createdAt
    }

    INDUSTRY_INSIGHT ||--o{ USER : "has users"
    USER ||--|| RESUME : "has one"
    USER ||--o{ COVER_LETTER : "creates"
    USER ||--o{ ASSESSMENT : "takes"
```

- `User` stores Clerk-linked profile and onboarding data.
- `IndustryInsight` stores AI-generated salary, trend, demand, and skill insights per industry.
- `Resume` stores one markdown resume per user.
- `CoverLetter` stores generated cover letters for job applications.
- `Assessment` stores interview quiz results and AI improvement tips.
- `RateLimitEvent` tracks AI action usage for daily rate limits.

### 2. Database Tables

| Table | Purpose | Key Relationships |
| --- | --- | --- |
| `User` | Stores Clerk identity, profile, onboarding data, skills, and selected industry. | Belongs to one `IndustryInsight`; has one `Resume`; has many `CoverLetter` and `Assessment` records. |
| `IndustryInsight` | Stores AI-generated career market data such as salary ranges, growth, trends, and recommended skills. | Connected to many users through the `industry` field. |
| `Resume` | Stores a user's markdown resume content, ATS score, and feedback. | One-to-one with `User`. |
| `CoverLetter` | Stores generated cover letters with company, job title, job description, and status. | Many-to-one with `User`. |
| `Assessment` | Stores mock interview quiz results, answers, scores, and improvement tips. | Many-to-one with `User`. |
| `RateLimitEvent` | Tracks AI feature usage for enforcing daily request limits. | Uses `subject` to identify the user or request owner for a limited action. |

## 📸 Screenshots

### 🏠 Landing Page

![Landing Page](public/screenshots/landing-page.png)

### 📊 Demo Dashboard / Industry Insights

![Demo Dashboard](public/screenshots/demo-dashboard.png)

### 📄 Resume Builder

![Resume Builder](public/screenshots/resume-builder.png)

### 📝 Cover Letters

![Cover Letters](public/screenshots/cover-letters.png)

### 🎯 Interview Preparation

![Interview Preparation](public/screenshots/interview-prep.png)

## 🛠️ Tech Stack

PippoAI is built with a modern full-stack JavaScript architecture, AI services, and a Neon-hosted PostgreSQL database.

| Category | Technology |
| --- | --- |
| Frontend | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| Backend | Next.js App Router, Server Actions, Middleware |
| Authentication | Clerk |
| Database | Neon PostgreSQL, Prisma ORM |
| AI | Google Gemini |
| Background Jobs | Inngest |
| Charts & UI | Recharts, Radix UI, Lucide React, Sonner |
| Forms & Validation | React Hook Form, Zod |
| Resume Export | Markdown editor, React Markdown, html2pdf.js |
| Deployment | Vercel-ready Next.js app |

## ⚙️ Installation

Follow these steps to run PippoAI locally.

1. Clone the repository:

```bash
git clone https://github.com/debarghya131/Pippo-AI-CareerCoach.git
cd Pippo-AI-CareerCoach
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app:

```text
http://localhost:3000
```

## 🔑 Environment Variables

Create a `.env` file in the project root and add the following values:

```bash
DATABASE_URL=your_neon_postgresql_connection_string
GEMINI_API_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string used by Prisma. |
| `GEMINI_API_KEY` | Google Gemini API key for AI-generated insights, resumes, cover letters, and quizzes. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk key used by the frontend. |
| `CLERK_SECRET_KEY` | Secret Clerk key used by the server. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route for Clerk. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route for Clerk. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect path after sign-in. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect path after sign-up. |

## 🧩 Challenges Faced

- Handling two user paths: read-only demo visitors and fully authenticated users.
- Keeping AI responses reliable when generated JSON or text output may be inconsistent.
- Protecting private routes while still allowing demo users to explore the app.
- Preventing excessive AI usage and controlling daily generation limits.
- Managing user-specific career data across resumes, cover letters, assessments, and industry insights.
- Exporting resume content cleanly from a dark-themed app into a readable PDF.

## ✅ Solutions Implemented

- Added a demo mode cookie flow with sample data and blocked write actions for demo visitors.
- Used Clerk middleware and route checks to protect authenticated product pages.
- Added fallback parsing and default data for AI-generated insights and interview questions.
- Implemented database-backed rate limiting with `RateLimitEvent`.
- Designed Prisma models for users, resumes, cover letters, assessments, and industry insights.
- Added PDF export styling overrides so resumes export with a clean light background.
- Added Inngest scheduled jobs to refresh industry insights automatically.

## 🧪 Testing

- Ran ESLint to verify code quality and catch common issues.
- Built the production app with `next build` to validate routes, server components, and optimized output.
- Tested demo mode pages to confirm protected routes can be previewed without authentication.
- Verified read-only demo behavior for save, generate, and export actions.
- Checked core flows for dashboard insights, resume preview, cover letters, and interview prep.

```bash
npm run lint
npm run build
```

## ⚡ Optimization

- Uses Next.js App Router for server-rendered pages and optimized routing.
- Loads protected dashboard data through server actions to reduce unnecessary client-side fetching.
- Uses demo data for preview mode to avoid unnecessary database and AI calls.
- Adds fallback AI responses so the app remains usable if an AI request fails.
- Uses Inngest scheduled refreshes instead of regenerating industry insights on every request.
- Keeps AI-heavy actions rate-limited to reduce cost and protect performance.

## 🔒 Security

- Uses Clerk for authentication and protected user sessions.
- Protects private routes with Clerk middleware.
- Stores secrets in `.env` and keeps environment files ignored by Git.
- Blocks write actions in demo mode to prevent accidental data changes.
- Scopes database queries by user ID for user-owned resumes, cover letters, and assessments.
- Uses Prisma ORM to interact with the database safely.
- Applies database-backed rate limits to reduce abuse of AI generation endpoints.

## 🚀 Future Improvements

- Add resume ATS scoring with detailed section-by-section feedback.
- Support multiple resumes per user for different job roles.
- Add behavioral interview practice alongside technical quizzes.
- Include job tracking so users can manage applications and generated cover letters together.
- Add richer analytics for quiz progress, weak areas, and skill growth over time.
- Add email reminders for interview practice and profile updates.
- Improve AI prompt customization based on target role, seniority, and location.

## 📚 Learnings

- Learned how to combine Next.js App Router, server actions, and middleware for a full-stack product.
- Gained experience integrating Clerk authentication with a Prisma-backed user database.
- Practiced designing relational data models for career tools and user-specific content.
- Learned how to make AI features more reliable with parsing, normalization, and fallback responses.
- Improved understanding of rate limiting for cost control and abuse prevention.
- Learned how to support both demo users and authenticated users without duplicating the whole app flow.

## 👤 Author Details

### 🤝 Be My Friend

I always like to make new friends. Follow me on:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Debarghya%20Bandyopadhyay-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/debarghya-bandyopadhyay-953b02400?utm_source=share_via&utm_content=profile&utm_medium=member_android)

[![X](https://img.shields.io/badge/X-debarghya131-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/debarghya131)

[![GitHub](https://img.shields.io/badge/GitHub-debarghya131-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/debarghya131)

[![Portfolio](https://img.shields.io/badge/Portfolio-portfolio.debarghya.org-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://portfolio.debarghya.org)

[![Email](https://img.shields.io/badge/Email-debarghyabandyopadhyay191%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:debarghyabandyopadhyay191@gmail.com)
