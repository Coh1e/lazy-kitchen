# Heat & oil temperature

Two independent dimensions used by every SOP.

## Heat tiers

See [data/heat-tiers.yaml](../../../data/heat-tiers.yaml).

| ID | Name | Visual |
|---|---|---|
| high | High | Pan smokes, oil sizzles |
| medium-high | Medium-high | Oil ripples, meat sizzles loudly |
| medium | Medium | Oil still and warm |
| medium-low | Medium-low | Almost no heat radiating |
| low | Low | Tiny bubbles in broth |
| simmer | Bare simmer | Surface nearly still |

## Oil temperature tiers (Chinese "cheng" scale)

See [data/oil-temp-tiers.yaml](../../../data/oil-temp-tiers.yaml).

| Tier | °C | Visual |
|---|---|---|
| 1–2 cheng | 30–60 | Still, no bubbles |
| 3–4 cheng | 90–120 | Small bubbles around chopstick |
| 5–6 cheng | 150–180 | Dense bubbles, faint smoke |
| 7–8 cheng | 200–220 | Surface waves, distinct smoke |
| 9 cheng | 230+ | Heavy smoke (use only for seconds) |

Each SOP references heat tiers via `heat_level_used` to avoid the ambiguity of "medium heat."
