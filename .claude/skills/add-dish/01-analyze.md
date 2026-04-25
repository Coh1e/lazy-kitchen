# Step 1: 分析菜品 (Analyze the dish)

详见 `skills/add-dish/workflow.md` Step 1.

## 必读上下文（Read 工具读这些文件）

- `data/glossary.yaml`
- `data/flavor-vocabulary.yaml`
- `data/dishes.yaml`（找 planned 占位）
- `data/pairings.yaml`

## 输出格式

```text
分析:
  - 菜系: <country> + <region>
  - 核心味型: <flavor_tags from flavor-vocabulary>
  - 主食材: <ID + name>
  - 烹饪工艺: <high-level steps>
  - 出餐形态: <bowl/plate/soup/wrap/...>

[若找到 planned 占位，明确说明]
```

## 提问

`"上面这个分析对吗？要修正哪里？"`

不要继续 Step 2 直到 maintainer 确认。
