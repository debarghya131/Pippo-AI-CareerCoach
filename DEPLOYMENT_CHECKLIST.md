# Deployment Checklist

Use this before shipping `pippo-ai` to production.

## 1. Environment Variables

Make sure these are set in your deployment platform:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `DATABASE_URL`
- `GEMINI_API_KEY`

Optional / not currently required by code:

- `ARCJET_KEY`

## 2. Clerk Setup

- Add your production domain in Clerk.
- Verify sign-in and sign-up redirect URLs match your deployed domain.
- Confirm `/sign-in` and `/sign-up` work correctly in production.
- Confirm demo-mode sign-in exits demo and lands on `/dashboard`.

## 3. Database

- Point `DATABASE_URL` to the production PostgreSQL database.
- Apply migrations:

```bash
npx prisma migrate deploy
```

- Confirm the following production data paths work:
  - user bootstrap
  - onboarding save
  - resume save
  - cover letter create/delete
  - quiz result save
  - rate-limit table writes

## 4. Prisma / Build

- Generate Prisma client if needed:

```bash
npx prisma generate
```

- Run pre-deploy checks:

```bash
npx prisma validate
npm run lint
npm run build
```

## 5. AI / Gemini

- Verify `GEMINI_API_KEY` is valid in production.
- Test these AI-backed flows:
  - resume improvement
  - cover letter generation
  - quiz generation
  - quiz improvement feedback
  - industry insight generation

## 6. Rate Limiting

Current per-user daily limits:

- Resume AI improve: `1/day`
- Cover letter generation: `1/day`
- Quiz generation: `1/day`
- Quiz AI feedback tip: `1/day`
- Industry insight generation: `2/day`

Before launch:

- confirm rate-limit writes work in production
- confirm user-facing error messages are understandable
- confirm demo mode does not consume live user actions unexpectedly

## 7. Demo Mode

- Enter `/demo`
- Confirm `pippo_demo` cookie is set
- Confirm protected routes open in read-only mode
- Confirm demo reads show sample data
- Confirm write actions are blocked
- Sign in from demo and confirm the app exits demo automatically
- Confirm `Exit Demo` clears the cookie

## 8. Auth / Access Control

- Signed-out users should be redirected from:
  - `/dashboard`
  - `/resume`
  - `/interview`
  - `/ai-cover-letter`
  - `/onboarding`

- Confirm authenticated users can access their real data.
- Confirm signed-in users in demo mode are still read-only until demo exits.
- Confirm sign-out from demo clears demo mode.

## 9. Core Product Smoke Test

- Landing page loads
- Sign up works
- Sign in works
- Sign out works
- Onboarding saves and redirects
- Dashboard loads insights
- Resume builder:
  - form mode
  - markdown mode
  - save
  - cancel draft
  - PDF export
- Cover letters:
  - create new
  - list page
  - detail page
  - delete
- Interview:
  - start quiz
  - answer flow
  - result save
  - result dialog

## 10. Mobile QA

Run the checks in:

- [MOBILE_QA_CHECKLIST.md](/home/debarghya/Project/AI-Career-coach/pippo-ai/MOBILE_QA_CHECKLIST.md)

Recommended minimum viewports:

- `390 x 844` (iPhone 14)
- `375 x 667`
- `412 x 915`

## 11. Inngest

- Confirm `/api/inngest` is reachable in production.
- Confirm your Inngest environment is configured to call the production app.
- Verify scheduled industry insight refresh jobs can run without auth issues.

## 12. Final Launch Pass

- Run:

```bash
npx prisma migrate deploy
npm run build
npm run start
```

- Perform one signed-out smoke test
- Perform one signed-in smoke test
- Perform one demo-mode smoke test
- Perform one mobile smoke test

## 13. Rollback Readiness

Before launch:

- know how to revert the deployment
- keep the previous working environment values available
- keep a database backup / restore plan if schema or production data changes are involved
