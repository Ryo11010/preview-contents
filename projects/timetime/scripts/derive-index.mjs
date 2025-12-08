#!/usr/bin/env node
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
const edits = existsSync('artifacts/history.edits.jsonl') ? readFileSync('artifacts/history.edits.jsonl','utf8').trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)) : [];
const rows = edits.map(e=>({ts:e.ts,gid:e.gid,turn:e.turn||'',title:e.title||'',status:e.status||''}));

let md = '# Timeline\n| ts | gid | turn | title | status |\n|---|---|---|---|---|\n';
for(const r of rows) md += `| ${r.ts||''} | ${r.gid||''} | ${r.turn||''} | ${r.title||''} | ${r.status||''} |\n`;
writeFileSync('artifacts/_timeline.md', md);
writeFileSync('artifacts/_index.json', JSON.stringify(rows,null,2));
console.log('index derived.');
