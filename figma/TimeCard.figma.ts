/**
 * Code Connect: TimeCard
 * Figma: ⏱️ TimeCard (handsOnNum + breakdown text props)
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=39-92',
  {
    props: {
      handsOnNum: figma.string('handsOnNum'),
      breakdown:  figma.string('breakdown'),
    },
    example: ({ handsOnNum, breakdown }) => html`
      <div class="time-card">
        <div class="time-card__label">TIME — HANDS-ON IS THE LAZY METRIC</div>
        <div class="time-card__big">
          <span class="time-card__num">${handsOnNum}</span>
          <span class="time-card__unit">min hands-on</span>
        </div>
        <div class="time-card__breakdown">${breakdown}</div>
      </div>
    `,
  }
);
