# Step 3: 草拟 (Draft)

详见 `skills/add-dish/workflow.md` Step 3a / 3b.

## 3a: use_existing 路径

直接草拟 `dishes.yaml` + 双语 markdown，引用现有 SKU/SOP/Ratio。

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

不要 yes 之前写文件！
