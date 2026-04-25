# Step 5: 校验 + 报告 (Validate + report)

详见 `skills/add-dish/workflow.md` Step 5.

## 操作

### 写入

按 Step 3a/3b/4 中已确认的所有内容写入文件。

### 校验

```bash
bun run scripts/validate-data.ts
bun run scripts/lint-bilingual.ts
bun run scripts/build-glossary.ts
```

### 全过的输出格式

```text
✅ 已写入文件:
  - data/sku/wet.yaml (新增 WET-XX-YYY-v1)
  - data/ratios.yaml (新增 RATIO-XX-YYY-v1)
  - data/dishes.yaml (新增 DISH-XX-YYY)
  - data/glossary.yaml (新增 N 词条)
  - docs/zh/pack/wet/<slug>.md
  - docs/en/pack/wet/<slug>.md
  - docs/zh/compose/<slug>.md
  - docs/en/compose/<slug>.md

📋 status: proposed (将出现在告示栏)

📝 建议 commit message:
   add(dish): <菜名> + <type> SKU + <if any> RATIO
   
   - <要点 1>
   - <要点 2>
```

### 失败回滚

任意校验失败：
1. 用 Edit 工具删除本次写入的所有 yaml entries（恢复到写入前状态）
2. 删除新创建的 markdown 文件
3. 报告失败的检查项与具体错误
4. 询问 maintainer 是否重试或放弃

## 不要

- 不要 `git add`
- 不要 `git commit`
- 不要 `git push`
- 不要假装"看起来没问题"跳过校验
