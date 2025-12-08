#!/usr/bin/env node
import {mkdirSync, writeFileSync, existsSync} from 'node:fs';
const ensure=(p,c='')=>{ if(!existsSync(p)){ writeFileSync(p,c); console.log('created',p); } };

mkdirSync('artifacts',{recursive:true});
mkdirSync('artifacts/worksets',{recursive:true});
mkdirSync('artifacts/templates',{recursive:true});
mkdirSync('scripts',{recursive:true});

ensure('artifacts/spec.md', '# Specification (single-file)\n\n## 目次\n');
ensure('artifacts/changes.md','# Changes (single-file)\n\n## 目次\n');
ensure('artifacts/history.edits.jsonl','');
ensure('artifacts/history.success.jsonl','');
ensure('artifacts/history.failures.jsonl','');
ensure('artifacts/file-map.md','# file-map (Latest)\n\n## Tree\n<init>\n\n## File Roles\n- artifacts/file-map.md — 初期化\n');
ensure('artifacts/_timeline.md','# Timeline\n| ts | gid | turn | title | status |\n|---|---|---|---|---|\n');
ensure('artifacts/_catalog.md','# Catalog\n');
ensure('artifacts/_index.json','[]');

ensure('.gitignore',
`# base
.DS_Store
node_modules/
dist/
build/
coverage/
.env
*.log
# artifacts policy
/artifacts/**
!/artifacts/spec.md
!/artifacts/changes.md
!/artifacts/history.edits.jsonl
!/artifacts/history.success.jsonl
!/artifacts/history.failures.jsonl
!/artifacts/file-map.md
!/artifacts/_timeline.md
!/artifacts/_catalog.md
!/artifacts/_index.json
!/artifacts/templates/
!/artifacts/templates/DebugOverlayTemplate.v1.js
# GID unignore will be appended by scripts/update-gitignore.mjs
`);
console.log('bootstrap done.');
