# Plan — Edit 20251205_173500__tailwind-style-recovery

## 背景 / 目的
- 開発プレビューで Tailwind のユーティリティが生成されず、UI が素の HTML 状態になっている（ボタンやカードの装飾が消失）。
- Tailwind の content 解決やビルド設定を点検し、ユーティリティが正しく出力される状態に復旧する。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: /artifacts に未登録のため該当なし（3+1 未整備や file-map 更新漏れに注意）。
- Success 事例:
  - 20251205_142847__app-debt-burndown: 定数集中とブラウザガード → 設定を一元化し、ビルド設定も一箇所で完結させる。
  - 20251204_230100__app-native-ready: ブリッジ化で副作用を隔離 → ビルド系変更も config に閉じて UI コンポーネントに影響させない。
  - 20251204_214311__app-hardening: トークン集約とセクション分離 → Tailwind 設定もパスを網羅してユーティリティ抜けを防止。
  - 20251205_161200__music-icon-import: 最小差分でデータの欠落を補修 → 今回も最小の設定修正でスタイルを復旧させる。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止: 環境依存値の直書きは禁止（今回は設定パスの明確化のみで新規値追加なし）。
- A/B/C 代替案提示と採用案明示、3+1（before/after/diff/meta）＋ file-map 更新必須。
- 命名規約・500 行ルール順守。設定変更は最小範囲に留め、UI ロジックを汚さない。
- No-Plan, No-Code：Plan 承認後に実装・検証し、評価/インデックス更新を行う。

## 代替案 (A/B/C)
- (A) Tailwind content パスを絶対パス化 + js/jsx/mdx を含めて網羅し、ビルドの解決漏れを防止する。
  - Pros: CWD 依存を排除し、JIT が全コンポーネントを確実に走査。変更最小。
  - Cons: 追加の import（path）と設定変更が必要。
- (B) safelist に主要ユーティリティを大量指定して強制生成。
  - Pros: content 解決が失敗しても UI 復旧。
  - Cons: CSS 膨張・保守性低下、不要ユーティリティが混入。
- (C) グローバル CSS に手書きでスタイルを付与して Tailwind 依存を減らす。
  - Pros: Tailwind 無効でも最低限の見た目を確保。
  - Cons: 設計意図と乖離し、二重管理による負債増。

### 採用案
- **(A) を採用。** CWD 依存を除去し、全ファイルを確実にスキャンさせることで本来の Tailwind ユーティリティを生成し、最小変更で UI を復旧する。

## 影響範囲
- `site/tailwind.config.ts` の content 設定のみ。UI コンポーネントやデータにはノータッチ。

## テスト計画
- `npm run dev` を再起動してプレビューをリロードし、Hero/Work/Timeline/About セクションがデザインどおりに表示されることを手動確認。
- 自動テスト（lint/型）は未実行の場合、meta/evaluation に未実施理由を記載。

## ハードコードに関する計画
- 新規の環境依存値・URL・コピーは追加しない。content パスはプロジェクトルートからの相対/絶対に限定し、ロジックへの直書きは行わない。

## ロールバック方針
- `tailwind.config.ts` を before スナップショットへ戻せば復旧可能。Workset 単位で差分を隔離。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-05T17:35:00Z
- memo: UI 崩れ対応として content パス網羅化を最小変更で実施。
