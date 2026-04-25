#!/usr/bin/env tsx
/**
 * Build single-file HTML viewer at lazy-kitchen.html.
 * Mirrors Figma design system v0.2 (file WKCKghfPr2XXsJIovE7Azo).
 *
 * Run with: npm run build:html
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const DATA = join(ROOT, 'data');

const REPO = process.env.BUILD_REPO ?? 'Coh1e/lazy-kitchen';
const GISCUS_REPO_ID = process.env.GISCUS_REPO_ID ?? '';
const GISCUS_CATEGORY_ID = process.env.GISCUS_CATEGORY_ID ?? '';

interface Page { path: string; title: string; lang: 'zh' | 'en'; html: string }

interface DishEntry {
  id: string;
  name: { zh: string; en: string };
  cuisine: { region?: string; country: string };
  status: string;
  planned_skus?: string[];
  planned_sops?: string[];
  uses?: { sku?: string[]; sop?: string[]; ratio?: string[] };
  time?: { hands_on_min?: number; total_min?: number };
  flavor_tags?: string[];
  notes?: string;
}

interface GlossaryTerm {
  zh: string; en: string;
  alias_zh?: string[]; alias_en?: string[];
  category?: string;
  do_not_translate_as?: string[];
  notes?: string;
}

/* ──────────────────────────────────────────── */
/*  walk + load                                  */
/* ──────────────────────────────────────────── */

async function walk(dir: string, out: string[]) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') && entry.name !== '_theme') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
}

