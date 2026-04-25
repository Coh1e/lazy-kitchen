#!/usr/bin/env tsx
/**
 * Validate all data/*.yaml against schemas/*.schema.json using ajv.
 * Iterates `items: [...]` arrays; each item validated against the appropriate schema.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
type AnyAjv = InstanceType<typeof Ajv2020>;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMAS_DIR = join(ROOT, 'schemas');
const DATA_DIR = join(ROOT, 'data');

// Map data file → schema id
const FILE_SCHEMA_MAP: Record<string, string> = {
  'hardware.yaml': 'hardware',
  'hardware-extensions.yaml': 'hardware',
  'ingredients.yaml': 'ingredient',
  'fresh-aromatics.yaml': 'ingredient',
  'condiments.yaml': 'condiment',
  'dry-pantry.yaml': 'condiment',
  'glossary.yaml': 'glossary-entry',
  'pairings.yaml': 'pairing',
  'ratios.yaml': 'ratio',
  'sop.yaml': 'sop',
  'dishes.yaml': 'dish',
  'sku/dry.yaml': 'sku',
  'sku/wet.yaml': 'sku',
  'sku/cooked.yaml': 'sku',
  'sku/soup.yaml': 'sku',
  'sku/ready.yaml': 'sku',
};

// Files validated against custom inline structure (not schema-per-item)
const SKIP_VALIDATION = new Set([
  'flavor-vocabulary.yaml',
  'heat-tiers.yaml',
  'oil-temp-tiers.yaml',
  'diet-tags.yaml',
  'storage-profiles.yaml',
  'substitutions.yaml',
]);

// Data file → top-level array key
function arrayKey(file: string): string {
  if (file.includes('glossary')) return 'terms';
  if (file.includes('pairings')) return 'pairings';
  if (file.includes('ratios')) return 'ratios';
  return 'items';
}

async function loadSchemas(ajv: AnyAjv) {
  const files = await readdir(SCHEMAS_DIR);
  for (const f of files) {
    if (!f.endsWith('.schema.json')) continue;
    const text = await readFile(join(SCHEMAS_DIR, f), 'utf-8');
    const schema = JSON.parse(text);
    ajv.addSchema(schema, f);
  }
}

async function validateFile(ajv: AnyAjv, relPath: string, schemaName: string): Promise<{ ok: boolean; errors: string[] }> {
  const text = await readFile(join(DATA_DIR, relPath), 'utf-8');
  // CORE_SCHEMA: don't auto-parse ISO timestamps into JS Date objects
  const data = yaml.load(text, { schema: yaml.CORE_SCHEMA }) as Record<string, unknown>;
  const key = arrayKey(relPath);
  const items = (data?.[key] ?? []) as unknown[];
  const validate = ajv.getSchema(`${schemaName}.schema.json`);
  if (!validate) return { ok: false, errors: [`schema not found: ${schemaName}`] };
  const errors: string[] = [];
  for (const [i, item] of items.entries()) {
    if (!validate(item)) {
      const idHint = (item as { id?: string })?.id ?? `#${i}`;
      for (const err of validate.errors ?? []) {
        errors.push(`${relPath} :: ${idHint} :: ${err.instancePath} ${err.message}`);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

async function main() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv as any);
  await loadSchemas(ajv);

  let totalChecked = 0;
  let totalErrors = 0;
  for (const [file, schema] of Object.entries(FILE_SCHEMA_MAP)) {
    if (SKIP_VALIDATION.has(file.split('/').pop()!)) continue;
    const { ok, errors } = await validateFile(ajv, file, schema);
    if (ok) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file}`);
      for (const e of errors) console.log(`   ${e}`);
      totalErrors += errors.length;
    }
    totalChecked++;
  }

  console.log(`\nValidated ${totalChecked} files, ${totalErrors} errors.`);
  process.exit(totalErrors > 0 ? 1 : 0);
}

// Exported for unit testing
export { loadSchemas, validateFile, arrayKey, FILE_SCHEMA_MAP };

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
