# Edit Index — Workset 20251205__portfolio-site

- 20251205_145824__portfolio-site-build — Status: In Progress — Create a Next.js App Router portfolio site (outside `/mockup`) that mirrors the mockup UI with data-driven content from the requirements doc; prep for local preview with Tailwind + Framer Motion.
- 20251205_161200__music-icon-import — Status: Completed — Add missing `Music` icon import in `src/data/projects.ts` to resolve the FocusZen runtime error during preview.
- 20251205_173500__tailwind-style-recovery — Status: Completed — Harden Tailwind content resolution with absolute paths and broader globs so utilities generate and UI styling renders correctly.
- 20251205_190000__postcss-config-fix — Status: Completed — Switch PostCSS config to CommonJS (`postcss.config.js`) so Next picks up Tailwind/Autoprefixer and generates utilities.
- 20251205_192700__postcss-explicit-config — Status: Completed — Explicitly require Tailwind with a config path in `postcss.config.js` to force utility generation.
- 20251206_013025__gitignore-cleanup — Status: Completed — Expanded root `.gitignore` to exclude Next/Node build outputs, caches, logs, and OS/editor temp files to reduce Git noise.
- 20251206_014702__funteru-content-refresh — Status: Completed — Replaced mock portfolio copy with official information from `funteru.co.jp` while keeping the data-driven structure (site metadata, hero copy, profile, projects, timeline)。
- 20251206_022159__hero-copy-simplify — Status: Completed — Shortened the hero headline and subcopy for a clearer personal portfolio message.
- 20251206_023552__hero-english-motto — Status: Completed — Converted the hero headline to a concise English motto (data-only change).
- 20251206_025034__hero-status-catchy — Status: Completed — Updated the hero badge text to a catchier line while keeping layout unchanged.
- 20251206_033641__gitignore-next-ignore — Status: Completed — Added explicit `.next/` and `site/.next/` ignore rules and removed tracked `site/.next` artifacts from the index to stop Git noise.
- 20251206_114500__portfolio-refactor-quality — Status: Completed — Centralized copy/tokens (background/folder motion/sheet thresholds), moved gallery to `next/image`, lint passed; build blocked offline by Google Fonts fetch.
- 20251207_133935__timeline-month — Status: Completed — Added month data to timeline items and display, formatting as YYYY.MM on the Journey pills while keeping UI intact.
- 20251207_150500__work-card-overflow — Status: Completed — Kept edge-aware fan-out to stop edge clipping; reverted hover z-index/state changes due to instability (logged as failure case).
