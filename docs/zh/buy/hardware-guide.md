# 硬件采购指南 / Hardware buying guide

详见 [data/hardware.yaml](../../../data/hardware.yaml)（每件硬件的完整 buying_guide 字段）。

## 10 件套 MVP

| ID | 名称 | 价位 (CNY) | 重点 |
|---|---|---|---|
| HW-CHEF-KNIFE | 主厨刀 | 150–800 | 20cm 锻造刀身 |
| HW-CLEAVER | 中式菜刀 | 100–500 | 文武刀（中等厚度）400–500g |
| HW-WOK-OR-SKILLET | 炒锅 | 150–400 (碳钢) | 直径 30–34cm |
| HW-SOUP-POT | 汤锅 | 200–600 (钢) | 5L 起步 |
| HW-MEASURING-SPOONS | 量勺 | 30–80 | 不锈钢 4–6 件套 |
| HW-KITCHEN-SCALE | 厨房秤 | 60–200 | 0.1g 精度 |
| HW-VACUUM-SEALER | 真空封袋器 | 200–600 | 必须支持湿物模式 |
| HW-VACUUM-BAGS | 真空袋 | 一卷 30–80 | 90+μ BPA-free |
| HW-SPICE-SACHETS | 茶包袋 | 100 个 10–25 | 食品级 PP，抽绳 |
| HW-FREEZER-LABELS | 冷冻标签 | 一卷 15–30 | 防水冷冻级 |

## 详细字段

每件硬件 yaml 包含：
- `buying_guide.key_considerations` — 选购要点
- `buying_guide.spec_hint` — 规格建议
- `buying_guide.food_safety` — 食安风险
- `buying_guide.common_pitfalls` — 常见坑
- `buying_guide.price_band_cny` — 价位区间

直接读 yaml 比看本页更详细。

## 非 MVP 设备

详见 [hardware-extensions.yaml](../../../data/hardware-extensions.yaml)：烤箱、电饭煲、高压锅、蒸笼、空气炸锅、手持搅拌棒、探针温度计。

每件标 `why`（什么菜要它）+ `workaround`（不买怎么替代）。
