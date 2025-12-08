# Plan — Edit 20251205_190000__postcss-config-fix

## 背景 / 目的
- Tailwind/PostCSS が未実行のまま (`@tailwind base` 等が .next CSS に残存) で UI が崩れている。Next が `postcss.config.mjs` を拾えていないと推測されるため、CJS 形式に切り替えて確実に読ませ、スタイルを復旧する。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure: 未登録。3+1 や file-map 更新漏れに注意。
- Success:
  - 20251205_173500__tailwind-style-recovery: Tailwind content 網羅化 → 今回も設定を最小範囲で修正。
  - 20251205_161200__music-icon-import: 最小差分で欠落補修 → PostCSS も最小変更で復旧。
  - 20251204_214311__app-hardening: 設定・定数の分離 → ビルド設定を config に閉じる。
  - 20251204_230100__app-native-ready: 副作用を隔離 → UI ロジックに触れず設定のみ変更。

## agents.md 重要ポイント
- ハードコード絶対禁止（今回は新規値なし）。
- A/B/C 提示と採用案明示、3+1＋file-map 更新必須。
- 命名規約・500行ルール遵守。設定変更のみ。
- No-Plan, No-Code：承認後に実装・評価・インデックス更新。

## 代替案 (A/B/C)
- (A) `postcss.config.js` (CJS) を追加し、既存 mjs を廃止して Next が確実に読む形にする。
  - Pros: 変更最小・確実に読み込まれる。
  - Cons: ファイル置換が必要。
- (B) `next.config` で postcssPath を明示指定する。
  - Pros: 読み込み経路を明示。
  - Cons: Next 設定が肥大化、将来メンテ不要。
- (C) Tailwind を手動ビルドし生成 CSS を直置き。
  - Pros: PostCSS に依存しない。
  - Cons: 保守困難、要件から逸脱。

### 採用案
- **(A) を採用。** もっともシンプルかつ確実に PostCSS/Tailwind を走らせられるため。

## 影響範囲
- `site/postcss.config.*` のみ。UI/データには触れない。

## テスト計画
- `npm run dev` 再起動 → ブラウザでスタイルが復旧することを手動確認予定。自動テスト（lint/型）は未実施の場合、評価に記載。

## ハードコードに関する計画
- 新規の URL/閾値等は追加しない。設定のみ追加。

## ロールバック方針
- `postcss.config.js` を削除し、`postcss.config.mjs` を戻すだけで元に戻せる。Edit 単位で隔離。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-05T19:00:00Z
- memo: 「お願いします」を受領し、PostCSS 設定を CJS で再配置する。
