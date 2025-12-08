#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const files = [
  'artifacts/history.edits.jsonl',
  'artifacts/history.success.jsonl',
  'artifacts/history.failures.jsonl',
];

const base = process.env.GITHUB_BASE || 'HEAD~1';
const head = process.env.GITHUB_HEAD || 'HEAD';

const runDiff = (file) => {
  if (!existsSync(file)) return '';
  try {
    return execSync(`git diff --unified=0 ${base}...${head} -- "${file}"`, { stdio: 'pipe' }).toString();
  } catch {
    try {
      return execSync(`git diff --unified=0 "${file}"`, { stdio: 'pipe' }).toString();
    } catch {
      return '';
    }
  }
};

for (const file of files) {
  const diff = runDiff(file);
  const editedLines = diff
    .split('\n')
    .filter((line) => line.startsWith('-'))
    .filter((line) => !line.startsWith('---'));
  if (editedLines.length > 0) {
    console.error(`ERROR: append-only violated in ${file}`);
    process.exit(1);
  }
}

console.log('append-only OK');
