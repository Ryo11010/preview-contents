#!/usr/bin/env node
import { appendFileSync } from 'node:fs';

const [file, ...rest] = process.argv.slice(2);
if (!file || rest.length === 0) {
  console.error('Usage: node scripts/append-history.mjs <file> <json>');
  process.exit(1);
}

const payload = rest.join(' ');
try {
  JSON.parse(payload);
} catch {
  console.error('Invalid JSON payload');
  process.exit(1);
}

appendFileSync(file, `${payload}\n`);
console.log('appended to', file);
