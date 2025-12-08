# Success Case — Edit 20251205_192700__postcss-explicit-config

## What worked
- Tailwind が展開されず UI が崩れていた問題に対し、PostCSS 設定を明示化して解消。
- `postcss.config.js` で `tailwindcss` を `tailwind.config.ts` のパス付きで require し、Next が確実に Tailwind/Autoprefixer を実行するようにした。
- `.next` を再生成して `npm run dev` 再起動後、画面がデザインどおりに復旧し、ユーザー確認で正常表示を確認。

## Key steps (repro)
1. PostCSS を CJS で明示設定: `tailwindcss: { config: path.join(__dirname, 'tailwind.config.ts') }`。
2. `.next` を削除し、`npm run dev` を再起動。
3. ブラウザをリロードし、UI がモックどおりに戻ることを確認。

## Files
- site/postcss.config.js — Tailwind/Autoprefixer のプラグイン設定を明示化。

## Notes
- オフライン環境では `next build` が Google Fonts 取得で失敗するため、必要ならローカルフォントへ切替を検討。
- favicon 404 は `site/public/favicon.ico` を配置すると解消。
