# Workset 20251204__ui-hardening — Portfolio UI Hardening

## Purpose
- Remove accumulated技術負債 in the portfolio React UI while keeping the current canvas preview and user-facing behavior unchanged.
- Improve stability and maintainability without splitting the code across multiple files (per要件: single code file).

## Definition of Done
- `app.tsx` stays single-file but is reorganized for clarity・型安全性・再利用性.
- Hardcode禁止（環境依存値は設定/定数に集約、コンテンツ値は意味のある定数で集中管理）。
- /artifacts の 3+1 一式と `file-map.md` が更新され、タイムライン/カタログ/index が追従。
- 既存 UI / 動作 / プレビュー体験は変えない。

## Known Pitfalls & Guardrails
- No‑Plan, No‑Code: 承認前は実装差分を出さない。
- 500 行ルール: 単一ファイル要件により完全遵守が難しいため、行数圧縮と責務整理を試み、残る場合は理由を明記。
- ハードコード絶対禁止: URL・ID・閾値・文言など環境変動値を直接埋め込まない。必要に応じて定数セクションに集約。
- 3+1 必須: before/after/diff/meta を Edit ごとに整備。

## Success Points to Reuse
- App default exportとスクロール／シート／ドックの既存 UX を保持する。
- 依存の少ないユーティリティ化で可読性と再利用性を高める。

## Timeline
- 2025-12-04: Workset 起票（UI ハードニング方針策定）。
- 2025-12-04: Edit `20251204_150627__ui-refactor` — plan 作成中（承認待ち）。
- 2025-12-04: Edit `20251204_150627__ui-refactor` — app.tsx を型定義と定数集約で整理（UI/プレビュー維持）。
- 2025-12-04: Edit `20251204_211221__folder-interaction` — FolderInteraction モックを定数・型・再利用コンポーネントで整理し、UI/プレビューを維持したまま負債を削減。
- 2025-12-04: Edit `20251204_214311__app-hardening` — app.tsx をセクション単位のコンポーネント化とヘルパー集約で安定化（UI/プレビュー維持）。
- 2025-12-04: Edit `20251204_230100__app-native-ready` — DOM/ブラウザ依存処理をプラットフォームブリッジに集約し、セクション監視やシェア/リンク操作をガード化して RN 移行を見据えた安定化を実施（UI/プレビュー不変）。
- 2025-12-05: Edit `20251205_142847__app-debt-burndown` — app.tsx を型強化（カテゴリ Union 化）、定数/ラベル/辞書の集中管理、ブラウザ API ガード、レスポンシブ・ギャラリー挙動の安定化で負債を除去（UI/プレビュー不変）。
