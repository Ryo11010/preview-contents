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
