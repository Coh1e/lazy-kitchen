import { describe, it, expect } from 'vitest';
import { checkBilingualName } from '../../scripts/lint-bilingual.ts';

describe('checkBilingualName', () => {
  it('reports missing en when only zh provided', () => {
    const errors: string[] = [];
    const data = {
      items: [
        { id: 'X', name: { zh: '测试', en: 'Test' } },        // OK
        { id: 'Y', name: { zh: '只有中文' } },                  // missing en
        { id: 'Z', name: { en: 'Only English' } },             // missing zh
      ],
    };
    checkBilingualName(data, 'fixture', errors);
    expect(errors.some((e) => e.includes('Y') && /en/i.test(e))).toBe(true);
    expect(errors.some((e) => e.includes('Z') && /zh/i.test(e))).toBe(true);
    // X is OK — should not be reported
    expect(errors.some((e) => e.includes(':: X ::'))).toBe(false);
  });
});
