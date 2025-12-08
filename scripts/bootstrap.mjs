#!/usr/bin/env node
import {mkdirSync, writeFileSync, existsSync} from 'node:fs';

function ensure(p, content = '') {
  if (!existsSync(p)) {
    writeFileSync(p, content);
    console.log('created', p);
  }
}

mkdirSync('artifacts', {recursive: true});
mkdirSync('artifacts/worksets', {recursive: true});
mkdirSync('artifacts/templates', {recursive: true});

ensure(
  'artifacts/spec.md',
  '# Specification (single-file)\n\n> 本ファイルはプロジェクトの全仕様を1ファイルで管理します。\n\n## 目次\n\n## 1. 概要\n\n## 2. UI/UX\n\n## 3. 機能要求\n\n## 4. API/契約\n\n## 5. データ/DB/永続化\n\n## 6. 設定/FeatureFlag\n\n## 7. エラー/例外/リトライ\n\n## 8. 性能/SLO/SLI\n\n## 9. セキュリティ\n\n## 10. ログ/トレース/観測\n\n## 11. Dev/Build/CI\n\n## 12. 変更履歴(要約)\n',
);
ensure(
  'artifacts/changes.md',
  '# Changes (single-file)\n\n> 各会話=1修正のアプローチ/ロジックを追記します。\n\n## 目次\n',
);
ensure(
  'artifacts/file-map.md',
  '# file-map (Latest)\n\n## Tree\n<init>\n\n## File Roles\n- artifacts/file-map.md — 初期化\n',
);

ensure('artifacts/_timeline.md', '# Timeline\n| GID | Turn | Title | Status | Cause | Tags |\n|---|---|---|---|---|---|\n');
ensure('artifacts/_catalog.md', '# Catalog (by Feature)\n');
ensure('artifacts/_index.json', '[]');

ensure(
  '.gitignore',
  `# === base ===
.DS_Store
*.log
*.tmp
*.swp
node_modules/
dist/
build/
coverage/
tmp/
.env
.env.*
# === artifacts policy ===
/artifacts/**
!/artifacts/spec.md
!/artifacts/changes.md
!/artifacts/file-map.md
!/artifacts/_timeline.md
!/artifacts/_catalog.md
!/artifacts/_index.json
!/artifacts/templates/
!/artifacts/templates/DebugOverlayTemplate.v1.js
# Workset は後続で有効化：scripts/update-gitignore.mjs --gid <GID>
`,
);
console.log('bootstrap done (no git operations performed).');
