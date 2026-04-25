# Step 3: 草拟 (Draft)

详见 `skills/add-dish/workflow.md` Step 3a / 3b.

## 3a: use_existing 路径

直接草拟 `dishes.yaml` + 双语 markdown，引用现有 SKU/SOP/Ratio。

> 💡 **展示策略**：默认优先展示 zh 版本 markdown 让用户细看；en 版本说明"按 zh 1:1 镜像翻译"，问一句"要不要展示 en 草稿？"，用户不要看就直接镜像写入（仍受 lint:bilingual 强制 mirror 检查）。

## 3b: propose_new 路径

对每个待新增的 SKU/SOP/Ratio:

1. 草拟 yaml (满足对应 schema)
2. 收集所有出现的术语
3. 对每个术语跳到 Step 4 (glossary 审核)
4. 全部就绪后展示完整 yaml
5. 逐 yaml 文件请求确认: "落 `data/sku/wet.yaml`?"
6. 对应 docs markdown 同样逐文件确认

## 必填字段提醒

### SKU
- id (符合 `^(DRY|WET|COOKED|SOUP|READY)-[A-Z0-9-]+-v\d+$`)
- type, name {zh, en}, region, flavor_profile
- flavor_tags[], flavor_structure {salt, fat, acid, heat}
- ingredients[]
- packaging_sop, use_sop[]
- storage_profile
- status: proposed
- diet_tags[], spicy_level

### SOP
- id (符合 `^SOP-[A-Z0-9-]+$`)
- name {zh, en}, category
- heat_type, cooking_method, station, time_tier
- steps {zh, en}, tips {zh, en}
- status: proposed

### Ratio
- id (符合 `^RATIO-(MOTHER-)?[A-Z0-9-]+-v\d+$`)
- name {zh, en}, ratio.formula, ratio.components[]
- cuisine, use_with[]
- status: proposed

### Dish
- id (符合 `^DISH-[A-Z0-9-]+$`)
- name {zh, en}, cuisine
- uses {sku, sop, ratio}
- fresh_ingredients[], yield {servings}
- time {prep_min, hands_on_min, unattended_min, total_min}
- hardware_required (默认 [MVP]), hardware_extension[]
- flavor_structure, flavor_tags, diet_tags
- meal_pattern
- status: proposed

## 量度规范（workflow.md 硬规则 8）

体积/非标单位必须带 g/ml 换算，写在 unit 字段：

```yaml
fresh_ingredients:
  - name: { zh: 食用油, en: Cooking oil }
    amount: 2
    unit: { zh: '大勺 (≈30 ml)', en: 'Tbsp (~30 ml)' }
  - name: { zh: 番茄, en: Tomato }
    amount: 2
    unit: { zh: '个 (≈300 g)', en: 'medium (~300 g)' }
```

常用换算：1 大勺 ≈ 15 ml；1 茶匙 ≈ 5 g (盐) / 4 g (糖)；1 把葱花 ≈ 10 g；1 个中等番茄 ≈ 150 g；1 个大鸡蛋 ≈ 50 g。markdown 食材表也同步标注。

不要 yes 之前写文件！
