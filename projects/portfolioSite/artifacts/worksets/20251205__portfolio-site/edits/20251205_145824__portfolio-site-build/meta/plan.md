# Plan — Edit 20251205_145824__portfolio-site-build

## 背景 / 目的
- `mockup/mockup.tsx` の UI を忠実に再現しつつ、`docs/Portfolio_Requirements_v1.1.md` に沿った実働ポートフォリオサイトを新規実装する。
- 実装先は `/mockup` 外（例: `site/` ディレクトリ配下の Next.js App Router プロジェクト）とし、データドリブンで更新しやすい構造にする。
- Tailwind + Framer Motion で iOS ライクな質感・動きを維持し、プレビュー可能な状態（`npm run dev` で確認）まで整える。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: /artifacts に未登録のため該当なし（ハードコード禁止・3+1欠落を特に警戒）。
- Success 事例:
  - 20251205_142847__app-debt-burndown: 型/定数集中とブラウザ API ガードの徹底 → 新規プロジェクトもデータ辞書とガード付きヘルパーで統一。
  - 20251204_230100__app-native-ready: プラットフォーム依存処理をブリッジ化 → シェア/外部リンク/メール送信はユーティリティに集約。
  - 20251204_214311__app-hardening: セクション分割とトークン集約で UI を維持しつつ可読性向上 → 各セクションをコンポーネント化しトークン/コピーを集中管理。
  - 20251204_211221__folder-interaction: レイアウト・モーション値を定数化し型付きデータドリブンで整理 → ギャラリーやカードのモーション値もトークン化して再利用。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止: URL/メール/閾値/コピーをロジックに直書きせず、設定・定数・文言ファイルに集約する。
- A/B/C 方式で代替案提示＆採用案明示。3+1（before/after/diff/meta）と `file-map.md` 更新を必須とする。
- 命名規約・500 行ルール順守（英語で役割明確、マジックナンバー排除）。1 ファイル 500 行未満を目標。
- デバッグはオーバーレイのみ。コンソール出力禁止（必要なら既定テンプレ overlay を利用）。

## 代替案 (A/B/C)
- (A) Next.js App Router + TypeScript + Tailwind + Framer Motion で `site/` に実装し、mockup のセクション/動きをコンポーネント化。データは `src/data/*.ts` や `src/config/site.ts` に集約。Pros: 要件/推奨スタック準拠、SSG/ISR も拡張容易。Cons: 依存追加とセットアップ工数。影響: 中。コスト: 中。
- (B) Vite + React + Tailwind で SPA 化しモックを移植。Pros: 軽量セットアップ。Cons: App Router 機能やメタ/OGPセットアップを手組み、要件推奨から外れる。影響: 中。コスト: 中。
- (C) 静的 HTML/CSS + Vanilla JS で模写。Pros: 依存少・速度。Cons: コンポーネント/データ分離が弱く、要件（拡張性/メタ/OGP/将来 CMS）に不向き。影響: 中〜高。コスト: 低。

### 採用案
- **(A) を採用。** 要件 doc の推奨スタックとモックの複雑なモーションを最短で再現でき、データ分離や将来拡張（MDX/CMS）にも適するため。

## 影響範囲
- 新規ディレクトリ `site/`: Next.js App Router プロジェクト一式（`app/`、`src/data/`、`src/components/`、`src/styles/` 等）。
- ページ/セクション: Hero、Work（カード/フィルタ/シート）、History（タイムライン）、About（スキル/興味のタブ）、Dock ナビ、共有/メール導線。
- 外部依存: React/Next/Tailwind/Framer Motion/lucide-react。開発時に `npm install` が必要（ネットワーク許可前提）。
- OGP/メタ/フォント: `next/head` (App Router の metadata) で設定し、ロゴ・OGP 画像はプレースホルダーを設定ファイル経由で管理。

## テスト計画
- 自動: `npm run lint`（環境が整えば）、型チェック（`next lint`/`tsc --noEmit` 相当）。依存導入後に実施。
- 手動: `npm run dev` でプレビューし、Hero/Dock ナビ/カード選択→シート/ギャラリー/タイムライン/スキル・興味タブ/共有・メール導線が mockup と一致することを確認。
- ネットワーク制約で実行不可の場合は meta/evaluation に理由と未実施項目を記録。

## ハードコードに関する計画
- 環境・運用で変わり得る値を列挙し、配置先を固定:
  - サイトメタ情報（タイトル/description/OGP 画像/テーマカラー/ベース URL）→ `site/src/config/site.ts`。
  - プロフィール・コピー・連絡先（氏名/ロール/キャッチ/メール/SNS）→ `site/src/data/profile.ts`。
  - プロジェクト・タイムライン・Tech タグのコンテンツ → `site/src/data/projects.ts` / `timeline.ts` / `tech.ts`。
  - UI トークン（色/グラデ/ノイズテクスチャ/モーションしきい値/レスポンシブ閾値）→ `site/src/config/tokens.ts`。
- ロジック内に新規の URL/ID/閾値/文言を直書きしない。シェア・メールリンクはユーティリティ経由に限定。
- 秘密情報や API キーは追加しない（必要になれば `.env` に移し、設定ファイルで参照）。

## ロールバック方針
- 新規作成物は `site/` 以下に閉じるため、問題時はフォルダごと退避/削除で元状態に戻る。Git なら本 Edit の変更をリバート。
- 3+1 の before/after スナップショットを保存し、差分単位で戻せるようにする。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-05T15:05:00Z
- memo: ユーザーより「yes」を受領したため実装を開始する。依存導入でネットワークアクセス（npm install）が必要。
