/**
 * Code Connect: IngredientRow
 * Figma: 📋 IngredientTable › IngredientRow (3 text props: name, amount, note)
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=56-5',
  {
    props: {
      name:   figma.string('name'),
      amount: figma.string('amount'),
      note:   figma.string('note'),
    },
    example: ({ name, amount, note }) => html`
      <div class="ingredients__row">
        <span class="ingredients__name">${name}</span>
        <span class="ingredients__amount">${amount}</span>
        <span class="ingredients__note">${note}</span>
      </div>
    `,
  }
);
