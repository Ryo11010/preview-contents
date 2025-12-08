# Plan — Edit 20251206_112651__eslint-config

## 背景 / 目的
- `npm run lint` 実行時に毎回 Next.js の ESLint セットアップウィザードが出て処理が進まないため、非対話で回る ESLint 設定を固定化する。
- プロジェクト方針（no-console など）に沿ったベースルールを用意し、以後 lint が一発で走る状態にする。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: failure-cases 登録なし。3+1 漏れや file-map 未更新に注意。
- Success 事例:
  - 20251205_192700__postcss-explicit-config — 設定を明示して再生成を安定化。今回も設定ファイルを明示してウィザードを不要化。
  - 20251204_214311__app-hardening — 部品ごとに責務を分離しガードを追加。今回も lint 設定を分離し再利用しやすくする。
  - 20251204_230100__app-native-ready — プラットフォーム依存処理をユーティリティに集約し安全に適用。今回も ESLint 設定を1箇所に集約する方針を踏襲。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止：環境依存値は追加しない（設定ファイルのみ作成）。
- 各会話＝1修正・3+1 必須、file-map 省略禁止。
- A/B/C 代替案と採用案明示、最小パッチで不要変更を避ける。
- 500 行ルール・命名規約順守。ルールセットは Next 標準＋必要最低限に留める。

## 代替案 (A/B/C)
- (A) `site/.eslintrc.cjs` を追加し `extends: ['next/core-web-vitals']` + チーム方針ルール（例: `no-console: 'error'`、`ignoreDuringBuilds: false`）を明示。必要に応じて `.eslintignore` で artifacts 等を除外。
  - Pros: 非対話で lint 実行可、方針を一元化。
  - Cons: ルール追加で既存コードがエラーになる可能性（今回 console なしのため低リスク）。
- (B) `package.json` に eslintConfig をインライン定義し、スクリプトは現状のまま。
  - Pros: ファイル追加が1箇所。
  - Cons: 設定の見通しが悪く、拡張時に衝突しやすい。
- (C) lint スクリプトを削除/無効化してウィザードを避ける。
  - Pros: 作業量最小。
  - Cons: 品質ゲートを失い DoD/agents.md 違反。

### 採用案
- **(A) を採用。** Next 標準に沿った設定ファイルを追加し、非対話で lint が回る状態を確実にする。

## 影響範囲
- `site/.eslintrc.cjs`（新規）、必要なら `.eslintignore`。既存コードへの影響はルール次第だが console は検出されない見込み。

## テスト計画
- `npm run lint` を実行し、ウィザードが出ずに完走することを確認。

## ハードコードに関する計画
- 環境依存値や秘密情報は追加しない。設定値は一般的な ESLint ルールのみ。

## ロールバック方針
- `.eslintrc.cjs` / `.eslintignore` を削除し、必要なら `package.json` の関連設定を戻すだけで復元可能。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T11:30:00Z
- memo: ユーザーより「yes」確認済み。