function deriveTitle(md: string, fallback: string): string {
  const h1 = md.match(/^#\s+(.+)$/m);
  return h1?.[1].trim() ?? fallback;
}

async function loadPages(): Promise<Page[]> {
  const files: string[] = [];
  try { await walk(DOCS, files); } catch {}
  const pages: Page[] = [];
  for (const f of files) {
    const rel = relative(DOCS, f).replace(/\\/g, '/');
    const lang = (rel.startsWith('en/') ? 'en' : 'zh') as 'zh' | 'en';
    const text = await readFile(f, 'utf-8');
    const title = deriveTitle(text, rel);
    const html = await marked.parse(text);
    pages.push({ path: rel, title, lang, html });
  }
  return pages;
}

async function loadDishes(): Promise<DishEntry[]> {
  const text = await readFile(join(DATA, 'dishes.yaml'), 'utf-8');
  const data = yaml.load(text) as { items: DishEntry[] };
  return data.items;
}

async function loadGlossary(): Promise<GlossaryTerm[]> {
  const text = await readFile(join(DATA, 'glossary.yaml'), 'utf-8');
  const data = yaml.load(text) as { terms: GlossaryTerm[] };
  return data.terms;
}

/* ──────────────────────────────────────────── */
/*  HTML helpers — mirror Figma component CSS    */
/* ──────────────────────────────────────────── */

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function statusBadge(status: string): string {
  return `<span class="status-badge status-badge--${status}">${status.toUpperCase()}</span>`;
}

function chip(text: string, variant: 'default' | 'strong' | 'outline' = 'default'): string {
  return `<span class="chip chip--${variant}">${esc(text)}</span>`;
}

function dishCard(d: DishEntry, lang: 'zh' | 'en'): string {
  const name = d.name?.[lang] ?? d.name?.en ?? d.id;
  const altLang = lang === 'zh' ? 'en' : 'zh';
  const altName = d.name?.[altLang] ?? '';
  const cuisine = `${d.cuisine?.country ?? '?'}${d.cuisine?.region ? ' · ' + d.cuisine.region : ''}`;
  const handsOn = d.time?.hands_on_min;
  const skuId = d.uses?.sku?.[0] ?? d.planned_skus?.[0] ?? '—';
  const tags = (d.flavor_tags ?? []).slice(0, 4);

  return `<a class="dish-card" href="#/${lang}/compose/${d.id.toLowerCase().replace(/^dish-/, '').replace(/_/g, '-')}">
    <div class="dish-card__top">
      ${statusBadge(d.status)}
      ${chip(cuisine)}
      <span class="dish-card__id">${esc(d.id)}</span>
    </div>
    <h3 class="dish-card__title">${esc(name)}</h3>
    ${altName ? `<p class="dish-card__subtitle">${esc(altName)}</p>` : ''}
    ${handsOn !== undefined ? `<div class="dish-card__meta">
      <span class="dish-card__time">${handsOn}</span>
      <span class="dish-card__time-unit">min hands-on${d.time?.total_min ? ` · ${d.time.total_min} min total` : ''}</span>
    </div>` : ''}
    ${tags.length ? `<div class="dish-card__tags">${tags.map(t => chip(t)).join('')}</div>` : ''}
    <div class="dish-card__divider"></div>
    <div class="dish-card__sku">
      <span class="dish-card__sku-label">USES</span>
      <span class="dish-card__sku-id">${esc(skuId)}</span>
    </div>
  </a>`;
}

function termCard(t: GlossaryTerm): string {
  const isPitfall = !!(t.do_not_translate_as && t.do_not_translate_as.length);
  const aliasParts: string[] = [];
  if (t.alias_zh?.length) aliasParts.push(`zh: ${t.alias_zh.join(', ')}`);
  if (t.alias_en?.length) aliasParts.push(`en: ${t.alias_en.join(', ')}`);
  return `<div class="term-card${isPitfall ? ' pitfall' : ''}">
    <div class="term-card__top">
      <span class="term-card__category">${esc(t.category ?? 'TERM')}</span>
      ${isPitfall ? `<span class="term-card__warn">⚠ PITFALL</span>` : ''}
    </div>
    <div class="term-card__zh">${esc(t.zh)}</div>
    <div class="term-card__en">${esc(t.en)}</div>
    ${aliasParts.length ? `<div class="term-card__alias">alias · ${esc(aliasParts.join(' · '))}</div>` : ''}
    ${isPitfall ? `<div class="term-card__pitfall">✗ never: "${esc(t.do_not_translate_as!.join(', '))}"</div>` : ''}
  </div>`;
}

function emptyState(title: string, sub: string): string {
  return `<div class="empty"><div class="empty__title">${esc(title)}</div><div class="empty__sub">${esc(sub)}</div></div>`;
}

/* ──────────────────────────────────────────── */
/*  Generated pages                              */
/* ──────────────────────────────────────────── */

function renderBoardSection(dishes: DishEntry[], lang: 'zh' | 'en'): string {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh);
  const proposed = dishes.filter(d => d.status === 'proposed');
  const approved = dishes.filter(d => d.status === 'approved');
  const planned  = dishes.filter(d => d.status === 'planned');

  const stats = `<div class="grid-4">
    <div class="stat-card stat-card--approved">
      <div class="stat-card__num">${approved.length}</div>
      <div class="stat-card__label">${t('Approved', '已发布')}</div>
      <div class="stat-card__sub">${t('this week', '本周')}</div>
    </div>
    <div class="stat-card stat-card--proposed">
      <div class="stat-card__num">${proposed.length}</div>
      <div class="stat-card__label">${t('Proposed', '待审议')}</div>
      <div class="stat-card__sub">${t('in review', '征集反馈')}</div>
    </div>
    <div class="stat-card stat-card--muted">
      <div class="stat-card__num">${planned.length}</div>
      <div class="stat-card__label">${t('Planned', '路线图')}</div>
      <div class="stat-card__sub">${t('roadmap', '占位中')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__num">—</div>
      <div class="stat-card__label">${t('Comments', '评论')}</div>
      <div class="stat-card__sub">${t('via Giscus', '由 Giscus 收集')}</div>
    </div>
  </div>`;

  const section = (heading: string, items: DishEntry[], emptyMsg?: string) => {
    if (items.length === 0 && emptyMsg) {
      return `<h2>${heading}</h2>${emptyState(emptyMsg, t('Check back later.', '稍后再来。'))}`;
    }
    return `<h2>${heading} <span class="muted" style="font-size:0.6em;font-weight:500">(${items.length})</span></h2>
            <div class="grid-3">${items.map(d => dishCard(d, lang)).join('')}</div>`;
  };

  return stats
    + section(t('🍳 Proposed', '🍳 待审议'), proposed, t('No active proposals right now.', '当前没有待审议菜品。'))
    + section(t('✅ Approved', '✅ 已发布'), approved)
    + section(t('📋 Planned (roadmap)', '📋 路线图'), planned);
}

