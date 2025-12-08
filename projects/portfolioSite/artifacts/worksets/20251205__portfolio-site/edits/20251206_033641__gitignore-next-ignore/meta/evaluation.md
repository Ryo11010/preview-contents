# Evaluation — Edit 20251206_033641__gitignore-next-ignore

- Result: Success
- Scope: ルート `.gitignore` に `.next/` と `site/.next/` を明示し、`git rm --cached -r site/.next` で既存追跡分をインデックスから除外して Git ノイズを解消。
- Verification: `git status --short` で `.gitignore` 変更と `site/.next` の削除ステージが確認でき、今後の生成物は無視される状態。テスト/ lint は実行していない（設定変更のみ）。
- Hardcode policy: 環境依存値や秘密情報の追加なし。無視パターンのみ追加し、ハードコード禁止に抵触しない。
- Risks / Follow-ups: ステージされた `site/.next` 削除が多いため、コミットで確定させること。動作確認時は必要に応じて `site/.next` を再生成（`npm run dev` 等）すれば `.gitignore` により再び追跡されない。
