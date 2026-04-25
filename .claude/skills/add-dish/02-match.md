# Step 2: 匹配现有 SKU / SOP / Ratio (Match)

详见 `skills/add-dish/workflow.md` Step 2.

## 操作

1. Glob + Read `data/sku/*.yaml`、`data/sop.yaml`、`data/ratios.yaml`
2. 对每个候选，按 flavor_tags / cuisine.region / cooking_method 计算 overlap score
3. 排出 top 3 SKU 候选 + top 3 SOP 候选 + 是否需要 Ratio
4. 计算信心度:
   - high: 关键 SKU + 主 SOP 完全匹配
   - medium: 部分匹配，缺 1 个 RATIO 或细节 SOP
   - low: 主结构需要新建

## 决策矩阵

| 信心 | 决策 |
|---|---|
| high (主 SKU + SOP 完美) | use_existing |
| medium (有匹配但需调整) | adapt_existing |
| low (需新建) | propose_new |

## 输出格式

```text
SKU 候选:
  ★ <ID> (<name>) — <reason>
  · <ID> — <not match reason>

SOP 候选:
  ★ <ID> — <reason>

RATIO 候选:
  ★/· <ID> — <reason>

决策建议: <use_existing/adapt_existing/propose_new>, 信心 <high/medium/low>
```

## 提问

`"决策建议: <X>, 信心 <Y>。同意？要改？还是直接走 propose_new？"`
