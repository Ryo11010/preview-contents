# Plan — Edit 20251206_031043__work-section-english

## 背景 / 目的
- Work セクション（カテゴリ名、説明文）が日本語中心のため、メインを英語ベースにしてグローバル向けに統一感を出す。
- UI/レイアウトは変えず、文言を data 層で置き換える。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure: 未登録（文言変更のみだがハードコードに注意）。
- Success:
  - 20251206_025034__hero-status-catchy / 20251206_023552__hero-english-motto — hero 文言を data/config で更新した手法を踏襲。
  - 20251206_014702__funteru-content-refresh — data/config 集約でコピーを管理。
  - 20251204_214311__app-hardening — トークン集中と最小パッチの原則。

## agents.md 重要ポイント（抜粋）
- ハードコード禁止：文言は data/config のみに配置。
- A/B/C 提示、3+1 と file-map 更新必須。
- 500行ルール/命名規約は該当なし（文言のみ）。

## 代替案 (A/B/C)
- (A) カテゴリ表示・サブラベル・説明文を英語ベースに置換し、日本語はサブで残す（データのみ変更）。  
  Pros: 最小変更・多言語ニュアンス維持。Cons: バランス調整が必要。  
- (B) 完全英語のみ。  
  Pros: 明快。Cons: 日本語利用者への配慮低下。  
- (C) 動的トグルを実装。  
  Cons: ロジック増・スコープ過大。

### 採用案
- **(A)** を採用：英語メイン＋補助的に日本語（必要箇所のみ）で整える。

## 影響範囲
- `site/src/data/projects.ts` のカテゴリラベル・サブラベル。
- `site/src/components/sections/Work.tsx` 下部説明文。

## テスト計画
- 手動: `npm run dev` で Work セクションのカテゴリ名・サブラベル・説明が英語ベースで表示されることを確認。
- 自動: lint/型は未実施予定（文言のみ）。

## ハードコードに関する計画
- 文言は data/コンポーネント内に限定し、ハードコードを増やさない（既存 data ファイルを更新）。

## ロールバック方針
- before/after を保持し、Git で差分リバート可能。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T03:10:00Z
- memo: Work セクションの英語化依頼に基づき着手。
