# Specification (single-file)

> 本ファイルはプロジェクトの全仕様を1ファイルで管理します。

## 目次

## 1. 概要

## 2. UI/UX

## 3. 機能要求
- `/projects/{project}/{env}/` にドラッグしたビルド成果物を自動で一覧化するため、`scripts/generate-previews-json.mjs` で `previews.json` を生成する。`projects` 直下/第2階層で `index.html` が存在し、かつ `package.json` がないディレクトリのみを対象とする。
- timetime は `/projects/timetime/stg/` 配信を廃止し、**iOS は TestFlight 配布（Expo/EAS）**、**Web プレビューは Expo Web export を EAS Hosting もしくは Vercel/Netlify 等にホスト**する。`/projects` 配下へ timetime の静的出力を置かない。
- portfolioSite は `output: 'export'` + `images.unoptimized` で静的書き出しし、`NEXT_PUBLIC_BASE_PATH=/projects/portfolioSite/preview` で配置する。

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
- timetime RN 配信方針: iOS は `npx testflight`（または `eas build --platform ios --profile production` → `eas submit --platform ios`）で TestFlight へアップロードし、署名/アップロードは EAS に集約する。Web は `npx expo export --platform web` で静的出力を作成し、EAS Hosting (`eas deploy`) もしくは Vercel/Netlify のプレビューを利用する。/stg サブディレクトリ配信は禁止。

## 12. 変更履歴(要約)
- 2025-12-08: 復旧対応。ルート資材・projects/.htaccess を再生成し、/projects 直下の1階層/2階層に対応。
- 2025-12-08: timetime/portfolioSite をビルド配置し、previews.json 自動生成スクリプトを追加。projects/.htaccess にドットファイル拒否を追加。
- 2025-12-10: timetime の /stg 静的配信を撤廃し、iOS TestFlight は Expo/EAS（`npx testflight` or `eas build` + `eas submit`）、Web プレビューは Expo Web export + EAS Hosting/Vercel 等で行う方針に統一。previews.json から timetime を除外。
