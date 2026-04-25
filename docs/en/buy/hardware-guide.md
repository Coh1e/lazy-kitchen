# Hardware buying guide

Source of truth: [data/hardware.yaml](../../../data/hardware.yaml) (full `buying_guide` field per item).

## 10-piece MVP

| ID | Item | Price (CNY) | Key spec |
|---|---|---|---|
| HW-CHEF-KNIFE | Chef's knife | 150–800 | 20cm forged blade |
| HW-CLEAVER | Chinese cleaver | 100–500 | All-purpose, 400–500g |
| HW-WOK-OR-SKILLET | Wok/skillet | 150–400 (carbon) | 30–34cm diameter |
| HW-SOUP-POT | Soup pot | 200–600 (steel) | 5L+ |
| HW-MEASURING-SPOONS | Measuring spoons | 30–80 | Stainless 4–6 piece |
| HW-KITCHEN-SCALE | Kitchen scale | 60–200 | 0.1g precision |
| HW-VACUUM-SEALER | Vacuum sealer | 200–600 | Wet-mode required |
| HW-VACUUM-BAGS | Vacuum bags | roll 30–80 | 90+μ BPA-free |
| HW-SPICE-SACHETS | Spice sachets | 100pk 10–25 | Food-grade PP, drawstring |
| HW-FREEZER-LABELS | Freezer labels | roll 15–30 | Waterproof freezer-grade |

## Detailed fields

Each yaml entry includes:
- `buying_guide.key_considerations`
- `buying_guide.spec_hint`
- `buying_guide.food_safety`
- `buying_guide.common_pitfalls`
- `buying_guide.price_band_cny`

Reading the yaml directly is more comprehensive than this page.

## Non-MVP equipment

See [hardware-extensions.yaml](../../../data/hardware-extensions.yaml): oven, rice cooker, pressure cooker, steamer, air fryer, immersion blender, instant-read thermometer.

Each lists `why` (which dishes need it) + `workaround` (how to substitute with MVP gear).
