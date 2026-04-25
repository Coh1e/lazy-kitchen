#!/usr/bin/env tsx
/**
 * Build glossary cross-reference:
 * Walk all yaml ingredients/condiments/dry-pantry → collect every spice/condiment term →
 * verify each appears in data/glossary.yaml. Report unfound terms.
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');

interface BilingualName { zh: string; en: string }
interface Item { id?: string; name?: BilingualName; aliases?: { zh?: string[]; en?: string[] } }

async function loadItems(file: string, key = 'items'): Promise<Item[]> {
  const text = await readFile(join(DATA, file), 'utf-8');
  const data = yaml.load(text) as Record<string, unknown>;
  return ((data?.[key] ?? []) as Item[]);
}

async function main() {
  const ingredients = await loadItems('ingredients.yaml');
  const fresh = await loadItems('fresh-aromatics.yaml');
  const condiments = await loadItems('condiments.yaml');
  const dryPantry = await loadItems('dry-pantry.yaml');
  const glossary = await loadItems('glossary.yaml', 'terms');

  const glossaryZh = new Set<string>();
  const glossaryEn = new Set<string>();
  for (const g of glossary) {
    const zh = (g as unknown as { zh?: string }).zh;
    const en = (g as unknown as { en?: string }).en;
    if (zh) glossaryZh.add(zh);
    if (en) glossaryEn.add(en);
    const aliasZh = (g as unknown as { alias_zh?: string[] }).alias_zh ?? [];
    const aliasEn = (g as unknown as { alias_en?: string[] }).alias_en ?? [];
    for (const a of aliasZh) glossaryZh.add(a);
    for (const a of aliasEn) glossaryEn.add(a);
  }

  const missing: string[] = [];
  for (const collection of [ingredients, fresh, condiments, dryPantry]) {
    for (const item of collection) {
      const zh = item.name?.zh;
      const en = item.name?.en;
      if (!zh || !en) continue;
      const inGlossary = glossaryZh.has(zh) || glossaryEn.has(en);
      if (!inGlossary) missing.push(`${item.id ?? '<no-id>'} :: ${zh} / ${en}`);
    }
  }

  console.log(`Glossary has ${glossary.length} terms (${glossaryZh.size} zh / ${glossaryEn.size} en aliases).`);
  if (missing.length === 0) {
    console.log('✅ All ingredient/condiment terms resolve to glossary entries.');
    process.exit(0);
  }
  console.log(`❌ ${missing.length} terms missing from glossary:`);
  for (const m of missing) console.log(`   ${m}`);
  process.exit(1);
}

main();
