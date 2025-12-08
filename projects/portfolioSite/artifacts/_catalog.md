# Catalog

- UI/Frontend
  - Workset `20251204__ui-hardening`: Portfolio React UI technical debt reduction (single-file constraint, maintain existing preview/UX). Status: Edits `20251204_150627__ui-refactor`, `20251204_211221__folder-interaction`, `20251204_214311__app-hardening`, `20251204_230100__app-native-ready` completed.
    - Completed: `20251205_142847__app-debt-burndown` — app.tsx hardened with typed categories, centralized labels/lookup, guarded browser actions, and stabilized responsive/gallery behavior while keeping single-file UI/preview unchanged.
  - Workset `20251205__portfolio-site`: Build a production Next.js portfolio (separate from `/mockup`) mirroring the mockup UI and requirements doc. Status: Edit `20251205_145824__portfolio-site-build` in progress (plan approved, implementation underway).
    - Completed: `20251205_161200__music-icon-import` — Added missing `Music` icon import in `src/data/projects.ts` to clear the FocusZen runtime error in dev preview; no other content changes.
    - Completed: `20251205_173500__tailwind-style-recovery` — Hardened Tailwind content scanning (absolute paths, js/jsx/mdx globs) so utilities generate and styling restores in dev preview.
    - Completed: `20251205_190000__postcss-config-fix` — Switched PostCSS config to CommonJS so Next loads Tailwind/Autoprefixer and generates utilities.
    - Completed: `20251205_192700__postcss-explicit-config` — Explicitly required Tailwind with the TS config path in PostCSS to force utility generation.
    - Completed: `20251206_013025__gitignore-cleanup` — Expanded root `.gitignore` to ignore Next/Node build outputs, caches, logs, and OS/editor temp files, reducing Git noise.
    - Completed: `20251206_014702__funteru-content-refresh` — Replaced mock portfolio copy with official information from `funteru.co.jp` while keeping data-driven sections (site metadata/profile/projects/timeline)。
    - Completed: `20251206_022159__hero-copy-simplify` — Simplified hero headline and subcopy for a clearer personal portfolio message.
    - Completed: `20251206_023552__hero-english-motto` — Converted the hero headline to a concise English motto (data-only change).
    - Completed: `20251206_025034__hero-status-catchy` — Updated the hero badge text to a catchier line while keeping layout unchanged.
    - Completed: `20251206_033641__gitignore-next-ignore` — Added explicit `.next/` ignore rules and removed tracked `site/.next` artifacts from the index to eliminate Git noise.
    - Completed: `20251206_114500__portfolio-refactor-quality` — Centralized copy/tokens (background/folder motion/sheet thresholds), adopted `next/image` for galleries, lint passed; build blocked offline by Google Fonts fetch.
    - Completed: `20251207_133935__timeline-month` — Added month metadata to Journey timeline items and display them as YYYY.MM on the pills while keeping UI/UX unchanged.
    - Completed: `20251207_150500__work-card-overflow` — Kept edge-aware fan-out anchors to stop edge clipping; hover z-index/state tweaks proved unstable and were reverted (failure recorded).
