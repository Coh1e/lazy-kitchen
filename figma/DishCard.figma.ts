/**
 * Code Connect: DishCard
 * Figma: 🍽️ DishCard / Status=Approved|Proposed|Draft
 *
 * Maps to the .dish-card composition. Production rendering happens in
 * scripts/build-html.ts → dishCard() function, which reads data/dishes.yaml.
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=39-74',
  {
    props: {
      status:        figma.enum('Status', { Approved: 'approved', Proposed: 'proposed', Draft: 'draft' }),
      id:            figma.string('id'),
      title:         figma.string('title'),
      subtitle:      figma.string('subtitle'),
      cuisineLabel:  figma.string('cuisineLabel'),
      timeNum:       figma.string('timeNum'),
      skuId:         figma.string('skuId'),
    },
    example: ({ status, id, title, subtitle, cuisineLabel, timeNum, skuId }) => html`
      <a class="dish-card" href="#/zh/compose/${id}">
        <div class="dish-card__top">
          <span class="status-badge status-badge--${status}">${status.toUpperCase()}</span>
          <span class="chip chip--default">${cuisineLabel}</span>
          <span class="dish-card__id">${id}</span>
        </div>
        <h3 class="dish-card__title">${title}</h3>
        <p class="dish-card__subtitle">${subtitle}</p>
        <div class="dish-card__meta">
          <span class="dish-card__time">${timeNum}</span>
          <span class="dish-card__time-unit">min hands-on</span>
        </div>
        <div class="dish-card__divider"></div>
        <div class="dish-card__sku">
          <span class="dish-card__sku-label">USES</span>
          <span class="dish-card__sku-id">${skuId}</span>
        </div>
      </a>
    `,
  }
);
