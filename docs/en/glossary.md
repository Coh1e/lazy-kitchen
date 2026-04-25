# Bilingual glossary

> Source of truth: [data/glossary.yaml](../../../data/glossary.yaml).
> AI translation guardrail: any spice / ingredient / technique must resolve here BEFORE appearing in yaml.

## Why this page exists

Chinese-English translation has many traps:

- **大料** ≠ "big spice" → **Star anise**
- **花椒** ≠ "black pepper" → **Sichuan peppercorn**
- **生抽** ≠ generic "soy sauce" → **Light soy sauce** (distinct from dark)
- **南姜** ≠ "ginger" → **Galangal**

LK fixes each correspondence; AI must look up glossary before translating, never improvise.

## Selected categories

### Soy sauces
- 生抽 → Light soy sauce
- 老抽 → Dark soy sauce
- 蚝油 → Oyster sauce
- 鱼露 → Fish sauce

### Vinegars
- 米醋 → Rice vinegar (≠ white vinegar)
- 黑醋 → Chinese black vinegar / Chinkiang vinegar

### Whole spices
- 八角 / 大料 → Star anise (≠ big spice)
- 花椒 → Sichuan peppercorn (≠ black pepper)
- 桂皮 → Cassia bark (≠ true cinnamon)
- 陈皮 → Dried tangerine peel

### Fresh aromatics
- 香茅 → Lemongrass
- 南姜 → Galangal (≠ ginger)
- 柠檬叶 → Makrut lime leaves (avoid "kaffir")

### Proteins / vegetables
- 牛腩 → Beef brisket / beef flank
- 白萝卜 → Daikon radish
- 五花肉 → Pork belly

### Techniques
- 焯水 → Blanch
- 红烧 → Hongshao braise / red-braise
- 上浆 → Velveting

## Contributing terms

When add-dish encounters a missing term, Step 4 sub-flow asks you to confirm zh/en/alias/category before appending.
You can also PR `data/glossary.yaml` directly.
