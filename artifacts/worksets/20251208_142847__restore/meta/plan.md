# Plan (Turn T01)
- GID: 20251208_142847__restore
- 目的: リポジトリ復旧と /projects ドラッグ即プレビュー環境の再構築。
- 参照: 成功/失敗事例なし（復旧対応）。

## 代替案
- (A) 最小構成で復旧（index/htaccess/errors/previews/.projects htaccess + usage doc）を再生成（採用）
- (B) 旧 timetime ビルドを含めて復旧
- (C) ルートのみ復旧し /projects は次回対応

## スコープ
1. scripts 復元 & artifacts 初期化 (.gitignore 等)
2. ルート静的資材/エラーページ/maintenance 再作成、projects/.htaccess 再配置
3. docs usage を復旧し、artifacts（changes/file-map/timeline/catalog/index/log/qa）を更新

## 承認
- 承認: yes（復旧のため即時対応）
