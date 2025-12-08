#!/usr/bin/env node
import {execSync} from 'node:child_process';

const files = [
  'artifacts/history.edits.jsonl',
  'artifacts/history.success.jsonl',
  'artifacts/history.failures.jsonl'
];

const base = process.env.GITHUB_BASE || 'HEAD~1';
const head = process.env.GITHUB_HEAD || 'HEAD';

for(const f of files){
  try{
    const diff = execSync(`git diff --unified=0 ${base}...${head} -- "${f}"`,{stdio:'pipe'}).toString();
    // 許容：追加(+)、末尾 newline のみ。禁止：削除(-)・置換・先頭/中間への挿入
    if(/^\-/.test(diff.replace(/^[^+\-]+/mg,''))){ // 何らかの '-' 行
      console.error('ERROR: append-only violated in', f); process.exit(1);
    }
  }catch(e){ /* no diff or file new */ }
}
console.log('append-only OK');
