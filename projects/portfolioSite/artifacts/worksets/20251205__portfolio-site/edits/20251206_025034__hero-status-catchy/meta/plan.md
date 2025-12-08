# Plan — Edit 20251206_025034__hero-status-catchy

## 背景 / 目的
- Hero のステータスバッジ文言（現在: "Joy through Code"）が抽象的なので、個人ポートフォリオのコンテキストに沿ったキャッチーなフレーズへ差し替える。
- 文言のみの変更で、UI/レイアウトやロジックには触れない。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure: 未登録（文言変更のみだがハードコード混入を警戒）。
- Success:
  - 20251206_023552__hero-english-motto — Hero 文言を data/config に集約した手法を再利用。
  - 20251206_014702__funteru-content-refresh — data/config 管理でコピー更新を完結。
  - 20251204_214311__app-hardening — トークン集中管理と最小パッチの原則。

## agents.md 重要ポイント（抜粋）
- ハードコード禁止：文言は data/config に集約し、コンポーネント直書き不可。
- A/B/C 提示、3+1 と file-map 更新必須。
- 500行ルール/命名規約は該当なし（文言のみ）。

## 代替案 (A/B/C)
- (A) `heroCopy.status` を短くキャッチーな英語フレーズへ変更（データのみ）。  
  Pros: 最小変更、即反映。Cons: インパクト調整は要確認。  
- (B) バッジを非表示またはアイコンのみ。  
  Cons: 情報量が減り過ぎる。  
- (C) 複数候補をランダム表示するロジック追加。  
  Cons: ロジック増・不要変更。

### 採用案
- **(A)** を採用。

## 影響範囲
- `site/src/config/tokens.ts` の `heroCopy.status` のみ。

## テスト計画
- 手動: `npm run dev` で Hero バッジが新フレーズで表示されることを確認。
- 自動: lint/型は未実施予定（文言のみ）。

## ハードコードに関する計画
- 文言はトークンにのみ配置し、コンポーネント直書きなし。

## ロールバック方針
- before/after を保持するので差し戻し容易。Git でリバートも可能。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T02:52:00Z
- memo: バッジ文言のキャッチー化依頼に基づき着手。
