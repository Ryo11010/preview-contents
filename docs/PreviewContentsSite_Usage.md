# Preview Contents Site 利用ガイド（簡潔版）

## 使い方
1. `https://preview-contents.site/` を開き、Basic認証を通過。
2. 一覧に表示された URL をクリック、または直接 `https://preview-contents.site/projects/{project-key}/{environment}/`（単階層なら `/projects/{project-key}/`）へアクセス。
3. SPA でもサブパス直アクセスが可能です（`projects/.htaccess` が `index.html` にフォールバック）。

## アップロード手順（Xserver）
1. ルート `public_html/` に以下を配置: `index.html`, `.htaccess`, `previews.json`, `maintenance.html`, `errors/404.html`, `errors/500.html`。
2. `public_html/projects/` にローカルの `/projects` フォルダを丸ごとアップロード（`projects/.htaccess` を含む）。
3. プロジェクトの配置ルール:
   - 単階層: `projects/{project-key}/index.html`
   - 二階層: `projects/{project-key}/{environment}/index.html`
4. 一覧に出す場合は `previews.json` に実在する URL だけを記載（サンプルが不要なら空配列 `[]` のままでOK）。
5. ローカルで `/projects` に追加/更新したら `node scripts/generate-previews-json.mjs` を実行し、生成された `previews.json` をアップロードする（ソースディレクトリや `.git` は自動で除外）。

## トラブルシュート
- 404/500: 配置パスを確認し、`index.html` が存在するかチェック。
- 500 が出る場合: `projects/.htaccess` が最新か確認（本リポジトリ同梱のものを再アップロード）。
- サブパスが 404 の場合: SPA 直下の `index.html` があるか、パスが `/{project}/{env}/...` 形式か確認。