function renderGlossary(terms: GlossaryTerm[], lang: 'zh' | 'en'): string {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh);
  const cats = ['all', ...Array.from(new Set(terms.map(x => x.category).filter(Boolean) as string[]))];
  const filterPills = cats.map((c, i) =>
    `<a class="filter-pill${i === 0 ? ' active' : ''}" href="#" data-cat="${c}">${esc(c)}</a>`
  ).join(' ');
  const cards = terms.map(termCard).join('');

  return `<div class="search">
      <span class="muted">⌕</span>
      <input type="search" placeholder="${t('Search terms… (zh or en)', '搜索术语… (中或英)')}" />
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0">${filterPills}</div>
    <div class="grid-3">${cards}</div>`;
}

function renderCover(lang: 'zh' | 'en', dishCount: { approved: number; proposed: number; planned: number }): string {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh);
  return `<div class="section-header">
    <div class="section-header__eyebrow">🍳 ${t('LAZY KITCHEN · v0.1', '懒蛋厨房 · v0.1')}</div>
    <h1 class="section-header__title">${t('Make Kitchen Great Again.', '让人类拥有世界舌头！')}</h1>
    <p class="section-header__intro">${t(
      'A structured, AI-curated, minimal-hardware kitchen operating system. Built as a static site + portable CLI skill — no backend, no accounts, no drama.',
      '结构化、AI 化、硬件极简、时间最优的厨房操作系统。静态站点 + 可移植 CLI skill — 无后端、无账户、不折腾。'
    )}</p>
  </div>

  <div class="grid-4" style="margin-top:48px">
    <div class="stat-card">
      <div class="stat-card__num">10</div>
      <div class="stat-card__label">${t('MVP hardware', '硬件')}</div>
      <div class="stat-card__sub">${t('The locked 10-piece kit', '锁死的 10 件套')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__num">62</div>
      <div class="stat-card__label">${t('Design tokens', '设计 tokens')}</div>
      <div class="stat-card__sub">${t('Variables + 8 text styles', '变量 + 8 文字样式')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__num">${dishCount.approved}+${dishCount.planned}</div>
      <div class="stat-card__label">${t('Dishes', '菜品')}</div>
      <div class="stat-card__sub">${t(`${dishCount.approved} approved + ${dishCount.planned} planned`, `${dishCount.approved} 已发布 + ${dishCount.planned} 计划中`)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__num">Static</div>
      <div class="stat-card__label">${t('Backend', '后端')}</div>
      <div class="stat-card__sub">${t('No server. No accounts. No DB.', '无服务器、无账户、无数据库。')}</div>
    </div>
  </div>

  <h2>${t('Three ways to use this repo', '三种用法')}</h2>
  <div class="grid-3">
    <div class="stat-card">
      <div style="font-size:32px;font-weight:700;color:var(--color-accent-hover)">A.</div>
      <div class="stat-card__label">${t('Read manual', '看手册')}</div>
      <div class="stat-card__sub">${t('Double-click lazy-kitchen.html. Zero install. Works offline.', '双击 lazy-kitchen.html — 零安装、可离线。')}</div>
    </div>
    <div class="stat-card">
      <div style="font-size:32px;font-weight:700;color:var(--color-accent-hover)">B.</div>
      <div class="stat-card__label">${t('Add a dish', '加新菜')}</div>
      <div class="stat-card__sub">${t('Run /add-dish in your CLI agent (Cline + DeepSeek recommended for Chinese).', 'CLI 调 /add-dish（中文推荐 Cline + DeepSeek）')}</div>
    </div>
    <div class="stat-card">
      <div style="font-size:32px;font-weight:700;color:var(--color-accent-hover)">C.</div>
      <div class="stat-card__label">${t('Review drafts', '审稿')}</div>
      <div class="stat-card__sub">${t('Switch CLI (Codex/Gemini) for cross-family second-opinion audit.', '换个 CLI（Codex / Gemini）做跨家族二审。')}</div>
    </div>
  </div>`;
}

