import { describe, it, expect } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const SCHEMAS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'schemas');

async function makeAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv as any);
  const files = await readdir(SCHEMAS);
  for (const f of files) {
    if (!f.endsWith('.schema.json')) continue;
    const text = await readFile(join(SCHEMAS, f), 'utf-8');
    ajv.addSchema(JSON.parse(text), f);
  }
  return ajv;
}

async function loadFixture(name: string) {
  const text = await readFile(join(FIXTURES, name), 'utf-8');
  return yaml.load(text, { schema: yaml.CORE_SCHEMA }) as { items: unknown[] };
}

describe('schema validation', () => {
  it('valid dish fixture passes dish.schema', async () => {
    const ajv = await makeAjv();
    const validate = ajv.getSchema('dish.schema.json');
    expect(validate).toBeTruthy();
    const data = await loadFixture('dishes.valid.yaml');
    const ok = validate!(data.items[0]);
    if (!ok) console.error(validate!.errors);
    expect(ok).toBe(true);
  });

  it('invalid dish fixture (missing cuisine) fails dish.schema', async () => {
    const ajv = await makeAjv();
    const validate = ajv.getSchema('dish.schema.json');
    const data = await loadFixture('dishes.invalid.yaml');
    const ok = validate!(data.items[0]);
    expect(ok).toBe(false);
    expect(validate!.errors?.some((e) => /cuisine/.test(e.message ?? ''))).toBe(true);
  });
});
