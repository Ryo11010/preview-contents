# Changes (single-file)

> 各会話=1修正のアプローチ/ロジックを追記します。

## 目次

### 2025-12-08 GID=20251208_142847__restore Turn=T01
- 目的: リポジトリ復旧と /projects ドラッグ即プレビュー環境の再構築（1階層/2階層対応）。
- 参照: 直近復旧対応につき成功/失敗事例なし。
- 代替案: (A) 最小構成で再生成（採用）、(B) timetime ビルドまで含め復旧、(C) /projects を後回し。
- 実施: scripts/bootstrap/update-gitignore を再配置し artifacts を再初期化。.htaccess（ルート）/index.html/previews.json/errors/maintenance を再生成。/projects/.htaccess を per-dir 書式で再配置し、1階層/2階層どちらも index.html にフォールバック。docs/PreviewContentsSite_Usage.md を復旧し /projects ドラッグ運用を明記。file-map/_timeline/_catalog/_index/logbook/qa を更新。
- 検証: 設定・静的ファイルのみのためビルドなし。
- 影響: /projects 配下にアップしたプロジェクトをそのままプレビュー可能。サンプルエントリは削除し previews.json は空配列。
- ロールバック: 追加/再生成した静的ファイルを削除し、.htaccess を以前の版に戻す。

### 2025-12-08 GID=20251208_182220__auto_preview Turn=T01
- 目的: /projects へドラッグした timetime / portfolioSite を即プレビュー可能にし、一覧を自動生成する。
- 参照: 成功 `S-001`（projects/.htaccess の SPA フォールバック維持）を踏まえ、フォールバックを壊さない構成を採用。失敗 `F-001`（資材欠損で 404/500）を防ぐため、ビルド済み成果物を配置し、dotfiles を拒否。
- 代替案: (A) 手動 previews.json 追記のみ、(B) 走査スクリプトで自動生成＋ビルド（採用）、(C) 一覧のみ更新してビルドは後回し。
- 実施: timetime の Vite base を `/projects/timetime/stg/` へ変更し outDir を `../stg` に設定、ビルド出力を配置。.htaccess を base に合わせ修正。portfolioSite は `output: 'export'`＋`images.unoptimized` で静的書き出し、Google Fonts 依存を排除（システムフォント＋CSS変数）。`metadataBase` を siteOrigin のみへ修正しダブル basePath を解消。API ルートを削除し、ギャラリーフェッチは静的データにフォールバックする実装に変更。`NEXT_PUBLIC_BASE_PATH=/projects/portfolioSite/preview`、`NEXT_PUBLIC_SITE_ORIGIN=https://preview-contents.site` でビルドし `/projects/portfolioSite/preview/` に配置。`scripts/generate-previews-json.mjs` を新設し、ビルド済みの project/env を走査して `previews.json` を自動生成（ソースディレクトリや dotfiles を除外）。projects/.htaccess に dotfiles ブロックを追加。index.html は生成された previews.json で timetime / portfolioSite が即表示される。
- 追加: 本番不要な dotfiles/メタファイル（`projects/portfolioSite/.git*`, `.env`, `AGENTS.md`, `CLAUDE.md`, `projects/timetime/.git*`, `.DS_Store` 等）を削除し、アップロードリークを予防。
- 検証: `npm run build` (timetime) / `npm run export` (portfolioSite) を実行。`node scripts/generate-previews-json.mjs` で 2 件生成を確認。ブラウザ実行は未。
- 影響: /projects 配下に timetime/stg と portfolioSite/preview を配置済み。previews.json が自動生成されるためドラッグ後にスクリプト実行で一覧に反映される。dotfiles への直接アクセスは禁止。
- ロールバック: `/projects/timetime/stg` と `/projects/portfolioSite/preview` を削除し、previews.json を空配列に戻す。`projects/.htaccess` からブロックルールを除去し、Vite/Next 設定を元に戻す。

### 2025-12-09 GID=20251209_053346__timetime_web_export Turn=T01
- 目的: timetime RN/Expo の静的ビルドを最新化し、preview-contents.site の stg を更新する。
- 参照: 成功 `S-001`（/projects/.htaccess による SPA フォールバック維持）を踏まえ、既存フォールバックを壊さないよう .htaccess を保持しつつ同期。失敗 `F-001`（資材欠損で 404/500）を避けるため rsync --delete とアセット経路のリライトで欠落/パスずれを防止。
- 代替案: (A) Expo export を調整して再ビルドし stg に全置換（採用）、(B) 既存ビルドを部分上書きのみ、(C) 現状ビルドを流用して previews.json だけ更新。
- 実施: `package.json` の export スクリプトを Metro 対応の `expo export --platform web --output-dir web-build` へ更新しビルド。出力後、Expo Router の linking prefix を `/projects/timetime/stg` へパッチし、root .htaccess に /_expo と /assets を stg 配下へリライトするルールを追加。favicon 参照を相対化。rsync --delete で web-build を stg に同期（.htaccess 除外）。previews.json の updatedAt を更新。
- 検証: `npm run export:web:prod` を実行し正常終了（静的ルート 25 件出力、バンドル生成を確認）。追加テストは未実施。
- 影響: timetime/stg が Expo Router の最新静的ビルドに置き換わり、ルートレベルからのアセット参照（/_expo, /assets）も stg 配下に正しくルーティングされる。previews 一覧の日付を更新。
- ロールバック: root .htaccess のリライト2行を削除し、projects/timetime/stg を以前のビルドに戻す（必要なら Git から復元）。

