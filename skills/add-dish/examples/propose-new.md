# Example: propose_new path (with cross-CLI review)

> 端到端示例: maintainer 调用 `/add-dish 菲律宾阿多波鸡`

## Step 1 — Analyze

**Input**: `菲律宾阿多波鸡`

**AI output**:
```text
分析:
  - 菜系: 菲 (PH)
  - 核心味型: 酸 + 咸 + 蒜香 + 月桂叶香
    flavor_tags: [umami, sour, salty]
  - 主食材: 鸡腿肉 (ING-CHICKEN-THIGH), 蒜, 月桂叶
  - 烹饪工艺: 湿腌 → 长时间慢炖 (酸性炖煮)
  - 出餐形态: bowl (配米饭)

✦ 在 dishes.yaml 找到占位 [DISH-PH-ADOBO-CHICKEN] (status: planned)
```

**Q**: "上面这个分析对吗？"
**Maintainer**: "对。"

---

## Step 2 — Match

```text
SKU 候选:
  · DRY-CN-BRAISE-v1 (中式红烧) — 工艺类似但调料结构差异大；不匹配
  · WET-JP-TERIYAKI-v1 — 完全不匹配
  → 没有现成 SKU 能 cover

SOP 候选:
  ★ SOP-MARINATE-WET-001 — 复用 (湿腌)
  ★ SOP-BRAISE-001 — 复用 (慢炖)

RATIO 候选:
  ★ RATIO-PH-ADOBO-v1 — 已存在！ (1:1:1 醋:酱油:水)

决策建议: propose_new (新 WET SKU), 信心 medium
   理由: SOP 与 RATIO 都已就位，但缺少专属的 WET 包来封装腌料
```

**Q**: "propose_new 同意？"
**Maintainer**: "同意。"

---

## Step 3b — Propose new SKU

**AI 草拟 `WET-PH-ADOBO-v1`**:

```yaml
- id: WET-PH-ADOBO-v1
  type: WET
  name: { zh: 菲律宾阿多波腌料, en: Filipino Adobo marinade }
  region: { zh: 菲, en: Philippines }
  flavor_profile:
    zh: 醋酸主导、酱油咸鲜、整粒黑胡椒、蒜末月桂
    en: Vinegar-forward acid, soy salinity, whole peppercorn, garlic + bay leaf
  flavor_tags: [sour, salty, umami]
  flavor_structure:
    salt: soy_sauce
    fat: chicken_fat (rendered during braise)
    acid: cane_vinegar
    heat: low simmer 1h
  diet_tags: [no-pork, gluten-free, nut-free, dairy-free]
  spicy_level: 1
  ingredients:
    - { item: { zh: 蔗糖醋, en: Cane vinegar }, amount: 120, unit: ml }
    - { item: { zh: 酱油, en: Soy sauce }, amount: 120, unit: ml }
    - { item: { zh: 水, en: Water }, amount: 120, unit: ml }
    - { item: { zh: 蒜, en: Garlic }, amount: 8, unit: { zh: 瓣, en: cloves } }
    - { item: { zh: 月桂叶, en: Bay leaf }, amount: 3, unit: { zh: 片, en: leaves } }
    - { item: { zh: 黑胡椒粒, en: Black peppercorn }, amount: 1, unit: tsp }
  yield: { amount: 1, unit: pack, packs: 1, notes: 配 800g 鸡腿 }
  packaging_sop: SOP-VACUUM-LIQUID-001
  use_with:
    - { zh: 鸡腿肉 800g, en: 800g chicken thigh }
  use_sop:
    - SOP-MARINATE-WET-001
    - SOP-BRAISE-001
  storage_profile: freezer-vacuum
  status: proposed
```

### 检查术语 (Step 4 子流程)

```text
扫描所有出现的术语...
  ✓ 蔗糖醋 / Cane vinegar — 不在 glossary
    建议加入: { zh: 蔗糖醋, en: Cane vinegar, alias_en: [sugar cane vinegar], category: vinegar }
  ✓ 月桂叶 / Bay leaf — 已在 glossary (zh: 香叶)
  ✓ 黑胡椒粒 / Black peppercorn — 已在 glossary
  ...
```

**Q (新词)**: "新词 '蔗糖醋 / Cane vinegar'。建议 alias 'sugar cane vinegar'。OK?"
**Maintainer**: "OK。"

**Q (yaml)**: "落 `data/sku/wet.yaml`?"
**Maintainer**: "yes"

