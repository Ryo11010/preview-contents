# プロジェクトギャラリー配置ルール

- 各プロジェクトの画像は `site/public/images/projects/<projectId>/` に置いてください。
- 対応拡張子: jpg / jpeg / png / webp / avif / svg（大文字小文字は不問）。
- ファイル名で昇順ソートして表示します。並び順を固定したい場合は `01_hero.jpg` のようにゼロパディングしてください。
- `next/image` によりリクエスト幅へ自動リサイズされます（元画像は高解像度でOK）。
- 置き換え後は再読み込みするだけで反映されます（API は `cache: no-store`）。
