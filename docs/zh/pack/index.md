# 预制 / Pack — SKU 货架

5 种 SKU 类型:

| 类型 | 含义 | 储藏 |
|---|---|---|
| **DRY** | 干货香料包（茶包袋 + 真空） | 常温避光防潮 1–3 年 |
| **WET** | 湿酱包（液体真空冷冻） | -18°C 6–12 个月 |
| **COOKED** | 熟底（制熟后冷冻） | -18°C 3–6 个月 |
| **SOUP** | 汤底（浓缩汤底） | -18°C 6–12 个月 |
| **READY** | 即食热食（备餐场景） | -18°C 1–2 个月 |

## v1 数据

- [data/sku/dry.yaml](../../../data/sku/dry.yaml) — 6 个 (1 个全填: 清汤牛腩)
- [data/sku/wet.yaml](../../../data/sku/wet.yaml) — 2 个占位
- [data/sku/cooked.yaml](../../../data/sku/cooked.yaml) — 1 个占位
- [data/sku/soup.yaml](../../../data/sku/soup.yaml) — 空（首批将由酱油拉面、越南河粉引入）
- [data/sku/ready.yaml](../../../data/sku/ready.yaml) — 空（v2 备餐子集）

## 端到端示例

[DRY-CANTON-CLEAR-BEEF-v1 详细页](#/zh/pack/dry/canton-clear-beef) — 完整字段，可作为新 SKU 的模板。

## 增长

新 SKU 不在 v1 仓库里预创建，由 maintainer 通过 `add-dish` skill 触发 `propose_new` 路径渐增。预测全菜单完成后约 44 个 SKU。
