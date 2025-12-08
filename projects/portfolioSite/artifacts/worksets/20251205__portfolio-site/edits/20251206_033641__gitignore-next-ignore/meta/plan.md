# Plan — Edit 20251206_033641__gitignore-next-ignore

## 背景 / 目的
- ルート `.gitignore` に `.next` 明示がなく、`site/.next` が Git 追跡されたままになっているためステータスにノイズが出ている。
- `.next` を明示的に無視し、既存の追跡済み `.next` をインデックスから外して Git ノイズを解消する。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: 直近の failure-cases 登録なし。3+1 漏れと file-map 更新漏れに注意する。
- Success 事例:
  - 20251205_192700__postcss-explicit-config — 設定の明示化で意図を揃えた。今回も無視パターンを明確に書く。
  - 20251206_013025__gitignore-cleanup — `.gitignore` を最小差分で整理。パターン整理と file-map 反映を踏襲。
  - 20251205_190000__postcss-config-fix — 設定変更＋ file-map 更新を確実に実施。今回も同様に 3+1 と file-map 更新を行う。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止：環境依存値は直書きしない（今回は無視パターンのみ追加）。
- No-Plan, No-Code：承認済み Plan なしで実装しない。各会話＝1修正で 3+1 を揃える。
- A/B/C 代替案を提示し採用案を明示する。file-map 省略禁止。
- 500 行ルール・命名規約順守。不要変更を避け最小パッチとする。

## 代替案 (A/B/C)
- (A) ルート `.gitignore` に `.next/` と `site/.next/` を明示し、`git rm --cached -r site/.next` で既存追跡を外す。
  - Pros: 以後のノイズが消え意図が明確。チーム全体で再現性が高い。
  - Cons: 一度インデックス除去コマンドが必要。
- (B) `.gitignore` に追記のみで、既存の `site/.next` 追跡はそのまま。
  - Pros: 操作が最小。
  - Cons: 既存ノイズが残り続ける。
- (C) `site/.gitignore` を個別に追加し、ルートは触らない。
  - Pros: 影響範囲が狭い。
  - Cons: ルートではノイズが残り、共有再現性が低い。

### 採用案
- **(A) を採用。** 確実に `.next` を無視し、既存追跡を外してノイズを解消するため。

## 影響範囲
- ルート `.gitignore`。Git インデックスから `site/.next` を除外。

## テスト計画
- `git status --short` で `.next` が表示されないことを確認。

## ハードコードに関する計画
- 環境依存値や秘密情報は追加しない。無視パターンのみ追加し、値は設定・定数に触れない。

## ロールバック方針
- `.gitignore` 追記を戻し、必要なら `git add site/.next` で再追跡するだけで元に戻せる。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T03:36:41Z
- memo: ユーザーから「yes」受領済み。