/* ──────────────────────────────────────────── */
/*  Topbar + Sidebar                             */
/* ──────────────────────────────────────────── */

function topbar(lang: 'zh' | 'en'): string {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh);
  return `<header class="topbar"><div class="topbar__inner">
    <span class="topbar__hamburger" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</span>
    <span class="topbar__brand">LAZY KITCHEN</span>
    <span class="topbar__tag">/ ${t('Make Kitchen Great Again', '让人类拥有世界舌头')}</span>
    <span class="topbar__spacer"></span>
    <span class="lang-switch">
      <a class="${lang === 'zh' ? 'active' : ''}" href="#/zh/cover">ZH</a>
      <span class="sep">·</span>
      <a class="${lang === 'en' ? 'active' : ''}" href="#/en/cover">EN</a>
    </span>
    <div class="search">
      <span class="muted">⌕</span>
      <input id="search" type="search" placeholder="${t('Search dishes, SKUs, SOPs…', '搜索菜、SKU、SOP…')}" />
      <span class="search-kbd">⌘K</span>
    </div>
  </div></header>`;
}

function sidebar(lang: 'zh' | 'en'): string {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh);
  const link = (slug: string, en: string, zh: string) =>
    `<li><a href="#/${lang}/${slug}">${t(en, zh)}</a></li>`;

  return `<nav class="sidebar">
    <h3>${t('Start', '开始')}</h3><ul>
      ${link('start/philosophy', 'Philosophy', '理念')}
      ${link('start/workflow', 'Workflow', '使用循环')}
      ${link('start/hardware', 'Hardware', '硬件')}
      ${link('start/pantry-layers', 'Pantry layers', '储藏分层')}
      ${link('start/heat-and-oil', 'Heat & oil', '火候与油温')}
      ${link('start/safety', 'Safety', '食品安全')}
    </ul>
    <h3>${t('Buy', '采买')}</h3><ul>
      ${link('buy/buying-guide', 'Buying guide', '采购总论')}
      ${link('buy/ingredients', 'Ingredients', '基础食材')}
      ${link('buy/fresh-aromatics', 'Fresh aromatics', '生鲜香辛')}
      ${link('buy/condiments', 'Condiments', '基础调料')}
      ${link('buy/dry-pantry', 'Dry pantry', '干货母库')}
      ${link('buy/hardware-guide', 'Hardware guide', '硬件指南')}
      ${link('buy/consumables-guide', 'Consumables', '耗材指南')}
    </ul>
    <h3>${t('Pack — SKUs', '预制 — SKUs')}</h3><ul>
      ${link('pack/index', 'SKU shelf', 'SKU 货架')}
      ${link('pack/packaging-guide', 'Packaging guide', '分装指南')}
      ${link('pack/dry/canton-clear-beef', '⭐ Cantonese clear beef', '⭐ 广式清汤牛腩包')}
    </ul>
    <h3>${t('Cook — SOPs', '工艺 — SOPs')}</h3><ul>
      ${link('cook/index', 'SOP overview', 'SOP 总览')}
      ${link('cook/mise-en-place', 'Mise en place', '备菜纪律')}
      ${link('cook/doneness', 'Doneness', '断生判断')}
      ${link('cook/canton-clear-beef', 'Cantonese clear beef', '广式清汤牛腩 SOP')}
    </ul>
    <h3>${t('Compose', '菜品组合')}</h3><ul>
      ${link('compose/canton-clear-beef-noodles', 'Cantonese clear beef noodles', '清汤牛腩粉')}
    </ul>
    <h3>${t('Ratios & Glossary', '调味公式 & 词典')}</h3><ul>
      ${link('ratios/index', 'Ratios', '调味公式')}
      ${link('glossary', 'Glossary', '中英术语')}
    </ul>
    <h3>${t('🪧 Bulletin Board', '🪧 告示栏')}</h3><ul>
      ${link('board/index', 'Overview', '总览')}
      ${link('board/proposed', 'Proposed', '待审议')}
      ${link('board/recent', 'Recently approved', '最近发布')}
      ${link('board/contributing', 'How to participate', '怎么参与')}
    </ul>
    <h3>${t('AI', 'AI')}</h3><ul>
      ${link('ai/how-it-works', 'How it works', 'AI 工作流')}
      ${link('ai/choose-your-ai', 'Choose your AI', '选你的 AI')}
      ${link('ai/using-claude-code', 'Using Claude Code', '用 Claude Code')}
    </ul>
  </nav>`;
}

