# Cook — SOPs

See [data/sop.yaml](../../../data/sop.yaml) — 22 SOPs, 1 fully filled (Cantonese clear beef).

## Categorization (CIA cooking-method taxonomy)

### Moist heat
BLANCH-MEAT, CLEAR-STEW, BRAISE, SOUP-NOODLE, COOKED-BASE

### Dry heat
STIR-FRY, PAN-SEAR

### Combination
BRAISE (incl. hongshao), some stews

### Prep / package
- CUT-* (julienne, dice, mince, rollblock)
- MARINATE-* (wet, dry-rub, velvet)
- VACUUM-DRY, VACUUM-LIQUID, REHEAT, LABELING
- CLEAN-WOK-HOT
- OPTIMIZE-* (parallel, overlap, sku-ahead, batch-prep)

## End-to-end example

[SOP-CANTON-CLEAR-BEEF-001](#/en/cook/canton-clear-beef) — 7 steps + 4 tips, bilingual.

## Brigade station

Each SOP carries a `station` field (garde-manger / saucier / saute / grill / fry / pastry / none) for parallel cooking planning.

## Time tier

Each SOP carries `time_tier` (5m / 15m / 30m / 1h / half-day / overnight).

## Chinese e-commerce shortcut

CUT-* SOPs default to `optional_if_pre_prepped: true` — buying pre-cut meat/veg lets you skip them.
