#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const gid =
  process.argv[2] || process.argv.find((arg) => arg.startsWith('--gid='))?.split('=')[1];

if (!gid) {
  console.error('Usage: node scripts/update-gitignore.mjs --gid <GID>');
  process.exit(1);
}

const path = '.gitignore';
let content = readFileSync(path, 'utf8');
const marker = '# Workset is unignored below';
const block = `\n${marker}\n!/artifacts/worksets/\n!/artifacts/worksets/${gid}/\n!/artifacts/worksets/${gid}/**\n`;

if (!content.includes(marker)) {
  content += block;
} else {
  content = content.replace(new RegExp(`${marker}[\\s\\S]*$`), block);
}

writeFileSync(path, content);
console.log('updated .gitignore for GID', gid);
