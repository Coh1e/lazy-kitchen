# add-dish skill workflow (single source of truth)

> 这份文件是 add-dish skill 的**真源**。所有 CLI 适配（Claude Code / Codex / Gemini / Cline / Continue / Aider）都指向这里。
> Claude Code 在 `.claude/skills/add-dish/SKILL.md` 引用这份文件 + 各步详述 (01-05)。

## 你的角色 / Your role

你（AI agent）正在帮 maintainer 给 **懒蛋厨房 / Lazy Kitchen** 加一道菜。
maintainer 是项目的 curator，他在 CLI 里发起 `/add-dish <菜名>`，期望你**5 步交互式**完成新菜建模 + 数据落盘。

## 两种运行模式

- **Human 模式**：你 maintainer 在本地 CLI 跑 `/add-dish 菜名`，5+1 步逐步交互
- **机器模式（chef-bot）**：跑在 GitHub Actions 里，处理社区 Issue 提交的请求；
  详见 [`skills/chef-bot/README.md`](../chef-bot/README.md)。机器模式由
  maintainer 自部署的 chef-bot endpoint 实现，仍受下面 8 条硬规则约束 ——
  唯一差异是**第 1 条改为**："不能等用户 yes，但所有假设必须显式列在响应的
  `assumptions[]` 段，让社区在 PR review 时能逐条纠正。"

## 8 条硬规则（违反任意一条立即停手报告）

1. **不许擅自写文件**。每次写入前，把完整 yaml/markdown 草稿展示给用户，得到明确"yes"才落盘。
2. **新条目 status = `proposed`**（不是 draft）。直接进站点告示栏接受社区评议；用户若要本地保留可手动改回 `draft`。
3. **glossary 是术语护栏**。任何调料/香料/食材/技法在 yaml 出现前，必须在 `data/glossary.yaml` 查到；查不到走 Step 4 术语审核子流程。
4. **双语强制**。每条 yaml 名（SKU/SOP/Ratio/Dish/glossary entry）必须 `name.zh` + `name.en` 双填，缺一即失败。
5. **校验闭环**。写完后必须执行 `npm run validate` + `npm run lint:bilingual` + `npm run build:glossary`；失败则回滚（删本次写入的所有文件）。
6. **不许 git 操作**。skill 不 add、不 commit、不 push。最后一步只输出建议的 commit message，由 maintainer 手动执行。
7. **不许调外部 API**。skill 在 maintainer 的 CLI agent 里运行，模型已由他选择；你不能 fetch/curl/调任何 LLM。
8. **量度必带克/毫升换算**。所有体积或非标量度（大勺/茶匙/把/碗/杯/个）必须在 unit 字段标注克或毫升的近似值，例如 `'大勺 (≈15 ml)'`、`'茶匙 (≈5 g)'`、`'把 (≈10 g)'`、`'个 (≈150 g)'`。markdown 食材表也同步标注。防止后续厨师按勺数估算时累计误差超过 30%。

## 5 + 1 步流程

### Step 1: 分析菜品 (Analyze)

**输入**: 菜名（zh 或 en，可能中英混合）

**操作**:
1. 读这些文件作为上下文：
   - `data/glossary.yaml`
   - `data/flavor-vocabulary.yaml`
   - `data/dishes.yaml`（看是否已存在 planned 占位）
   - `data/pairings.yaml`
2. 输出分析:
   - 菜系（country + region）
   - 核心味型（来自 flavor-vocabulary）
   - 主食材
   - 烹饪工艺
   - 出餐形态（bowl / plate / soup / wrap / ...）
3. 如果在 `dishes.yaml` 找到 `status: planned` 的同名条目，明确说："✦ 找到 roadmap 占位 [DISH-XX-YYY]，将以它为起点扩展。"

**问用户**: "上面这个分析对吗？要修正哪里？"

---

### Step 2: 匹配现有 SKU / SOP / Ratio (Match)

**操作**:
1. 扫 `data/sku/*.yaml` + `data/sop.yaml` + `data/ratios.yaml`
2. 计算多轴重叠（flavor_tags / cuisine.region / cooking_method）排出 top 3 候选
3. 计算信心度:
   - **high**: 关键 SKU + 主 SOP 完全匹配现有
   - **medium**: 部分匹配，仅缺少 1 个 RATIO 或细节 SOP
   - **low**: 主结构需要新建
4. 决策:
   - high → use_existing
   - medium → adapt_existing
   - low → propose_new
5. 输出候选清单 + 决策建议 + 信心度

**问用户**: "决策建议: {use_existing/adapt_existing/propose_new}, 信心 {high/medium/low}。同意？要改？"

---

### Step 3a: use_existing 路径 (Direct compose)

仅在 Step 2 决策为 use_existing 时走。

**操作**:
1. 草拟 `data/dishes.yaml` 新条目（或更新现有 planned 占位），引用匹配到的 SKU/SOP/Ratio
2. 草拟 `docs/zh/compose/<slug>.md` + `docs/en/compose/<slug>.md`
3. 必填字段:
   - `id`, `name {zh, en}`, `cuisine {region, country}`, `status: proposed`
   - `uses {sku, sop, ratio}`, `fresh_ingredients[]`
   - `yield {servings}`, `time {prep_min, hands_on_min, unattended_min, total_min}`
   - `hardware_required: ['MVP']` (默认)
   - `hardware_extension: []` (若菜需要烤箱等再列)
   - `flavor_structure {salt, fat, acid, heat}`
   - `flavor_tags[]` (从 flavor-vocabulary.yaml 选)
   - `diet_tags[]`
