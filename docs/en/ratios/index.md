# Ratios

See [data/ratios.yaml](../../../data/ratios.yaml).

## 5 classical mother sauces + Chinese extension

LK treats Escoffier's 5 mother sauces + Chinese hongshao base as RATIO first-class entities, building an **inheritable flavor family tree**:

```text
RATIO-MOTHER-BECHAMEL-v1     (milk + roux)
RATIO-MOTHER-VELOUTE-v1      (white stock + roux)
RATIO-MOTHER-ESPAGNOLE-v1    (brown stock + browned roux)
RATIO-MOTHER-HOLLANDAISE-v1  (egg yolk + butter + lemon)
RATIO-MOTHER-TOMATO-v1       (tomato base)
RATIO-MOTHER-CN-BRAISE-v1    ★ Chinese hongshao
```

Each mother lists `daughters[]`: béchamel + cheese → mornay; CN-BRAISE + 4 more → yuxiang, etc.

## v1 derivatives

- RATIO-CN-FISHSCENT-v1 (Yuxiang 1:1:1:1) — derived from CN-BRAISE
- RATIO-PH-ADOBO-v1 (Filipino adobo 1:1:1)
- RATIO-WEST-VINAIGRETTE-v1 (oil:vinegar 3:1)

## Growth

New RATIOs grow via add-dish skill's propose_new path. Predicted ~13 formulas at full menu.
