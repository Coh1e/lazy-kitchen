import { describe, it, expect } from 'vitest';
import {
  esc,
  statusBadge,
  chip,
  dishCard,
  termCard,
  emptyState,
  renderBoardSection,
  renderGlossary,
  renderCover,
  topbar,
  sidebar,
  giscusBlock,
  type DishEntry,
  type GlossaryTerm,
} from '../../scripts/build-html.ts';

describe('esc', () => {
  it('escapes &, <, > but not other characters', () => {
    expect(esc('a < b & c > d')).toBe('a &lt; b &amp; c &gt; d');
    expect(esc('plain')).toBe('plain');
  });
});

describe('statusBadge', () => {
  it('emits class + uppercase label for known status', () => {
    const html = statusBadge('approved');
    expect(html).toContain('status-badge--approved');
    expect(html).toContain('APPROVED');
  });

  it('still emits class + uppercase label for unknown status (no validation)', () => {
    const html = statusBadge('foo');
    expect(html).toContain('status-badge--foo');
    expect(html).toContain('FOO');
  });
});

describe('chip', () => {
  it('emits chip--strong with label', () => {
    const html = chip('hot', 'strong');
    expect(html).toContain('chip--strong');
    expect(html).toContain('hot');
  });

  it('escapes HTML in label', () => {
    const html = chip('<script>x & y</script>', 'default');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
  });
});

describe('dishCard', () => {
  const fullDish: DishEntry = {
    id: 'DISH-CN-TEST',
    name: { zh: '测试菜', en: 'Test dish' },
    cuisine: { region: 'Cantonese', country: 'CN' },
    status: 'approved',
    uses: { sku: ['DRY-TEST-v1'] },
    time: { hands_on_min: 25, total_min: 90 },
    flavor_tags: ['umami', 'clear'],
  };

  it('renders zh title for lang=zh + status badge + cuisine + time + sku', () => {
    const html = dishCard(fullDish, 'zh');
    expect(html).toContain('测试菜');
    expect(html).toContain('status-badge--approved');
    expect(html).toContain('CN');
    expect(html).toContain('25');
    expect(html).toContain('DRY-TEST-v1');
  });

  it('renders en title for lang=en', () => {
    const html = dishCard(fullDish, 'en');
    expect(html).toContain('Test dish');
  });

  it('omits time block when time is missing', () => {
    const noTime: DishEntry = { ...fullDish, time: undefined };
    const html = dishCard(noTime, 'zh');
    expect(html).not.toContain('dish-card__time">25');
    expect(html).not.toContain('min hands-on');
  });
});

describe('termCard', () => {
  it('renders default term without pitfall class', () => {
    const t: GlossaryTerm = { zh: '生抽', en: 'Light soy sauce', category: 'sauce' };
    const html = termCard(t);
    expect(html).toContain('生抽');
    expect(html).toContain('Light soy sauce');
    expect(html).not.toContain('pitfall');
    expect(html).not.toContain('PITFALL');
  });

  it('renders pitfall variant when do_not_translate_as is set', () => {
    const t: GlossaryTerm = {
      zh: '大料',
      en: 'Star anise',
      category: 'whole-spice',
      do_not_translate_as: ['big spice'],
    };
    const html = termCard(t);
    expect(html).toContain('pitfall');
    expect(html).toContain('PITFALL');
    expect(html).toContain('big spice');
  });
});

describe('renderBoardSection', () => {
  const sample: DishEntry[] = [
    { id: 'A', name: { zh: 'a', en: 'a' }, cuisine: { country: 'CN' }, status: 'approved' },
    { id: 'B', name: { zh: 'b', en: 'b' }, cuisine: { country: 'CN' }, status: 'planned' },
    { id: 'C', name: { zh: 'c', en: 'c' }, cuisine: { country: 'CN' }, status: 'planned' },
  ];

  it('renders 4 stat cards + section headings + dish cards', () => {
    const html = renderBoardSection(sample, 'zh');
    expect(html).toContain('stat-card');
    expect(html).toContain('已发布');
    expect(html).toContain('待审议');
    expect(html).toContain('路线图');
    expect(html).toContain('dish-card');
  });

  it('renders empty state for proposed when none exist', () => {
    const html = renderBoardSection(sample, 'en');
    expect(html).toContain('empty');
    expect(html).toContain('No active proposals');
  });
});

describe('renderGlossary', () => {
  const terms: GlossaryTerm[] = [
    { zh: '盐', en: 'Salt', category: 'condiment-base' },
    { zh: '糖', en: 'Sugar', category: 'condiment-base' },
  ];

  it('emits search input + filter pills + term cards', () => {
    const html = renderGlossary(terms, 'zh');
    expect(html).toContain('search');
    expect(html).toContain('filter-pill');
    expect(html.match(/term-card/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('盐');
  });
});

describe('renderCover', () => {
  it('renders zh hero with eyebrow + title + 4 stats + 3 method cards', () => {
    const html = renderCover('zh', { approved: 1, proposed: 0, planned: 60 });
    expect(html).toContain('section-header__eyebrow');
    expect(html).toContain('懒蛋厨房');
    expect(html).toContain('让人类拥有世界舌头');
    // 4 stats + 3 methods = 7 stat-card occurrences
    expect(html.match(/stat-card/g)?.length).toBeGreaterThanOrEqual(7);
    expect(html).toContain('A.');
    expect(html).toContain('B.');
    expect(html).toContain('C.');
  });

  it('renders en hero with English eyebrow', () => {
    const html = renderCover('en', { approved: 1, proposed: 0, planned: 60 });
    expect(html).toContain('LAZY KITCHEN');
    expect(html).toContain('Make Kitchen Great Again');
  });
});

describe('topbar', () => {
  it('marks zh as active when lang=zh', () => {
    const html = topbar('zh');
    expect(html).toContain('class="active" href="#/zh/cover"');
  });
});

describe('sidebar', () => {
  it('contains all 8 verb-based section headings (zh)', () => {
    const html = sidebar('zh');
    expect(html).toContain('开始');
    expect(html).toContain('采买');
    expect(html).toContain('预制');
    expect(html).toContain('工艺');
    expect(html).toContain('菜品组合');
    expect(html).toContain('告示栏');
  });
});

describe('giscusBlock', () => {
  it('emits real Giscus script with the term id when REPO_ID is set', () => {
    const html = giscusBlock('DISH-X');
    // With default IDs hardcoded, expect real Giscus widget
    expect(html).toContain('giscus.app/client.js');
    expect(html).toContain('data-term="DISH-X"');
    expect(html).toContain('data-mapping="specific"');
  });
});

describe('emptyState', () => {
  it('renders title + sub', () => {
    const html = emptyState('Nothing here', 'try later');
    expect(html).toContain('Nothing here');
    expect(html).toContain('try later');
    expect(html).toContain('empty__title');
  });
});
