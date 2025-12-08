# Plan — Edit 20251206_032058__section-header-icon-removal

## 背景 / 目的
- Work / Timeline セクション先頭のアイコンを非表示にし、テキストのみのヘッダーにする（不要な装飾を減らす）。
- SectionHeader コンポーネントをアイコン無しで表示できるようにし、既存レイアウトを壊さず対応する。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure: 未登録（ハードコードや UI 崩れに注意）。
- Success:
  - 20251206_031043__work-section-english — Work セクション文言を data で変更した手法を踏襲。
  - 20251204_214311__app-hardening — 共通コンポーネントを調整してレイアウトを維持する手法。

## agents.md 重要ポイント（抜粋）
- ハードコード禁止：UI定数はコンポーネント側に閉じ、値の直書きを増やさない。
- A/B/C 提示、3+1 と file-map 更新必須。
- 500行ルール/命名規約：該当なし（小規模変更）。

## 代替案 (A/B/C)
- (A) SectionHeader をアイコン任意にして、アイコン未指定時は余白を埋めるスタイルに変更。Work/Timeline では icon を渡さない。  
  Pros: 最小変更で全セクション対応。Cons: 影響範囲はヘッダーのみ。  
- (B) Work/Timeline 個別にアイコン要素を外す。  
  Cons: 重複対応・他セクションで再発。  
- (C) 全セクションでヘッダーを再レイアウト。  
  Cons: スコープ過大。

### 採用案
- **(A)** を採用。

## 影響範囲
- `site/src/components/SectionHeader.tsx`（アイコン任意化、レイアウト調整）。
- `site/src/components/sections/Work.tsx`, `site/src/components/sections/Timeline.tsx`（アイコン引数削除）。

## テスト計画
- 手動: `npm run dev` で Work / Timeline ヘッダーからアイコンが消え、余白崩れがないことを確認。
- 自動: lint/型は未実施予定（小改修）。

## ハードコードに関する計画
- 新規定数なし。デザイン用クラスは既存パターンを流用。

## ロールバック方針
- before/after を保存し、必要なら SectionHeader の差分を戻す。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T03:21:00Z
- memo: ヘッダーアイコン削除の依頼に基づき着手。
