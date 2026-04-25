/**
 * Code Connect: Chip
 * Figma: 🔘 Chip / Style=Default|Strong|Outline|Inverse × Size=Sm|Md
 *
 * Maps the 8-variant Figma Chip to the production HTML snippet
 * (CSS classes .chip + .chip--{style} from docs/_theme/lazy-kitchen.css).
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=32-18',
  {
    props: {
      label: figma.string('label'),
      style: figma.enum('Style', {
        Default: 'default',
        Strong:  'strong',
        Outline: 'outline',
        Inverse: 'inverse',
      }),
      size:  figma.enum('Size', { Sm: 'sm', Md: 'md' }),
    },
    example: ({ label, style, size }) => html`
      <span class="chip chip--${style} ${size === 'sm' ? 'chip--sm' : ''}">${label}</span>
    `,
  }
);
