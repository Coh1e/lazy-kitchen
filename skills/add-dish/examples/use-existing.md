# Example: use_existing path

> 端到端示例: maintainer 调用 `/add-dish 清汤牛腩粉`

## Step 1 — Analyze

**Input**: `清汤牛腩粉`

**AI output**:
```text
分析:
  - 菜系: 粤 (CN)
  - 核心味型: 清汤、白胡椒香、萝卜清甜、牛腩本味
    flavor_tags: [clear, umami, light]
  - 主食材: 牛腩 (ING-BEEF-BRISKET), 白萝卜 (ING-DAIKON), 河粉 (ING-RICE-NOODLES)
  - 烹饪工艺: 焯水 → 长时间清炖 → 汤面组装
  - 出餐形态: bowl

✦ 在 dishes.yaml 找到 roadmap 占位 [DISH-CN-CANTON-CLEAR-BEEF-NOODLES] (status: planned)，
  将以它为起点扩展。
```

**Q**: "上面这个分析对吗？要修正哪里？"
**Maintainer**: "对。继续。"

---

## Step 2 — Match

**AI scans `data/sku/*.yaml` + `data/sop.yaml`**:

```text
SKU 候选:
  ★ DRY-CANTON-CLEAR-BEEF-v1 (粤式清汤牛腩香料包) — 完美匹配
  · DRY-CN-BRAISE-v1 — 不匹配 (清 vs 浓)

SOP 候选:
  ★ SOP-CANTON-CLEAR-BEEF-001 — 完美
  ★ SOP-BLANCH-MEAT-001 — 焯水
  ★ SOP-SOUP-NOODLE-001 — 汤面组装
  · 其他 — 不需要

RATIO 候选:
  · 不需要 RATIO（清汤本身不是公式化调味）

决策建议: use_existing, 信心 high
```

**Q**: "use_existing, high 信心。同意？"
**Maintainer**: "同意。"

---

## Step 3a — Direct compose (use_existing)

**AI 草拟 `dishes.yaml` 更新**:

```yaml
- id: DISH-CN-CANTON-CLEAR-BEEF-NOODLES
  name: { zh: 清汤牛腩粉, en: Cantonese clear-broth beef brisket rice noodles }
  cuisine: { region: 粤, country: CN }
  status: proposed                        # 从 planned 升级
  uses:
    sku: [DRY-CANTON-CLEAR-BEEF-v1]
    sop: [SOP-BLANCH-MEAT-001, SOP-CANTON-CLEAR-BEEF-001, SOP-SOUP-NOODLE-001]
    ratio: []
  fresh_ingredients:
    - { name: { zh: 牛腩, en: Beef brisket }, amount: 600, unit: g, ingredient_id: ING-BEEF-BRISKET }
    - { name: { zh: 白萝卜, en: Daikon radish }, amount: 600, unit: g, ingredient_id: ING-DAIKON }
    - { name: { zh: 河粉, en: Rice noodles }, amount: 200, unit: g, ingredient_id: ING-RICE-NOODLES }
    - { name: { zh: 青菜, en: Leafy greens }, amount: 100, unit: g, ingredient_id: ING-LEAFY-GREENS }
  yield: { servings: 3 }
  time: { prep_min: 15, hands_on_min: 25, unattended_min: 120, total_min: 160 }
  hardware_required: [MVP]
  hardware_extension: []
  flavor_structure: { salt: fish_sauce + light_soy, fat: 牛腩自带, acid: null, heat: long simmer }
  flavor_tags: [clear, umami, light]
  diet_tags: [no-pork, gluten-free, nut-free, dairy-free]
  meal_pattern: bowl
```

**Q**: "落 `data/dishes.yaml`?"
**Maintainer**: "yes"

**AI 草拟 `docs/zh/compose/canton-clear-beef-noodles.md`** (内容略，含状态徽章 + 双语标题 + 组合公式 + 各 SOP 链接 + Giscus 占位)

**Q**: "落 `docs/zh/compose/canton-clear-beef-noodles.md`?"
**Maintainer**: "yes"

**Q**: "落 `docs/en/compose/canton-clear-beef-noodles.md`?"
**Maintainer**: "yes"

---

## Step 5 — Validate

```bash
$ bun run scripts/validate-data.ts
✅ data/dishes.yaml
$ bun run scripts/lint-bilingual.ts
✅ bilingual integrity
$ bun run scripts/build-glossary.ts
✅ All terms resolve
```

---

## Step 6 — Cross-CLI review

由于路径是 use_existing + high 信心，**跳过**跨 CLI 审稿。

---

## 最终输出

```
✅ 已写入文件:
  - data/dishes.yaml (DISH-CN-CANTON-CLEAR-BEEF-NOODLES: planned → proposed)
  - docs/zh/compose/canton-clear-beef-noodles.md
  - docs/en/compose/canton-clear-beef-noodles.md

📋 status: proposed (将出现在告示栏)

📝 建议 commit message:
   add(dish): 清汤牛腩粉 (use existing CANTON-CLEAR-BEEF SKU + 3 SOPs)
```
