#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const args = process.argv.slice(2);
let gid;
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === '--gid' && args[i + 1]) {
    gid = args[i + 1];
    break;
  }
  if (a.startsWith('--gid=')) {
    gid = a.split('=')[1];
    break;
  }
  if (!a.startsWith('--')) {
    gid = a;
    break;
  }
}
if (!gid) {
  console.error('Usage: node scripts/update-gitignore.mjs --gid <GID>');
  process.exit(1);
}

const path = '.gitignore';
let g = readFileSync(path, 'utf8');
const marker = '# Workset is unignored below';
const block = `\n${marker}\n!/artifacts/worksets/\n!/artifacts/worksets/${gid}/\n!/artifacts/worksets/${gid}/**\n`;
if (!g.includes(marker)) {
  g += block;
} else {
  g = g.replace(new RegExp(`${marker}[\\s\\S]*$`), block);
}
writeFileSync(path, g);
console.log('updated .gitignore for GID', gid);
