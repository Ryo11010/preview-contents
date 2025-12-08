# Plan — Edit 20251206_023552__hero-english-motto

## 背景 / 目的
- Hero 部分を英語のモットー調に整え、個人ポートフォリオとしてのメッセージ性を高める。
- 文言のみの更新とし、UI レイアウトやロジックには手を入れない。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure: 未登録（文言変更のみだがハードコード混入に注意）。
- Success:
  - 20251206_022159__hero-copy-simplify — 文言を tokens/profile に集約した手法を踏襲。
  - 20251206_014702__funteru-content-refresh — data/config 経由でコピー管理を徹底。
  - 20251204_214311__app-hardening — トークン集中管理と最小変更の原則を再利用。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止：文言は data/config に集約、コンポーネント直書きなし。
- A/B/C 提示、3+1 と file-map 更新必須。
- 500 行ルール/命名規約順守（文言のみで該当なし）。

## 代替案 (A/B/C)
- (A) heroCopy と profile.catchphrase を英語モットーに置換（データのみ変更）。  
  Pros: 最小変更・データ集中維持。Cons: 伝わり方の調整が必要。  
- (B) Hero コンポーネントで動的切替を追加。  
  Cons: ロジック追加・ハードコードリスク。  
- (C) セクション全体のスタイル変更。  
  Cons: 範囲拡大・不要変更。

### 採用案
- **(A)** を採用。

## 影響範囲
- `site/src/config/tokens.ts`（heroCopy）と `site/src/data/profile.ts`（catchphrase）。他は不変。

## テスト計画
- 手動: `npm run dev` で Hero 見出し/サブコピーが英語モットーとして表示されることを確認。
- 自動: Lint/型は未実施予定（文言のみ）。

## ハードコードに関する計画
- 文言は tokens/profile に集約し、コンポーネント直書きは行わない。

## ロールバック方針
- before/after を保存し、Git で差分リバート可能。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T02:36:00Z
- memo: 英語モットー化の依頼に基づき着手
