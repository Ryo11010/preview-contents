# Failure Case — 20251207_150500__work-card-overflow

- Issue: Per-card hover z-index prioritization introduced instability (flicker/ordering glitches) in Work folder cards.
- Action: Reverted hover z-index/state changes to the prior stable behavior while keeping the edge anchor offset improvements.
- Next: If hover stacking is retried, design a deterministic z-index strategy (e.g., fixed order with pointer enter/leave debouncing) and validate across browsers before rollout.