### 2025-12-09 GID=20251209_053346__timetime_web_export Turn=T02
- 目的: サーバー側で /_expo や /assets への絶対パス参照が 404 になる問題を解消し、静的ビルドを base 配下で確実に読めるようにする。
- 参照: 成功 `S-001`（htaccess でのルーティング維持）を踏まえ、フォールバックを壊さずにパスのみ修正。失敗 `F-001`（資材欠損）を避けるため、既存生成物を直接相対化するのみとした。
- 代替案: (A) HTML/バンドルの絶対パスを相対に書き換える（採用）、(B) htaccess 側のリライト強化のみ、(C) Expo 再ビルド時に publicPath を再調整。
- 実施: stg 配下の全 HTML で `src=\"/_expo/` を `src=\"_expo/` に、`href=\"/` を `href=\"` に置換し、`_sitemap` など内部リンクも base 配下に解決するよう相対化。エントリバンドル内の `httpServerLocation` 文字列を `/assets/...` から `assets/...` に書き換え、アセット参照が stg 配下に固定されるよう補正。
- 検証: 置換後のファイルを目視確認（HTML 参照が相対化され、バンドルの httpServerLocation が assets/ になっていること）。追加の再ビルド・ブラウザ確認は未実施。
- 影響: プレビューサーバーでベースパス配下にデプロイしても、/_expo や assets へのリクエストが stg 配下に解決され、404 を避けられる見込み。Chrome 拡張由来のログエラーとは切り分け可能。
- ロールバック: stg 配下の HTML/JS を以前の絶対パス版で上書きすれば戻る（前回ビルドが必要）。必要に応じて root .htaccess のリライトで補完。
### 2025-12-09 GID=20251209_053346__timetime_web_export Turn=T03
- 目的: trailing slash なしアクセスで相対パスが 1 階層上に解決され JS が 404 となるのを防ぐ。
- 参照: 成功 `S-001`（htaccess フォールバック維持）を踏まえ、ルートレベルのリライトを使って動的動作を壊さない方法を採用。失敗 `F-001` を避けるため変更は stg/.htaccess のみ。
- 代替案: (A) stg/.htaccess で末尾スラッシュにリダイレクト（採用）、(B) HTML をルート参照に戻す、(C) ビルドを再生成して絶対パス参照に戻す。
- 実施: `projects/timetime/stg/.htaccess` に `/projects/timetime/stg` へのアクセスを `/projects/timetime/stg/` へ 301 リダイレクトするルールを追加し、相対パスの解決先を stg 配下に固定。
- 検証: ルールのみ追加のためサーバー反映後に `/projects/timetime/stg` へアクセスして `/projects/timetime/stg/` へリダイレクトされることを確認予定（ローカルでは未検証）。
- 影響: 末尾スラッシュ無しアクセス時でも `_expo`/`assets` が stg 配下を指し、JS 404 による Unmatched Route 表示を防ぐ。
- ロールバック: 追加したリダイレクト行を削除すれば元に戻る。

### 2025-12-10 GID=20251210_153533__timetime_dist_unify Turn=T01
- 目的: timetime RN の配信を /stg 静的配信から撤廃し、TestFlight/EAS Hosting/Vercel 等のホスト名ベースに統一する。
- 参照: 成功 `S-001`（SPA フォールバック維持が必須）を踏まえ、他プロジェクトのフォールバックは残す設計に。失敗 `F-001`（資材欠損による 404/500）を防ぐため削除範囲を timetime の stg 配下と関連リライトに限定し、previews.json との整合を確認。
- 代替案: (A) /stg 全撤廃（採用）、(B) ドキュメントのみで資材は残置、(C) timetime を一時的に非公開化して段階移行。
- 実施: ルート `.htaccess` から timetime 向けリライト（/_expo, /assets → /projects/timetime/stg）を削除し、`projects/timetime/stg/` を丸ごと削除。`previews.json` から timetime を除外し、`artifacts/file-map.md` を timetime/scripts + web-app 構成に差し替え。`artifacts/spec.md` に配信方針（TestFlight: `npx testflight` or `eas build`+`eas submit`、Web: Expo Web export → EAS Hosting/Vercel）と /stg 禁止を追記。
- 検証: 静的ファイルとメタのみの編集のためビルド/テストは未実施。
- 影響: timetime の Web プレビューは preview-contents 配下から削除され、iOS TestFlight/EAS Hosting 等に一本化。portfolioSite など他プロジェクトのプレビューは維持。
- ロールバック: stg 配下の静的成果物と `.htaccess` リライトを復元し、previews.json に timetime を再登録する。

### 2025-12-10 GID=20251210_160506__timetime_export_routerfix Turn=T01
- 目的: Expo Router のルート重複エラー（styles/dateUtils がルート扱い）を解消し、Web export を通す。
- 参照: 成功 `S-001`（構成変更時もフォールバック/資材整合が重要）を踏まえ、共有モジュールのみ移動してルート構成を維持。失敗 `F-001` を避けるため静的成果物再生成後もツリー/メタを更新。
- 代替案: (A) 共有モジュールを src/lib へ移動（採用）、(B) `_` プレフィックスで除外のみ、(C) app 配下全面再編。
- 実施: `src/app/styles.ts` と `src/app/styles/`、`src/app/dateUtils.ts` を `src/lib/` に移動し、全インポートを新パスに更新。lib 側から参照する designTokens/styleConstants/liquid-ui も app 配下への相対パスに修正。mockData の dateUtils 参照を lib に更新。`artifacts/file-map.md` をツリー/役割の新配置に更新。`npm run export:web:prod` が成功し web-build を生成。
- 検証: `npm run export:web:prod`（expo export --platform web）を実行し成功（45 ルート出力）。追加テストなし。
- 影響: Expo Router のルート衝突が解消され、Web export が通る。今後の本番/プレビュー配信で stg 配信なしに静的ビルドを利用可能。
- ロールバック: 移動したファイルを元の src/app 配下に戻し、インポートを旧パスへ戻す。
