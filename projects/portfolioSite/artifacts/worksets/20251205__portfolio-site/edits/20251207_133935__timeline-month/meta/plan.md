# Plan — Edit 20251207_133935__timeline-month

## 背景 / 目的
- Journey（Timeline）セクションの年ピルが年のみ表示のため、ユーザーのリクエストに沿って年と月を併記し、モックの質感を維持したまま情報量を増やします。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: failure-cases 未登録のため、3+1 漏れや file-map 未更新を避けることを主に留意します。
- Success 事例:
  - 20251205_192700__postcss-explicit-config — 設定を明示化して崩れを防止。今回も型/データで表現し UI への直書きを避けます。
  - Workset Success Point `app-debt-burndown` — 型・定数集中とガード徹底。今回も日付表示をデータ型に組み込みます。
  - Workset Success Point `app-hardening` — トークン/データ分離で UI を維持しつつ可読性向上。今回もフォーマットをヘルパーで扱い、マジックストリングを排除します。
  - Workset Success Point `app-native-ready` — 副作用や外部依存をユーティリティへ集約。今回も表示ロジックは純粋関数に寄せます。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止：月表記はデータモジュールに追加し、コンポーネント直書きをしません。
- 各会話=1修正／3+1 必須。実装後は before/after/diff/meta と file-map を更新します。
- 500 行ルールと命名規約遵守。不要変更禁止。
- Plan 承認前は実装出力禁止。

## 代替案 (A/B/C)
- (A) TimelineItem に `month` を追加し、フォーマットヘルパーで「YYYY.MM」などに整形して表示する。データは `timeline.ts` に集約し、型で保証する。
  - Pros: データ駆動で整合性が担保され、月変更もデータ編集のみで完結。
  - Cons: 型/データ/コンポーネントの3箇所に軽微な変更が必要。
- (B) `year` フィールドを「2025.03」のような文字列に差し替え、そのまま表示する。
  - Pros: UI 側の変更が最小。
  - Cons: 年と月の意味が曖昧になり、並び替えや再利用でミスが起きやすい。
- (C) コンポーネント内にタイトル→月のマッピングをハードコードする。
  - Pros: データ変更が不要。
  - Cons: ハードコード違反かつメンテ不能で却下。

### 採用案
- **(A) を採用**。データ型で月を保持し、フォーマットヘルパー経由で表示します。

## 影響範囲
- `site/src/data/types.ts`（TimelineItem 型拡張）
- `site/src/data/timeline.ts`（月データ追加）
- `site/src/components/sections/Timeline.tsx`（フォーマットと表示調整）

## テスト計画
- `npm run lint`
- 手動確認：Journey セクションのピルに年+月が表示され、レイアウト崩れがないことを確認。

## ハードコードに関する計画
- 月情報は `site/src/data/timeline.ts` に追加し、UI 側のリテラルは禁止。
- 表示フォーマットは関数で一元化し、閾値や文言をコンポーネントに直書きしません。

## ロールバック方針
- 変更ファイルを before スナップショットと `git diff` を基に元に戻します。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-07T13:45:00Z
- memo: ユーザーより「yes」承認済み。年+月表示を追加し UI は維持。