4. 逐文件展示草稿，逐文件请求确认
5. 全部 yes → 写入 → 跳到 Step 5

---

### Step 3b: propose_new 路径 (Create new SKU/SOP/Ratio)

**操作**: 对每个待新增的 SKU / SOP / Ratio：

(a) 草拟 yaml，必填字段同 schema
(b) 收集所有出现的术语（食材 + 香料 + 技法）
(c) 对每个术语，检查 `data/glossary.yaml`：
   - 在表 → 通过
   - 不在表 → 触发 Step 4 子流程
(d) 全部术语就绪后，再次完整展示 yaml
(e) 问用户: "落 `data/sku/wet.yaml`?" / "落 `data/sop.yaml`?" / "落 `data/ratios.yaml`?"
(f) 对应 docs markdown 同样逐文件确认

最后做 Step 3a 的 dish 组装步骤，引用刚新建的 entries。

---

### Step 4: glossary 审核子流程 (Glossary review)

**触发**: Step 3b 中遇到术语不在 glossary

**操作**: 对每个新术语:
1. 查找权威译法 (你的内部知识)
2. 输出建议: "新词 'gochugaru'。建议英译 'Korean coarse chili flakes'，alias 还有 '韩式粗辣椒粉'。"
3. 列出可能的"绝不可用的错译"，例如: "do_not_translate_as: ['Korean chili powder']"
4. 问用户: "OK 加入？要改 zh/en/alias/category 哪一项？"
5. 用户 yes → 暂存到 glossary 候选列表（**还不写文件**）
6. 全部术语处理完 → 一次性 append 到 `data/glossary.yaml`

---

### Step 5: 校验 + 报告 (Validate + report)

**操作**:
1. 写入所有用户已确认的文件
2. 运行 `bun run scripts/validate-data.ts`
3. 运行 `bun run scripts/lint-bilingual.ts`
4. 运行 `bun run scripts/build-glossary.ts`
5. 全过 → 输出报告:
   ```
   ✅ 已写入文件:
     - data/sku/wet.yaml (新增 WET-PH-ADOBO-v1)
     - data/ratios.yaml (新增 RATIO-PH-ADOBO-v1)
     - data/dishes.yaml (新增 DISH-PH-ADOBO-CHICKEN)
     - data/glossary.yaml (新增 3 词条)
     - docs/zh/compose/ph-adobo-chicken.md
     - docs/en/compose/ph-adobo-chicken.md

   📋 status: proposed (将出现在告示栏)

   📝 建议 commit message:
      add(dish): 菲律宾阿多波鸡 + WET SKU + RATIO + glossary
   ```
6. 校验失败 → 回滚（删除本次写入的文件）+ 报告失败原因，让 maintainer 决定是否重试

---

### Step 6: 跨 CLI 自审 (Cross-CLI review) — 按情况触发

**触发矩阵**:

| 路径 | 信心度 | 触发跨 CLI 审 |
|---|---|---|
| use_existing | high | ⏸ 跳过（直写 proposed） |
| use_existing | medium | ❓ 询问用户（默认建议跑） |
| use_existing | low | ✓ 必须跑 |
| propose_new (任何新条目) | - | ✓ 必须跑 |
| propose_new (含新 glossary 术语) | - | ✓ 必须跑 |

**执行机制（按可用性降级）**:

**Tier 1: 自动调用** (检测 codex / gemini / aider 在 PATH 中)
```bash
which codex && codex --headless --prompt "$(cat skills/add-dish/review-prompt.md)\n\n要审的内容:\n$(cat ai/staging/draft.json)"
# 或
which gemini && gemini --prompt "..."
```
优先 codex (结构化输出最稳)，其次 gemini，再次 aider。捕获另一 CLI stdout，解析 JSON 判决。

**Tier 2: 半自动提示** (检测不到任何辅助 CLI)
向 maintainer 输出:
```
请开另一个终端，进本仓库，跑下面任一命令:

  $ codex --prompt "$(cat skills/add-dish/review-prompt.md)" -- ./ai/staging/draft.json
  $ gemini --prompt "..." -- ...
  $ aider --message "审稿..." ./ai/staging/draft.json

把审稿结果（JSON）粘回这里。
```

**Tier 3: 纯人工** (maintainer 命令 `add-dish skip-review`)
跳过；条目 status 仍为 proposed，但 `cross_reviewed: false`、`cross_reviewer_cli: skipped`。
review-dish 时仍会被特别标记。

**审稿输出 (3 个出口)**:
- `verdict: approved` → 写入 + status proposed + cross_reviewed: true → Step 5
- `verdict: revise` → 显示 suggestions → 回 Step 3 重新草拟
- `verdict: reject` → 显示原因 → 丢弃此次提案，session 结束

## Output checklist before saying "done"

- [ ] 所有写入文件已 maintainer 显式确认
- [ ] yaml 校验通过 (validate-data.ts)
- [ ] 双语完备 (lint-bilingual.ts)
- [ ] glossary 对账通过 (build-glossary.ts)
- [ ] 跨 CLI 审稿（按触发矩阵）已完成或 maintainer 明确跳过
- [ ] 输出建议 commit message
- [ ] 不曾 `git add` / `git commit` / `git push`
