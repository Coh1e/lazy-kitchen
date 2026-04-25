# 调味公式 / Ratios

详见 [data/ratios.yaml](../../../data/ratios.yaml)。

## 5 大经典母酱 + 中式扩展

LK 把 Escoffier 的 5 母酱 + 中式红烧基础作为 RATIO 一级实体的"祖先"，建立**可继承的调味家族树**:

```text
RATIO-MOTHER-BECHAMEL-v1     白酱基底（牛奶 + 面糊）
RATIO-MOTHER-VELOUTE-v1      天鹅绒酱（白色高汤 + 面糊）
RATIO-MOTHER-ESPAGNOLE-v1    布朗酱（棕色高汤 + 焦化面糊）
RATIO-MOTHER-HOLLANDAISE-v1  荷兰酱（蛋黄 + 黄油 + 柠檬）
RATIO-MOTHER-TOMATO-v1       番茄基底
RATIO-MOTHER-CN-BRAISE-v1    ★ 中式红烧基础
```

每个母酱在 yaml 里的 `daughters[]` 字段列出派生：贝夏梅尔加奶酪 → mornay；中式红烧加四料 → 鱼香等等。

## v1 派生

- RATIO-CN-FISHSCENT-v1（鱼香 1:1:1:1）— 红烧基础派生
- RATIO-PH-ADOBO-v1（菲式阿多波 1:1:1）
- RATIO-WEST-VINAIGRETTE-v1（油醋 3:1）

## 增长

新 RATIO 通过 add-dish skill 的 propose_new 路径渐增。预计完整菜单后约 13 个公式。
