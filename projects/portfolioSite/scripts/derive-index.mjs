#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const editsPath = 'artifacts/history.edits.jsonl';
const timelinePath = 'artifacts/_timeline.md';
const indexPath = 'artifacts/_index.json';

const edits = existsSync(editsPath)
  ? readFileSync(editsPath, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
  : [];

const rows = edits.map((e) => ({
  ts: e.ts || '',
  gid: e.gid || '',
  turn: e.turn || '',
  title: e.title || '',
  status: e.status || '',
}));

let timeline = '# Timeline\n| ts | gid | turn | title | status |\n|---|---|---|---|---|\n';
rows.forEach((row) => {
  timeline += `| ${row.ts} | ${row.gid} | ${row.turn} | ${row.title} | ${row.status} |\n`;
});

writeFileSync(timelinePath, timeline);
writeFileSync(indexPath, JSON.stringify(rows, null, 2));
console.log('index derived.');
