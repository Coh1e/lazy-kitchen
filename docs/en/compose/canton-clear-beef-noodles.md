# Cantonese clear-broth beef brisket rice noodles / 清汤牛腩粉

<span class="status status-approved">approved</span> <span class="cuisine">Cantonese · CN</span>

> ✦ End-to-end example. Demonstrates the minimal closed loop of "DRY pack + multi-SOP composition."

## Composition formula

```
Fresh ingredients
  + DRY-CANTON-CLEAR-BEEF-v1
  + SOP-BLANCH-MEAT-001
  + SOP-CANTON-CLEAR-BEEF-001
  + SOP-SOUP-NOODLE-001
  = a meal
```

## Ingredients (3 servings)

| Item | Amount | Note |
|---|---|---|
| Beef brisket | 600 g | Buy pre-cut from CN e-commerce |
| Daikon radish | 600 g | Large cubes |
| Rice noodles | 200 g | |
| Leafy greens | 100 g | Blanch only |
| Chopped scallion | 1 handful | At plating |

## Time

| Phase | Minutes |
|---|---|
| Prep | 15 |
| **Hands-on** | **25** |
| Unattended | 120 |
| Total | 160 |

## Flavor structure (Salt Fat Acid Heat)

- **Salt**: fish sauce + light soy (added at end)
- **Fat**: from beef brisket (no added oil)
- **Acid**: null (clear broth doesn't take acid)
- **Heat**: long simmer (90–150 min on bare simmer)

## Hardware

✅ MVP 10-piece kit sufficient (soup pot + chef knife + spice sachets + vacuum bags)

## Steps (from SOP-CANTON-CLEAR-BEEF-001)

1. Blanch beef in cold water 3–5 min
2. Rinse with warm water, cut into 5cm cubes
3. To pot: 1.5–2L water + beef + 3 ginger slices + spice pack
4. Boil hard, then bare simmer 90–150 min with lid ajar
5. Add daikon for the last 25–40 min
6. Season: salt + fish sauce + 5g rock sugar
7. Top with scallion; serve over noodles or rice

## Key tips

- Cold-water start traps less scum
- Bare simmer = clear broth; rolling boil = cloudy
- Late daikon avoids bitterness
- Fish sauce is umami booster, not flavor imposer

## Reuse

- DRY pack: only used here
- SOP-SOUP-NOODLE-001: also used in Japanese ramen, Vietnamese pho, Sichuan beef noodle soup
- SOP-CLEAR-STEW-001: also used in Japanese miso soup, Vietnamese pho broth

---

> ★ End-to-end example for the `add-dish` skill. All fields maintainer-reviewed + cross-CLI audited.
> See something off? Comment via Giscus below or [open a GitHub Issue](https://github.com/owner/lazy-kitchen/issues).
