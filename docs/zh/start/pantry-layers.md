# 储藏分层 / Pantry layers (L0–L4)

```text
L0  Hardware              data/hardware.yaml + hardware-extensions.yaml
L1  Base ingredients      data/ingredients.yaml         (常温/冷藏，high-frequency)
L2  Fresh aromatics       data/fresh-aromatics.yaml     (按需买，short shelf life)
L3  Base condiments       data/condiments.yaml          (大瓶常备)
L4  Dry pantry            data/dry-pantry.yaml          (整香料 + 粉香料 + 干鲜)
─────────────────────────────────────────
L5  Pre-packed SKUs       data/sku/{dry,wet,cooked,soup,ready}.yaml
L6  SOPs                  data/sop.yaml
L7  Dishes (composition)  data/dishes.yaml
```

L0–L4 是 **采购对象**：你直接买这些。
L5–L7 是 **AI 协助构造对象**：通过 add-dish skill 渐增。

## 每层的采购模式

每个 L1–L4 条目带 `procurement_mode`:

| Mode | 含义 | 例子 |
|---|---|---|
| `bulk_pantry` | 常备大量 | 盐、生抽、米、蒜、葱 |
| `seasonal_buy` | 阶段性大批量 | masala、整香料、特色酱 |
| `on_demand_online` | 按需小量网购 | 柠檬汁、香茅、南姜 |

## 中国电商优势

L1 食材里很多有 `cn_market_pre_prepped[]` 字段：列出当地生鲜电商已经处理好的形态（排骨切块、鸡腿剔骨、白萝卜切丝）。

→ 这就是 LK 敢锁 10 件套硬件的底气：**切菜外包给电商**，硬件只承担"煮 + 炒 + 量"的核心。
