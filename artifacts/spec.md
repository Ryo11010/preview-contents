# Specification (single-file)

> 本ファイルはプロジェクトの全仕様を1ファイルで管理します。

## 目次

## 1. 概要

## 2. UI/UX

## 3. 機能要求
- `/projects/{project}/{env}/` にドラッグしたビルド成果物を自動で一覧化するため、`scripts/generate-previews-json.mjs` で `previews.json` を生成する。`projects` 直下/第2階層で `index.html` が存在し、かつ `package.json` がないディレクトリのみを対象とする。
- timetime は `/projects/timetime/stg/` を base としてビルド（Vite base）。portfolioSite は `output: 'export'` + `images.unoptimized` で静的書き出しし、`NEXT_PUBLIC_BASE_PATH=/projects/portfolioSite/preview` で配置する。

## 4. API/契約

## 5. データ/DB/永続化

## 6. 設定/FeatureFlag

## 7. エラー/例外/リトライ

## 8. 性能/SLO/SLI

## 9. セキュリティ

## 10. ログ/トレース/観測

## 11. Dev/Build/CI
- previews.json の生成手順: `/projects` に成果物を配置後、`node scripts/generate-previews-json.mjs` を実行する。
- projects/.htaccess で `.git` / `.env` / `.htaccess` 等のドットファイルへの直接アクセスを拒否する。

## 12. 変更履歴(要約)
- 2025-12-08: 復旧対応。ルート資材・projects/.htaccess を再生成し、/projects 直下の1階層/2階層に対応。
- 2025-12-08: timetime/portfolioSite をビルド配置し、previews.json 自動生成スクリプトを追加。projects/.htaccess にドットファイル拒否を追加。
