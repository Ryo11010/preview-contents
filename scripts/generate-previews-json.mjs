#!/usr/bin/env node
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const PROJECTS_DIR = join(ROOT, 'projects');
const OUTPUT = join(ROOT, 'previews.json');

const isHidden = (name) => name.startsWith('.') || name === 'node_modules' || name === 'artifacts' || name === 'templates';
const hasIndexHtml = (dir) => existsSync(join(dir, 'index.html')) && statSync(join(dir, 'index.html')).isFile();
const hasPackageJson = (dir) => existsSync(join(dir, 'package.json'));

const formatDate = (filePath) => {
  try {
    const mtime = statSync(filePath).mtime;
    return mtime.toISOString().slice(0, 10);
  } catch {
    return '';
  }
};

const entries = [];

const projectDirs = readdirSync(PROJECTS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && !isHidden(d.name));

for (const projectDir of projectDirs) {
  const projectKey = projectDir.name;
  const projectPath = join(PROJECTS_DIR, projectKey);
  if (hasPackageJson(projectPath)) continue; // ソース置き場は除外（ビルド済みのみ対象）

  // 単階層
  if (hasIndexHtml(projectPath)) {
    entries.push({
      displayName: projectKey,
      projectKey,
      environment: '-',
      url: `/projects/${projectKey}/`,
      note: '',
      updatedAt: formatDate(join(projectPath, 'index.html')),
    });
  }

  // 二階層（env）
  const envDirs = readdirSync(projectPath, { withFileTypes: true }).filter(
    (d) => d.isDirectory() && !isHidden(d.name) && !hasPackageJson(join(projectPath, d.name)),
  );

  for (const envDir of envDirs) {
    const env = envDir.name;
    const envPath = join(projectPath, env);
    if (!hasIndexHtml(envPath)) continue;
    entries.push({
      displayName: `${projectKey} (${env})`,
      projectKey,
      environment: env,
      url: `/projects/${projectKey}/${env}/`,
      note: '',
      updatedAt: formatDate(join(envPath, 'index.html')),
    });
  }
}

entries.sort((a, b) => a.displayName.localeCompare(b.displayName));
writeFileSync(OUTPUT, JSON.stringify(entries, null, 2));
console.log(`generated ${entries.length} entries -> ${relative(ROOT, OUTPUT)}`);
