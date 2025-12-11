# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app` (route files, `layout.tsx`, global styles in `globals.css`).
- Reusable UI lives in `src/components`, split into `layout`, `common`, and `sections` for each learning module.
- State is managed with Redux Toolkit in `src/store` and typed hooks in `src/hooks`; shared helpers are in `src/lib`; domain types in `src/types`.
- Static assets reside in `public/`; design references and audit screenshots land in `docs/` (see `docs/screenshots` after running the audit script).
- Use the `@/*` path alias defined in `tsconfig.json` instead of long relative imports.

## Build, Test, and Development Commands
- `bun install` (or `npm install`): install dependencies.
- `bun dev` / `npm run dev`: start the Next.js dev server with hot reload.
- `bun run build` / `npm run build`: create the production build.
- `bun start` / `npm start`: run the compiled app.
- `bun run lint` / `npm run lint`: ESLint (Next.js config) for TypeScript/React correctness.
- Optional smoke audit: `node test-math-audit.js` (requires `chrome-launcher` and `ws`; captures flow screenshots to `docs/screenshots` against `http://localhost:3030`).

## Coding Style & Naming Conventions
- TypeScript with strict settings; prefer functional React components and hooks. Keep client components explicit via `'use client'` where needed.
- Two-space indentation; PascalCase for components and file names in `src/components/*`, camelCase for functions/variables, UPPER_SNAKE for constants.
- Styling primarily via Tailwind v4 classes with the inline theme tokens defined in `globals.css`; keep colors/spacings aligned to the CSS variables to preserve the paper-craft look.
- Keep logic side-effect free in components; move shared calculations to `src/lib` and shared state to slices under `src/store`.

## Testing Guidelines
- Linting is the baseline gate; run `bun run lint` before pushing.
- Manual QA: verify each section can be navigated via the top Navigation and that practice modules save/restore session data.
- For regressions that touch animations or layout, capture before/after screenshots (the audit script can help) and note any accessibility impacts (focus order, aria labels).

## Commit & Pull Request Guidelines
- Follow the existing history: short, imperative subjects (e.g., “Add interactive borrowing with click-to-borrow UI”).
- PRs should include a concise summary, linked issue (if any), and screenshots/gifs for visual changes (especially in `src/components/sections`).
- List the commands/tests you ran (lint, dev smoke, audit script) in the PR body. Call out any known follow-ups or TODOs in code comments sparingly.