---

## Step 4 — Compose Dish (using new SKU)

**AI 草拟 dishes.yaml 更新**:

```yaml
- id: DISH-PH-ADOBO-CHICKEN
  name: { zh: 菲律宾阿多波鸡, en: Filipino chicken adobo }
  cuisine: { region: 菲, country: PH }
  status: proposed                  # planned → proposed
  uses:
    sku: [WET-PH-ADOBO-v1]
    sop: [SOP-MARINATE-WET-001, SOP-BRAISE-001]
    ratio: [RATIO-PH-ADOBO-v1]
  fresh_ingredients:
    - { name: { zh: 鸡腿肉, en: Chicken thigh }, amount: 800, unit: g, ingredient_id: ING-CHICKEN-THIGH }
  yield: { servings: 4 }
  time: { prep_min: 10, hands_on_min: 15, unattended_min: 60, total_min: 85 }
  hardware_required: [MVP]
  hardware_extension: []
  flavor_structure: { salt: soy_sauce, fat: chicken_fat, acid: cane_vinegar, heat: low simmer }
  flavor_tags: [sour, salty, umami]
  diet_tags: [no-pork, gluten-free, nut-free, dairy-free]
  meal_pattern: plate-with-rice
```

**Q**: "落 `data/dishes.yaml` 更新？"
**Maintainer**: "yes"

(continued: docs markdown for SKU/Dish, both zh + en, each confirmed)

---

## Step 5 — Validate

```bash
$ bun run scripts/validate-data.ts
✅ all yaml pass
$ bun run scripts/lint-bilingual.ts
✅ bilingual integrity
$ bun run scripts/build-glossary.ts
✅ All terms resolve (1 new term added)
```

---

## Step 6 — Cross-CLI review (REQUIRED, propose_new path)

```text
正在检测可用的辅助 CLI...
  ✓ codex 在 PATH
  
正在让 codex 审稿:
  $ codex --headless --prompt "$(cat skills/add-dish/review-prompt.md)" \\
      -- ai/staging/ph-adobo-draft.json
```

**Codex 返回**:
```json
{
  "verdict": "approved",
  "checks": [
    { "id": 1, "pass": true, "note": "all required fields present" },
    { "id": 2, "pass": true, "note": "bilingual complete" },
    { "id": 3, "pass": true, "note": "glossary aligned (1 new term properly added)" },
    { "id": 4, "pass": true, "note": "all SKU/SOP/Ratio refs resolve" },
    { "id": 5, "pass": true, "note": "MVP hardware sufficient" },
    { "id": 6, "pass": true, "note": "time math checks: 10+15+60=85" },
    { "id": 7, "pass": true, "note": "garlic+vinegar pairing classical for PH" },
    { "id": 8, "pass": true, "note": "flavor_structure all 4 axes filled" },
    { "id": 9, "pass": true, "note": "matches Wikipedia + The Adobo Road cookbook (2013)" },
    { "id": 10, "pass": true, "note": "hands_on_min 15 ≤ 30" }
  ],
  "suggestions": [],
  "cite": [
    { "url": "https://en.wikipedia.org/wiki/Philippine_adobo", "claim": "Cane vinegar is traditional; rice vinegar is a substitute" }
  ]
}
```

→ verdict approved → 标记 cross_reviewed: true, cross_reviewer_cli: codex

---

## 最终输出

```
✅ 已写入文件:
  - data/sku/wet.yaml (新增 WET-PH-ADOBO-v1)
  - data/dishes.yaml (DISH-PH-ADOBO-CHICKEN: planned → proposed)
  - data/glossary.yaml (新增 1 词条: 蔗糖醋)
  - docs/zh/pack/wet/ph-adobo.md
  - docs/en/pack/wet/ph-adobo.md
  - docs/zh/compose/ph-adobo-chicken.md
  - docs/en/compose/ph-adobo-chicken.md

📋 status: proposed (将出现在告示栏)
🔍 cross_reviewed: codex/gpt-4o approved with cite

📝 建议 commit message:
   add(dish): 菲律宾阿多波鸡 + WET SKU + glossary
   
   - WET-PH-ADOBO-v1 (cane vinegar + soy + garlic + bay leaf)
   - 用现有 RATIO-PH-ADOBO-v1 + SOP-MARINATE-WET + SOP-BRAISE
   - cross-reviewed by codex/gpt-4o
```
