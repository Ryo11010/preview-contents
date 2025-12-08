# Workset 20251205__portfolio-site — Portfolio Site Build

## Purpose
- Build a production-ready portfolio web app (Next.js + TypeScript) that faithfully mirrors the `mockup/mockup.tsx` UI while aligning with `docs/Portfolio_Requirements_v1.1.md`.
- Keep the new implementation separate from `/mockup` (e.g., `site/`), data-driven, and easy to update without touching components.
- Prepare for interactive preview (dev server runnable locally) with responsive and motion polish consistent with the mock.

## Definition of Done
- New Next.js App Router project lives outside `/mockup` with working scripts for dev/preview/build, and pages load without runtime errors.
- Hero/Work/History/About (skills & interests) sections replicate the mockup design (glassmorphism, gradients, motion, dock navigation, sheets/cards) using Tailwind + Framer Motion, with content pulled from typed data modules derived from the requirements doc.
- Hardcode禁止: URLs・メール・メタデータ・閾値・コピーは設定/定数/コンテンツモジュールに集中管理し、ロジックに直書きしない。環境依存値は env or config を介す。
- /artifacts の 3+1 と `file-map.md`／インデックス／タイムライン更新を完了し、DoD と合致していることを確認。

## Known Pitfalls & Guardrails
- No-Plan, No-Code: 承認前に実装差分を出さない。
- 3+1 必須 + `file-map.md` 省略なし。Workset/Index/Timeline を忘れない。
- 500 行ルール・命名規約順守。UI/データをコンポーネント＆定数分離し、マジックナンバー排除。
- ハードコード絶対禁止: 外部リンク・コピー・閾値・ロール名などは data/config 経由に限定。
- モックの質感（グラス・グラデーション・動き）を崩さず、要件 doc のコンテンツ構造を反映。

## Success Points to Reuse
- 20251205_142847__app-debt-burndown: 型/定数集中・ブラウザガード徹底 → 新規プロジェクトもデータ辞書＋ガード付きヘルパーで組む。
- 20251204_230100__app-native-ready: プラットフォーム依存処理のブリッジ化 → Web API 呼び出しをユーティリティに集約。
- 20251204_214311__app-hardening: セクション分割とトークン集約で UI を維持しつつ可読性向上 → 同様にセクション毎のコンポーネント化とトークン管理を踏襲。

## Timeline
- 2025-12-05: Workset 起票。Edit `20251205_145824__portfolio-site-build` で Next.js 実装計画を策定（承認待ち）。
- 2025-12-06: Edit `20251206_013025__gitignore-cleanup` 完了 — ルート `.gitignore` を拡充し、Next/Node のビルド成果物・キャッシュ・ログ・OS ファイルを除外して Git ノイズを削減。
- 2025-12-06: Edit `20251206_033641__gitignore-next-ignore` 完了 — `.next/` と `site/.next/` を明示的に無視し、既存の `site/.next` 追跡分をインデックスから除外。
- 2025-12-06: Edit `20251206_114500__portfolio-refactor-quality` 実施 — セクション文言/コピーを `config/copy.ts` に集約し、背景/フォルダモーション/シート閾値をトークン化、ギャラリーを `next/image` へ移行して lint 通過。ビルドは Google Fonts (Manrope) の取得がオフラインで失敗するため要ネットワーク環境。
- 2025-12-07: Edit `20251207_133935__timeline-month` 完了 — Timeline（Journey）のピルに年+月（YYYY.MM）を表示するため、月データを追加しフォーマットヘルパーで描画。
