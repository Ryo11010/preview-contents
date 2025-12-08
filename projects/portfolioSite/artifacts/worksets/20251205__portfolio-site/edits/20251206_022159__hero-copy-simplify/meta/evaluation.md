# Evaluation — Edit 20251206_022159__hero-copy-simplify

- Result: Success
- Scope: Hero 文言の簡潔化。`profile.catchphrase` を短縮し、`heroCopy` をシンプルな個人ポートフォリオ向け表現に変更。UI/レイアウトは無変更。
- Verification: 自動テスト/ lint 未実施。`npm run dev` で Hero 見出し・サブコピーが簡潔に表示されることを手動確認してください。
- Hardcode policy: 文言は `config/tokens.ts` と `data/profile.ts` に集約。コンポーネントへの直書きなし。秘密情報なし。
- Risks / Follow-ups: 表現トーンの最終確認をデザインレビューで実施。必要に応じてさらなる短縮/英訳切替を検討。
