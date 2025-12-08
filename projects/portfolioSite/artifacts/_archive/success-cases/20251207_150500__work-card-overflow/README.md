# Success Case — 20251207_150500__work-card-overflow

- What worked: Adjusted folder fan-out to anchor from grid edges (`edgeAnchorOffset`), making edge cards expand inward without clipping.
- Files: `site/src/components/Folder.tsx` (anchor offset in transform), `site/src/config/tokens.ts` (`edgeAnchorOffset` token).
- Notes: Hover behavior was reverted due to instability; only the anchor offset change is retained as the successful pattern.
