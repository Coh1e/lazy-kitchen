# Pack — SKU shelf

Five SKU types:

| Type | Meaning | Storage |
|---|---|---|
| **DRY** | Dry spice pack (sachet + vacuum) | Pantry dry dark, 1–3 years |
| **WET** | Wet sauce/marinade pack (vacuum-frozen) | -18°C, 6–12 months |
| **COOKED** | Cooked base (frozen blocks) | -18°C, 3–6 months |
| **SOUP** | Concentrated soup base | -18°C, 6–12 months |
| **READY** | Ready-to-heat (meal prep) | -18°C, 1–2 months |

## v1 data

- [data/sku/dry.yaml](../../../data/sku/dry.yaml) — 6 entries (1 fully filled: Cantonese clear beef)
- [data/sku/wet.yaml](../../../data/sku/wet.yaml) — 2 placeholders
- [data/sku/cooked.yaml](../../../data/sku/cooked.yaml) — 1 placeholder
- [data/sku/soup.yaml](../../../data/sku/soup.yaml) — empty (first will arrive via shoyu ramen, pho)
- [data/sku/ready.yaml](../../../data/sku/ready.yaml) — empty (v2 meal-prep subset)

## End-to-end example

[DRY-CANTON-CLEAR-BEEF-v1 detail](#/en/pack/dry/canton-clear-beef) — full fields, template for new SKUs.

## Growth

New SKUs are NOT pre-created in v1. Maintainer triggers them via `add-dish` skill's propose_new path. Predicted ~44 SKUs once the full menu is mature.
