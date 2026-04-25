# Pantry layers (L0–L4)

```text
L0  Hardware              data/hardware.yaml + hardware-extensions.yaml
L1  Base ingredients      data/ingredients.yaml          (high-frequency)
L2  Fresh aromatics       data/fresh-aromatics.yaml      (buy as needed)
L3  Base condiments       data/condiments.yaml           (large bottles)
L4  Dry pantry            data/dry-pantry.yaml           (whole + ground spices + dried umami)
─────────────────────────────────────────
L5  Pre-packed SKUs       data/sku/{dry,wet,cooked,soup,ready}.yaml
L6  SOPs                  data/sop.yaml
L7  Dishes (composition)  data/dishes.yaml
```

L0–L4: **buy these**. L5–L7: **construct these via add-dish skill over time**.

Each L1–L4 item carries `procurement_mode` (`bulk_pantry` / `seasonal_buy` / `on_demand_online`).
Many L1 items also carry `cn_market_pre_prepped[]` listing pre-cut forms commonly available on Chinese fresh e-commerce.
