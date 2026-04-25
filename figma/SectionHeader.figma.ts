/**
 * Code Connect: SectionHeader
 * Figma: 🧩 SectionHeader (single component, 3 text props)
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=36-2',
  {
    props: {
      eyebrow: figma.string('eyebrow'),
      title:   figma.string('title'),
      intro:   figma.string('intro'),
    },
    example: ({ eyebrow, title, intro }) => html`
      <div class="section-header">
        <div class="section-header__eyebrow">${eyebrow}</div>
        <h1 class="section-header__title">${title}</h1>
        <p class="section-header__intro">${intro}</p>
      </div>
    `,
  }
);
