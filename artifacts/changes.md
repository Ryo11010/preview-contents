# Changes (single-file)

> 各会話=1修正のアプローチ/ロジックを追記します。

## 目次

### 2025-12-08 GID=20251208_142847__restore Turn=T01
- 目的: リポジトリ復旧と /projects ドラッグ即プレビュー環境の再構築（1階層/2階層対応）。
- 参照: 直近復旧対応につき成功/失敗事例なし。
- 代替案: (A) 最小構成で再生成（採用）、(B) timetime ビルドまで含め復旧、(C) /projects を後回し。
- 実施: scripts/bootstrap/update-gitignore を再配置し artifacts を再初期化。.htaccess（ルート）/index.html/previews.json/errors/maintenance を再生成。/projects/.htaccess を per-dir 書式で再配置し、1階層/2階層どちらも index.html にフォールバック。docs/PreviewContentsSite_Usage.md を復旧し /projects ドラッグ運用を明記。file-map/_timeline/_catalog/_index/logbook/qa を更新。
- 検証: 設定・静的ファイルのみのためビルドなし。
- 影響: /projects 配下にアップしたプロジェクトをそのままプレビュー可能。サンプルエントリは削除し previews.json は空配列。
- ロールバック: 追加/再生成した静的ファイルを削除し、.htaccess を以前の版に戻す。

### 2025-12-08 GID=20251208_182220__auto_preview Turn=T01
- 目的: /projects へドラッグした timetime / portfolioSite を即プレビュー可能にし、一覧を自動生成する。
- 参照: 成功 `S-001`（projects/.htaccess の SPA フォールバック維持）を踏まえ、フォールバックを壊さない構成を採用。失敗 `F-001`（資材欠損で 404/500）を防ぐため、ビルド済み成果物を配置し、dotfiles を拒否。
- 代替案: (A) 手動 previews.json 追記のみ、(B) 走査スクリプトで自動生成＋ビルド（採用）、(C) 一覧のみ更新してビルドは後回し。
- 実施: timetime の Vite base を `/projects/timetime/stg/` へ変更し outDir を `../stg` に設定、ビルド出力を配置。.htaccess を base に合わせ修正。portfolioSite は `output: 'export'`＋`images.unoptimized` で静的書き出し、Google Fonts 依存を排除（システムフォント＋CSS変数）。`metadataBase` を siteOrigin のみへ修正しダブル basePath を解消。API ルートを削除し、ギャラリーフェッチは静的データにフォールバックする実装に変更。`NEXT_PUBLIC_BASE_PATH=/projects/portfolioSite/preview`、`NEXT_PUBLIC_SITE_ORIGIN=https://preview-contents.site` でビルドし `/projects/portfolioSite/preview/` に配置。`scripts/generate-previews-json.mjs` を新設し、ビルド済みの project/env を走査して `previews.json` を自動生成（ソースディレクトリや dotfiles を除外）。projects/.htaccess に dotfiles ブロックを追加。index.html は生成された previews.json で timetime / portfolioSite が即表示される。
- 追加: 本番不要な dotfiles/メタファイル（`projects/portfolioSite/.git*`, `.env`, `AGENTS.md`, `CLAUDE.md`, `projects/timetime/.git*`, `.DS_Store` 等）を削除し、アップロードリークを予防。
- 検証: `npm run build` (timetime) / `npm run export` (portfolioSite) を実行。`node scripts/generate-previews-json.mjs` で 2 件生成を確認。ブラウザ実行は未。
- 影響: /projects 配下に timetime/stg と portfolioSite/preview を配置済み。previews.json が自動生成されるためドラッグ後にスクリプト実行で一覧に反映される。dotfiles への直接アクセスは禁止。
- ロールバック: `/projects/timetime/stg` と `/projects/portfolioSite/preview` を削除し、previews.json を空配列に戻す。`projects/.htaccess` からブロックルールを除去し、Vite/Next 設定を元に戻す。
