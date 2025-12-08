# Plan — Edit 20251207_150500__work-card-overflow

## 背景 / 目的
- Work Archives の製品カードがビューポート端で切れたり、ホバー時に手前に出ず読みにくい。カードの重なり順と展開位置を見直し、端でも内容が隠れないレイアウトにする。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: failure-cases 未登録。3+1 漏れや file-map 未更新を避け、ハードコード禁止を再確認する。
- Success 事例:
  - 20251205_192700__postcss-explicit-config（success-cases）— 設定を明示し崩れを防止。今回もモーション値を config/tokens に集約して直書きを避ける。
  - Workset Success Point `app-debt-burndown` — 型/定数集中とガード徹底。カードの z-index や spread をトークンに寄せ、マジックナンバーを排除する。
  - Workset Success Point `app-hardening` — UI トークンとデータ分離で可読性確保。今回もレイアウト調整値はトークン経由で扱う。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止：閾値や座標オフセットは tokens.ts に集約し、コンポーネント直書きをしない。
- 各会話=1修正／3+1 必須。Plan 承認前に実装差分を出さない。
- 命名規約と 500 行ルール、不要変更禁止。z-index や spread 調整も意味のある定数名で管理する。

## 代替案 (A/B/C)
- (A) カードごとの hover 状態を追跡し、hover 中カードの z-index を最前面にする。左右端の列では基準位置を内側に寄せてから扇状展開し、spread/shift をトークンで調整する。
  - Pros: 期待動作（手前に出る・端で切れない）を直接満たし、挙動の意図が明確。
  - Cons: 状態管理とトークン追加が必要。
- (B) グリッドの左右余白を拡大して物理的なスペースで逃がす。
  - Pros: 実装が軽い。
  - Cons: レイアウト全体に影響し、モバイルで無駄な空白が増える。
- (C) 展開幅を全体的に縮小し、重なりを減らす。
  - Pros: 実装が容易。
  - Cons: 視覚的インパクトが弱まり、カード内容が重なりやすいまま。

### 採用案
- **(A) を採用**。挙動を改善するロジック変更とトークン調整で要件を満たしつつ、グリッド全体への影響を最小化する。

## 影響範囲
- `site/src/components/Folder.tsx`（カードの hover/Z-index/配置ロジック）
- `site/src/config/tokens.ts`（モーション・展開幅・基準位置オフセットのトークン）

## テスト計画
- `npm run lint`
- 手動確認：Work Archives で左右端のカードが切れず、hover 中カードが最前面になることをデスクトップ/モバイル幅で確認。

## ハードコードに関する計画
- spread/shift/z-index の閾値は `config/tokens.ts` に追加し、UI コードにマジックナンバーを残さない。外部リンク・コピーは触れない。

## ロールバック方針
- `git diff` と before スナップショットをもとに `Folder.tsx` と `tokens.ts` を元に戻す。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-07T15:10:00Z
- memo: ユーザーより「yes」承認済み。カードの手前化と端切れ防止のため、hover z-index と左右基準位置をトークン化して調整。
