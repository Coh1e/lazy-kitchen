# Figma Code Connect mappings — Lazy Kitchen v0.2

This directory pairs each Figma component (in [WKCKghfPr2XXsJIovE7Azo](https://www.figma.com/design/WKCKghfPr2XXsJIovE7Azo))
with its production HTML snippet (CSS classes from `docs/_theme/lazy-kitchen.css`).

## Files

| File | Figma component | Variants | Production location |
|---|---|---|---|
| `StatusBadge.figma.ts`   | 🟢 StatusBadge   | 5 (Status)    | `.status-badge--{status}` |
| `Chip.figma.ts`          | 🔘 Chip          | 8 (Style × Size) | `.chip--{style}` (+ `.chip--sm`) |
| `DishCard.figma.ts`      | 🍽️ DishCard      | 3 (Status)    | `.dish-card` + bound text props |
| `StatCard.figma.ts`      | 📊 StatCard      | 4 (Tone)      | `.stat-card--{tone}` |
| `SectionHeader.figma.ts` | 🧩 SectionHeader | 1             | `.section-header` |
| `TimeCard.figma.ts`      | ⏱️ TimeCard      | 1             | `.time-card` |
| `TermCard.figma.ts`      | 📚 TermCard      | 2 (Type)      | `.term-card` (+ `.pitfall`) |
| `IngredientRow.figma.ts` | 📋 IngredientRow | 1             | `.ingredients__row` |

## How to use

This repo doesn't ship a real React/Vue app — Code Connect is set up so future contributors
forking LK into a framework codebase can immediately see "this Figma component → this HTML pattern"
in Figma Dev Mode.

To publish these mappings to Figma:

```bash
npx @figma/code-connect publish
```

(Requires a Figma access token; not done by default in CI.)

## Adding a new mapping

1. Build the component in Figma (real `COMPONENT` or `COMPONENT_SET`)
2. Add CSS class for it in `docs/_theme/lazy-kitchen.css`
3. Render it in `scripts/build-html.ts` if it appears in any auto-generated page
4. Create `<ComponentName>.figma.ts` here, mirror the props
5. Get the Figma node id via `https://www.figma.com/design/.../?node-id=N-M` and put in `figma.connect` URL

## Known limitations of these mappings

- All examples emit raw HTML strings — no React/Vue/Svelte adapters yet.
- Several Figma components have hardcoded inner content that's NOT exposed as text props
  (Composition formula chips, IngredientTable rows beyond the row atom, SOPSteps). Their
  Code Connect snippets show the structure only.
- Variable code syntax in Figma Dev Mode resolves to `var(--xxx)` thanks to the v0.2 patch
  that bulk-set `setVariableCodeSyntax('WEB', ...)` on all 62 variables.
