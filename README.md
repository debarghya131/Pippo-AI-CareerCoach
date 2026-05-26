# PippoAI

PippoAI is an AI-powered career coach built with Next.js. It helps users create resumes, generate cover letters, practice interviews, and explore industry insights with a demo mode for product previews.

## Features

- AI resume builder with markdown editing and PDF export
- AI cover letter generation and saved cover letter history
- Mock interview quizzes with score tracking and feedback
- Industry insights with salary ranges, trends, skills, and demand outlook
- Clerk authentication with a separate read-only demo mode
- Prisma + Postgres data layer
- Inngest-powered scheduled industry insight refreshes
- Per-user daily rate limits for AI-heavy actions

## Tech Stack

- Next.js 15
- React 19
- Clerk
- Prisma
- PostgreSQL
- Gemini
- Inngest
- Tailwind CSS
- shadcn/ui
- Recharts

## Main Product Areas

- `/dashboard` - Industry insights and career data
- `/onboarding` - User profile and industry setup
- `/resume` - Resume builder and export flow
- `/ai-cover-letter` - Cover letter generation and management
- `/interview` - Interview prep dashboard and quiz history
- `/demo` - Read-only product preview flow

## Environment Variables

Create a `.env` file with:

```bash
DATABASE_URL=
GEMINI_API_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Getting Started

Install dependencies:

```bash
npm install
```

Generate the Prisma client and run migrations:

```bash
npx prisma migrate deploy
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npx prisma validate
npx prisma migrate deploy
```

## Demo Mode

PippoAI includes a demo mode that allows visitors to preview protected product pages without a real account.

- Demo mode is enabled through `/demo/start`
- Demo mode is cleared through `/demo/exit`
- Demo users can read sample data but cannot perform write actions
- Signed-in users who enter demo mode stay authenticated, but demo mode remains read-only until exit

## Rate Limits

Current per-user AI limits:

- Resume AI improve: `1/day`
- Cover letter generation: `1/day`
- Quiz generation: `1/day`
- Quiz feedback tip generation: `1/day`
- Industry insight generation: `2/day`

## Architecture Notes

- Auth and route protection are handled with Clerk middleware in [middleware.js](./middleware.js)
- Server actions live in [`actions/`](./actions)
- Demo mode helpers live in [`lib/demo-server.js`](./lib/demo-server.js) and [`lib/demo-data.js`](./lib/demo-data.js)
- Prisma schema lives in [`prisma/schema.prisma`](./prisma/schema.prisma)
- Scheduled insight refresh runs through Inngest in [`lib/inngest/function.js`](./lib/inngest/function.js)

## Deployment

This project is ready for platforms like Vercel.

Basic production steps:

1. Add the required environment variables in your hosting provider.
2. Point `DATABASE_URL` to your production Postgres database.
3. Run:

```bash
npx prisma migrate deploy
```

4. Build and start:

```bash
npm run build
npm run start
```

For Vercel, import the repository, keep the default Next.js settings, add the env vars, and make sure your Clerk production redirect URLs match your deployed domain.

## Notes

- `postinstall` runs `prisma generate`
- The project uses dark theme styling by default
- Demo cookies are `httpOnly` and `secure` in production

## Author

Built by Debarghya.
