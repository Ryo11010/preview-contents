# Evaluation — Edit 20251206_112651__eslint-config

- Result: Success
- Scope: Added `site/.eslintrc.cjs` (extends `next/core-web-vitals`, `no-console` except warn/error) and `.eslintignore` (ignore .next/node_modules/artifacts/etc.) so `npm run lint` runs non-interactively.
- Verification: `npm run lint` now runs without the Next.js wizard and completed with 2 warnings about `<img>` usage in `src/components/ProjectDetailSheet.tsx`. No errors.
- Hardcode policy: Added only lint configuration; no environment-dependent values or content changes.
- Follow-ups: Decide whether to address or suppress `@next/next/no-img-element` warnings in `ProjectDetailSheet.tsx`.
