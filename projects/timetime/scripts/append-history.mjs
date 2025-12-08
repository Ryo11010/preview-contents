#!/usr/bin/env node
import {appendFileSync} from 'node:fs';
const file = process.argv[2];
const json = process.argv.slice(3).join(' ');
try{ JSON.parse(json); }catch{ console.error('Invalid JSON'); process.exit(1); }
appendFileSync(file, json + '\n'); console.log('appended to', file);
