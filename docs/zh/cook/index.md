# 工艺 / SOPs

详见 [data/sop.yaml](../../../data/sop.yaml)（22 个 SOP，1 个全填: 广式清汤牛腩）。

## 分类速览

按 CIA 烹饪法分类:

### 湿热 (moist)
- BLANCH-MEAT, CLEAR-STEW, BRAISE, SOUP-NOODLE, COOKED-BASE

### 干热 (dry)
- STIR-FRY, PAN-SEAR

### 组合 (combination)
- BRAISE (含 hongshao), 部分 stew

### 工艺 (prep / package)
- CUT-* (julienne, dice, mince, rollblock)
- MARINATE-* (wet, dry-rub, velvet)
- VACUUM-DRY, VACUUM-LIQUID, REHEAT, LABELING
- CLEAN-WOK-HOT
- OPTIMIZE-* (parallel, overlap, sku-ahead, batch-prep)

## 端到端示例

[SOP-CANTON-CLEAR-BEEF-001](#/zh/cook/canton-clear-beef) — 完整 7 步 + 4 条 tips，双语。

## 分站 (Brigade station)

每个 SOP 带 `station` 字段（garde-manger / saucier / saute / grill / fry / pastry / none），便于规划多炉灶并行。

## 时长档位

每个 SOP 带 `time_tier` (5m / 15m / 30m / 1h / half-day / overnight)。

## 中国电商加速

CUT-* 系列默认 `optional_if_pre_prepped: true` —— 买切好的肉/菜可跳过这些 SOP。
