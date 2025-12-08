#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
const gid = process.argv.find(a=>a.startsWith('--gid='))?.split('=')[1] || '';
if(!gid){ console.error('Usage: node scripts/update-gitignore.mjs --gid <GID>'); process.exit(1); }
const path='.gitignore'; let g=readFileSync(path,'utf8');
const marker='# Workset is unignored below';
const block = `\n${marker}\n!/artifacts/worksets/\n!/artifacts/worksets/${gid}/\n!/artifacts/worksets/${gid}/**\n`;
g = g.includes(marker) ? g.replace(new RegExp(`${marker}[\\s\\S]*$`), block) : g + block;
writeFileSync(path,g); console.log('updated .gitignore for GID', gid);
