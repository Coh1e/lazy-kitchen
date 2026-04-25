/**
 * Code Connect: StatCard
 * Figma: 📊 StatCard / Tone=Default|Approved|Proposed|Muted
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=36-22',
  {
    props: {
      tone:   figma.enum('Tone', { Default: '', Approved: 'approved', Proposed: 'proposed', Muted: 'muted' }),
      number: figma.string('number'),
      label:  figma.string('label'),
      sub:    figma.string('sub'),
    },
    example: ({ tone, number, label, sub }) => html`
      <div class="stat-card${tone ? ' stat-card--' + tone : ''}">
        <div class="stat-card__num">${number}</div>
        <div class="stat-card__label">${label}</div>
        <div class="stat-card__sub">${sub}</div>
      </div>
    `,
  }
);
