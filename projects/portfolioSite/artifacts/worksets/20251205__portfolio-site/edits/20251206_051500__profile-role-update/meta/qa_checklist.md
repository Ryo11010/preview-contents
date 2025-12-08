# QA Checklist: プロフィール肩書き2行表示更新

## Preflight（実装前）
- [x] Workset 確認（20251205__portfolio-site）
- [x] Plan 作成→相談→承認 yes
- [x] file-map.md の省略ゼロ・網羅一致 100% 見込み（変更なし）
- [x] 今回扱う値（会社名・役職）とその配置先（profile.ts）を列挙した

## 実装・検証
- [x] 最小パッチ（型定義・データ・コンポーネント）
- [ ] TypeScript型チェック PASS（ユーザ確認待ち）
- [x] file-map.md 更新または「変更なし」記録（変更なし）
- [ ] WORKSET.md タイムライン追記（必要に応じて）
- [x] 命名規則（13章）に準拠（既存パターン踏襲）
- [x] コード品質基準（14章）に準拠（簡潔な実装）
- [x] ハードコード禁止（15章）確認済み（profile.tsに適切に配置）

## 評価・保存（必須）
- [x] evaluation.md 作成
- [x] outcome.json 作成
- [ ] 反応があればSuccess/Failure追記（ユーザフィードバック待ち）
- [ ] _timeline.md/_catalog.md/_index.json 更新（必要に応じて）
- [x] manifest SHA-256整合（必要に応じて生成）
- [x] agents.md準拠の自己チェック完了