function giscusBlock(termId: string): string {
  if (!GISCUS_REPO_ID) {
    return `<div class="giscus-wrapper"><div class="empty">
      <div class="empty__title">💬 Discussion</div>
      <div class="empty__sub">Giscus would mount here at term=${esc(termId)} (set GISCUS_REPO_ID env to enable)</div>
    </div></div>`;
  }
  return `<div class="giscus-wrapper">
    <script src="https://giscus.app/client.js"
      data-repo="${REPO}" data-repo-id="${GISCUS_REPO_ID}"
      data-category="Dish Discussions" data-category-id="${GISCUS_CATEGORY_ID}"
      data-mapping="specific" data-term="${termId}" data-strict="1"
      data-reactions-enabled="1" data-emit-metadata="0"
      data-input-position="top" data-theme="preferred_color_scheme"
      data-lang="zh-CN" crossorigin="anonymous" async></script>
  </div>`;
}

/* ──────────────────────────────────────────── */
/*  main                                         */
/* ──────────────────────────────────────────── */

async function main() {
  const pages = await loadPages();
  const dishes = await loadDishes();
  const glossary = await loadGlossary();

  const themeCss = await readFile(join(DOCS, '_theme', 'lazy-kitchen.css'), 'utf-8').catch(() => '');

  const dishStats = {
    approved: dishes.filter(d => d.status === 'approved').length,
    proposed: dishes.filter(d => d.status === 'proposed').length,
    planned:  dishes.filter(d => d.status === 'planned').length,
  };

  // Patch generated pages
  for (const p of pages) {
    if (p.path === 'zh/board/proposed.md') p.html += renderBoardSection(dishes, 'zh');
    if (p.path === 'en/board/proposed.md') p.html += renderBoardSection(dishes, 'en');
    if (p.path === 'zh/glossary.md')       p.html += renderGlossary(glossary, 'zh');
    if (p.path === 'en/glossary.md')       p.html += renderGlossary(glossary, 'en');

    // Append Giscus to dish/SKU/SOP detail pages
    const isDishPage = p.path.includes('/compose/');
    const isSkuPage  = p.path.includes('/pack/dry/') || p.path.includes('/pack/wet/');
    const isSopPage  = p.path.includes('/cook/canton-');
    if (isDishPage || isSkuPage || isSopPage) {
      const slug = p.path.replace(/\.md$/, '').split('/').slice(-1)[0];
      p.html += giscusBlock(slug);
    }
  }

  // Synthesize the cover landing pages (override docs/{lang}/index.md if exists, or inject)
  const coverZh = renderCover('zh', dishStats);
  const coverEn = renderCover('en', dishStats);
  pages.push({ path: 'zh/cover.md', title: '懒蛋厨房', lang: 'zh', html: coverZh });
  pages.push({ path: 'en/cover.md', title: 'Lazy Kitchen', lang: 'en', html: coverEn });

  // Pages JSON for SPA router
  const pagesJson = JSON.stringify(
    pages.reduce((acc, p) => {
      const slug = p.path.replace(/\.md$/, '');
      acc[slug] = { title: p.title, html: p.html, lang: p.lang };
      return acc;
    }, {} as Record<string, { title: string; html: string; lang: string }>),
    null, 0
  );

  const html = `<!doctype html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <meta name="theme-color" content="#2C2E33" />
  <title>懒蛋厨房 / Lazy Kitchen</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" />
  <style>${themeCss}</style>
</head>
<body>
  <div id="topbar"></div>
  <div class="layout">
    <div id="sidebar-mount"></div>
    <main id="content"></main>
  </div>
  <footer class="bottom">
    <a href="https://github.com/${REPO}">GitHub</a> · MIT License ·
    <span class="muted">Single-file build · Figma-mirrored design</span>
  </footer>

  <script>
    const PAGES = ${pagesJson};
    const TOPBAR = { zh: ${JSON.stringify(topbar('zh'))}, en: ${JSON.stringify(topbar('en'))} };
    const SIDEBAR = { zh: ${JSON.stringify(sidebar('zh'))}, en: ${JSON.stringify(sidebar('en'))} };

    function langOf(hash) { return hash.startsWith('en/') ? 'en' : 'zh'; }
    function closeDrawer() {
      const sb = document.querySelector('.sidebar');
      if (sb) sb.classList.remove('open');
    }

    function render() {
      const hash = location.hash.slice(2) || 'zh/cover';
      const lang = langOf(hash);
      document.getElementById('topbar').innerHTML = TOPBAR[lang];
      document.getElementById('sidebar-mount').innerHTML = SIDEBAR[lang];
      // mark active sidebar link
      document.querySelectorAll('.sidebar a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href === '#/' + hash) a.classList.add('active');
        // auto-close drawer on link tap (mobile)
        a.addEventListener('click', closeDrawer);
      });
      const page = PAGES[hash];
      const main = document.getElementById('content');
      if (page) {
        main.innerHTML = page.html;
        document.title = page.title + ' · 懒蛋厨房';
      } else {
        main.innerHTML = '<h1>404</h1><p>Page not found: <code>' + hash + '</code></p>';
      }
      window.scrollTo(0, 0);
      closeDrawer();
      // wire search
      const sIn = document.getElementById('search');
      if (sIn) sIn.addEventListener('input', (e) => doSearch(e.target.value.trim()));
    }

    // close drawer when tapping the scrim
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'MAIN') closeDrawer();
    });

    function doSearch(q) {
      if (!q) return render();
      const norm = q.toLowerCase();
      const hits = Object.entries(PAGES).filter(([k, v]) =>
        k.toLowerCase().includes(norm) ||
        v.title.toLowerCase().includes(norm) ||
        v.html.toLowerCase().includes(norm)
      ).slice(0, 30);
      const main = document.getElementById('content');
      main.innerHTML = '<h1>Search: ' + q + '</h1><div class="grid-2">' +
        hits.map(([k, v]) => '<a class="dish-card" href="#/' + k + '"><h3 class="dish-card__title">' +
          v.title + '</h3><div class="dish-card__id">' + k + '</div></a>').join('') +
        '</div>';
    }

    window.addEventListener('hashchange', render);
    window.addEventListener('DOMContentLoaded', render);
  </script>
</body>
</html>`;

  await writeFile(join(ROOT, 'lazy-kitchen.html'), html, 'utf-8');
  console.log(`✅ wrote lazy-kitchen.html`);
  console.log(`   ${pages.length} pages · ${dishes.length} dishes · ${glossary.length} glossary terms`);
}

// Export pure render functions for unit testing
export {
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
};
export type { DishEntry, GlossaryTerm, Page };

// Only run main() when invoked directly, not when imported
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
