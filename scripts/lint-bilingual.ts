#!/usr/bin/env tsx
/**
 * Lint bilingual integrity:
 *   1. Every docs/zh/**.md has a docs/en/**.md mirror (and vice versa).
 *   2. Every yaml `name` field has both zh + en.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const DATA = join(ROOT, 'data');

async function walkMd(dir: string, base: string, out: string[]) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkMd(full, base, out);
    else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
      out.push(relative(base, full).replace(/\\/g, '/'));
    }
  }
}

async function checkMirror(): Promise<string[]> {
  const errors: string[] = [];
  const zh: string[] = [];
  const en: string[] = [];
  try { await walkMd(join(DOCS, 'zh'), join(DOCS, 'zh'), zh); } catch {}
  try { await walkMd(join(DOCS, 'en'), join(DOCS, 'en'), en); } catch {}
  const zhSet = new Set(zh);
  const enSet = new Set(en);
  for (const f of zhSet) if (!enSet.has(f)) errors.push(`missing en mirror: docs/en/${f}`);
  for (const f of enSet) if (!zhSet.has(f)) errors.push(`missing zh mirror: docs/zh/${f}`);
  return errors;
}

async function walkYaml(dir: string, out: string[]) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkYaml(full, out);
    else if (entry.name.endsWith('.yaml')) out.push(full);
  }
}

function checkBilingualName(node: unknown, path: string, errors: string[]) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const [i, v] of node.entries()) checkBilingualName(v, `${path}[${i}]`, errors);
    return;
  }
  const obj = node as Record<string, unknown>;
  if ('name' in obj && obj.name && typeof obj.name === 'object' && !Array.isArray(obj.name)) {
    const n = obj.name as Record<string, unknown>;
    const id = (obj as { id?: string }).id ?? '<no-id>';
    if (!n.zh || typeof n.zh !== 'string') errors.push(`${path} :: ${id} :: name.zh missing or empty`);
    if (!n.en || typeof n.en !== 'string') errors.push(`${path} :: ${id} :: name.en missing or empty`);
  }
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object') checkBilingualName(v, `${path}.${k}`, errors);
  }
}

async function checkYamlBilingual(): Promise<string[]> {
  const errors: string[] = [];
  const files: string[] = [];
  await walkYaml(DATA, files);
  for (const f of files) {
    const text = await readFile(f, 'utf-8');
    try {
      const data = yaml.load(text);
      checkBilingualName(data, relative(ROOT, f).replace(/\\/g, '/'), errors);
    } catch (e) {
      errors.push(`${f} :: yaml parse error: ${e}`);
    }
  }
  return errors;
}

async function main() {
  const mirrorErrs = await checkMirror();
  const yamlErrs = await checkYamlBilingual();
  const all = [...mirrorErrs, ...yamlErrs];
  if (all.length === 0) {
    console.log('✅ bilingual integrity: all docs mirrored, all yaml names zh+en complete');
    process.exit(0);
  }
  for (const e of all) console.log(`❌ ${e}`);
  console.log(`\n${all.length} bilingual issues.`);
  process.exit(1);
}

// Exported for unit testing
export { checkBilingualName, checkMirror, walkMd, walkYaml };

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main();
}
