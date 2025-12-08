# Plan — Edit 20251205_192700__postcss-explicit-config

## 背景 / 目的
- PostCSS/Tailwind が未展開のまま (`@tailwind` が CSS に残存) で UI が崩れている。PostCSS 設定は読み込まれているが、Tailwind プラグインが実行されていない可能性があるため、config を明示し確実に走らせる。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure: 未登録。3+1・file-map 更新漏れを避ける。
- Success:
  - 20251205_190000__postcss-config-fix: PostCSS を CJS 化 → 今回は Tailwind プラグインの読み込みをさらに明示化。
  - 20251205_173500__tailwind-style-recovery: content 網羅 → 設定を最小範囲に閉じる方針を踏襲。
  - 20251204_214311__app-hardening: 設定/定数集中 → ビルド設定を config に集約。
  - 20251205_161200__music-icon-import: 最小差分で欠落補修 → 設定のみ変更。

## agents.md 重要ポイント
- ハードコード絶対禁止（新規値なし）。
- A/B/C 提示と採用案明示、3+1＋file-map 更新必須。
- 命名規約・500行ルール遵守。設定変更のみ。
- No-Plan, No-Code：承認後に実装・評価・インデックス更新。

## 代替案 (A/B/C)
- (A) PostCSS config で `tailwindcss` を明示的に require し、config パスを指定する（CJS）。
  - Pros: プラグイン実行を強制でき、TS config 読み込み失敗のリスクを低減。
  - Cons: わずかに設定が冗長。
- (B) `next.config.mjs` で postcssOptions を直接指定する。
  - Pros: Next 側で強制できる。
  - Cons: Next 設定が肥大化、二重管理のリスク。
- (C) Tailwind CLI でビルド済み CSS をコミットして読み込む。
  - Pros: PostCSS に依存しない。
  - Cons: サイズ増・保守性低下。

### 採用案
- **(A) を採用。** 最小変更でプラグイン実行を強制し、TS config 読み込み不全を回避するため。

## 影響範囲
- `site/postcss.config.js` のみ。UI/データは変更しない。

## テスト計画
- `npm run dev` 再起動後、スタイルが復旧するか手動確認。自動テストは未実施の場合、評価に記載。

## ハードコードに関する計画
- 新規の環境依存値は追加しない。設定のみ明示。

## ロールバック方針
- `postcss.config.js` を旧版に戻すだけでロールバック可能。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-05T19:27:00Z
- memo: Tailwind 未展開解消のため明示設定を実施。
