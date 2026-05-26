# Mobile QA Checklist

Use this checklist before deploying UI changes.

## Viewports

- iPhone 14: `390 x 844`
- iPhone SE: `375 x 667`
- Pixel / Android baseline: `412 x 915`

## Global Checks

- Header fits without horizontal overflow.
- Primary actions are tappable without crowding.
- No text is clipped or overlapping.
- No page introduces horizontal scrolling.
- Fixed headers, dialogs, and dropdowns open fully on screen.
- Long user content wraps cleanly.

## Landing Page

- Hero headline wraps cleanly.
- CTA buttons stack nicely on narrow widths.
- Hero image stays inside viewport.
- Feature cards maintain even spacing.
- Testimonials do not clip names or companies.
- FAQ accordion text remains readable.

## Auth

- Sign-in page opens at the top without layout drag.
- Sign-up page centers correctly on mobile.
- Clerk social buttons and inputs fit without overflow.
- OTP / multi-step Clerk states remain visible on small screens.

## Dashboard / Industry Insights

- Title and `Edit Profile` button stack correctly.
- Stat cards do not crowd each other.
- Salary section is readable on mobile.
- Long role names and skill badges wrap correctly.

## Onboarding

- Industry and specialization selectors open fully.
- Number input, skills input, and bio field remain readable.
- Submit and cancel buttons stay full width and tappable.

## Resume Builder

- Top action bar stacks cleanly.
- Form and Markdown tabs remain tappable.
- Markdown editor toolbar does not overflow the screen.
- Existing resume notice and draft notice wrap correctly.
- Entry add/edit cards remain usable on small screens.
- PDF / save buttons remain accessible while keyboard is open.

## Cover Letters

- Cover letter list cards wrap title/company/date cleanly.
- `Create New` button stays accessible.
- Generator form drops to one column on mobile.
- Cover letter preview page remains readable without horizontal scroll.

## Interview Prep

- Summary cards stack cleanly.
- Performance chart remains legible on mobile.
- Recent quiz cards wrap score/date/improvement tip cleanly.
- `Start New Quiz` button is easy to tap.

## Mock Interview

- Quiz answers are easy to tap.
- Question text does not collide with radio controls.
- Footer buttons stack correctly on small screens.
- Result dialog fits on screen and scrolls correctly.
- Improvement tip and explanations wrap without clipping.

## Demo Mode

- Demo banner wraps correctly on mobile.
- Demo sign-in / exit buttons remain visible and tappable.
- Read-only notices are readable in all demo pages.

## Edge States

- Empty states look intentional on mobile.
- 404 page is centered and readable.
- Long generated AI output does not break layout.
- Toasts do not obscure critical form controls.

## Final Pass

- Run `npm run lint`
- Run `npm run build`
- Test at least one signed-out flow and one signed-in flow
- Test at least one demo-mode flow
