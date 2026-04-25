/**
 * Code Connect: StatusBadge
 * Figma: 🟢 StatusBadge / Status=Draft|Proposed|Review|Approved|Deprecated
 *
 * Maps the 5-variant Figma StatusBadge to the production HTML snippet
 * (CSS class .status-badge--{status} from docs/_theme/lazy-kitchen.css).
 */

import figma, { html } from '@figma/code-connect/html';

figma.connect(
  'https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo?node-id=33-12',
  {
    props: {
      status: figma.enum('Status', {
        Draft:      'draft',
        Proposed:   'proposed',
        Review:     'review',
        Approved:   'approved',
        Deprecated: 'deprecated',
      }),
    },
    example: ({ status }) => html`<span class="status-badge status-badge--${status}">${status.toUpperCase()}</span>`,
  }
);
