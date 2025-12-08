#!/usr/bin/env node
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_EDITS = 'artifacts/history.edits.jsonl';
const OUT_SUCCESS = 'artifacts/history.success.jsonl';
const OUT_FAILURE = 'artifacts/history.failures.jsonl';
const SPEC_PATH = 'artifacts/spec.md';
const MIGRATION_FLAG = 'artifacts/.migration_done';

const nowIso = () => new Date().toISOString();

const appendJsonLine = (file, payload) => {
  appendFileSync(file, `${JSON.stringify(payload)}\n`);
};

const ensureOutputs = () => {
  mkdirSync('artifacts', { recursive: true });
  ['history.edits.jsonl', 'history.success.jsonl', 'history.failures.jsonl', 'spec.md'].forEach((f) => {
    const target = join('artifacts', f);
    if (!existsSync(target)) writeFileSync(target, '');
  });
};

const readJsonSafe = (path) => {
  try {
    const content = readFileSync(path, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
};

const sanitizeId = (value) => value.replace(/[^\w\-]/g, '');

const migrateWorksets = () => {
  const root = 'artifacts/worksets';
  if (!existsSync(root)) return;
  for (const gid of readdirSync(root)) {
    const worksetPath = join(root, gid);
    if (!statSync(worksetPath).isDirectory()) continue;
    const editsRoot = join(worksetPath, 'edits');
    if (!existsSync(editsRoot)) continue;
    for (const edit of readdirSync(editsRoot)) {
      const metaDir = join(editsRoot, edit, 'meta');
      if (!existsSync(metaDir)) continue;
      const outcomePath = join(metaDir, 'outcome.json');
      const outcome = readJsonSafe(outcomePath);
      const record = {
        ts: nowIso(),
        gid,
        turn: edit,
        title: outcome?.summary || edit,
        status: outcome?.status || 'pending',
        specImpact: Boolean(outcome?.specImpact),
        successRefs: [],
        failureRefs: [],
        by: outcome?.by || null,
      };
      appendJsonLine(OUT_EDITS, record);
    }
  }
};

const migrateSuccessCases = () => {
  const root = 'artifacts/success-cases';
  if (!existsSync(root)) return;
  for (const dir of readdirSync(root)) {
    const casePath = join(root, dir);
    if (!statSync(casePath).isDirectory()) continue;
    const readme = join(casePath, 'README.md');
    const summary = existsSync(readme) ? readFileSync(readme, 'utf8').slice(0, 4000) : '';
    const record = {
      ts: nowIso(),
      caseId: sanitizeId(dir),
      ref: { gid: null, turn: null },
      summary,
      reproduce: [],
      tags: [],
    };
    appendJsonLine(OUT_SUCCESS, record);
  }
};

const migrateFailureCases = () => {
  const root = 'artifacts/failure-cases';
  if (!existsSync(root)) return;
  for (const dir of readdirSync(root)) {
    const casePath = join(root, dir);
    if (!statSync(casePath).isDirectory()) continue;
    const readme = join(casePath, 'README.md');
    const summary = existsSync(readme) ? readFileSync(readme, 'utf8').slice(0, 4000) : '';
    const record = {
      ts: nowIso(),
      caseId: sanitizeId(dir),
      ref: { gid: null, turn: null },
      cause: 'migrated-from-legacy',
      prevention: [],
      summary,
      tags: [],
    };
    appendJsonLine(OUT_FAILURE, record);
  }
};

const migrateDocsToSpec = () => {
  const sections = [];
  if (existsSync('AGENTS.md')) {
    sections.push({ title: 'AGENTS.md', content: readFileSync('AGENTS.md', 'utf8') });
  }
  if (existsSync('docs')) {
    for (const entry of readdirSync('docs')) {
      const full = join('docs', entry);
      if (statSync(full).isFile()) {
        sections.push({ title: `docs/${entry}`, content: readFileSync(full, 'utf8') });
      }
    }
  }
  if (sections.length === 0) return;
  let text = '\n\n## 旧資料の統合\n';
  sections.forEach((sec) => {
    text += `\n### ${sec.title}\n${sec.content}\n`;
  });
  appendFileSync(SPEC_PATH, text);
};

const archiveLegacy = () => {
  const archiveRoot = 'artifacts/_archive';
  mkdirSync(archiveRoot, { recursive: true });
  const legacyDirs = ['success-cases', 'failure-cases'];
  for (const dir of legacyDirs) {
    const source = join('artifacts', dir);
    if (!existsSync(source)) continue;
    const target = join(archiveRoot, dir);
    const finalTarget = existsSync(target) ? `${target}-${Date.now()}` : target;
    renameSync(source, finalTarget);
  }
};

const main = () => {
  if (existsSync(MIGRATION_FLAG)) {
    console.log('migration already completed; aborting to avoid duplication.');
    return;
  }

  ensureOutputs();
  migrateWorksets();
  migrateSuccessCases();
  migrateFailureCases();
  migrateDocsToSpec();
  archiveLegacy();

  writeFileSync(MIGRATION_FLAG, nowIso());
  console.log('migration completed. Append-only history initialized.');
};

main();
