---
name: add-dish
description: 交互式给懒蛋厨房添加新菜。读 data/ 现有 SKU/SOP/Ratio/Glossary，与 maintainer 协商决定 use_existing 还是 propose_new，逐文件确认后写入 data/ + docs/。所有新条目状态恒为 proposed（自动进站点告示栏）。propose_new 路径必须经过跨 CLI (Codex/Gemini/Aider) 二审。
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# add-dish skill (Claude Code entry)

**真源**：`skills/add-dish/workflow.md`（在仓库根目录）。本文件是 Claude Code 适配，指向真源 + 强调几条 critical rules。

## 加载顺序

1. 读 `skills/add-dish/workflow.md`（端到端 5 + 1 步流程 + 7 硬规则）
2. 读 `skills/add-dish/examples/use-existing.md`（端到端示例 1）
3. 读 `skills/add-dish/examples/propose-new.md`（端到端示例 2）
4. 读 `skills/add-dish/review-prompt.md`（Step 6 跨 CLI 审稿用提示词）

## Critical rules (重要重申)

1. **不要擅自 Write/Edit 任何文件**。每次写入前展示完整 yaml/md 草稿，等 maintainer 明确说 yes。
2. **新条目 status = `proposed`**（不是 draft）。
3. **不许 git 操作**。skill 输出建议 commit message，由 maintainer 手动执行。
4. **跨 CLI 审稿（Step 6）按矩阵触发**：propose_new 必跑；low 信心 use_existing 必跑；high 信心 use_existing 跳过。
5. **校验闭环**：所有写入后必须跑 `npm run validate && npm run lint:bilingual && npm run build:glossary`。

## 入口

当用户说 `/add-dish <菜名>` 或类似意图，按 workflow.md 5+1 步流程执行。
