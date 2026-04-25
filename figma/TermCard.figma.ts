/**
 * Code Connect: TermCard
 * Figma: 📚 TermCard / Type=Default|Pitfall
 *
 * Production rendering happens in scripts/build-html.ts → termCard().
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=41-28',
  {
    props: {
      type:     figma.enum('Type', { Default: '', Pitfall: 'pitfall' }),
      category: figma.string('category'),
      zh:       figma.string('zh'),
      en:       figma.string('en'),
      pitfall:  figma.string('pitfall'),
    },
    example: ({ type, category, zh, en, pitfall }) => html`
      <div class="term-card${type === 'pitfall' ? ' pitfall' : ''}">
        <div class="term-card__top">
          <span class="term-card__category">${category}</span>
          ${type === 'pitfall' ? '<span class="term-card__warn">⚠ PITFALL</span>' : ''}
        </div>
        <div class="term-card__zh">${zh}</div>
        <div class="term-card__en">${en}</div>
        ${type === 'pitfall' ? `<div class="term-card__pitfall">✗ never: "${pitfall}"</div>` : ''}
      </div>
    `,
  }
);
