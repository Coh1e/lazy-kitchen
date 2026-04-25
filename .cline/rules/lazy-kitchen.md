# 懒蛋厨房 / Lazy Kitchen — Cline rules

> 这是给 Cline (VS Code 内的 agentic AI) 用的规则。

## 这是什么仓库

懒蛋厨房 — 模块化世界菜厨房知识库，详见根目录 [README.md](../../README.md)。

## 给中文 maintainer 的特别说明

Cline + DeepSeek 是写新菜（add-dish skill）的**首选组合**：
- DeepSeek 中文菜系细节理解最准
- Cline 支持本地 file watching + 多文件编辑

当 maintainer 说"加一道菜"或类似:

**严格按 `skills/add-dish/workflow.md` 执行**。完整 5 + 1 步流程 + 7 条硬规则。

## 关键文件

```
skills/add-dish/workflow.md        ← 真源流程
skills/add-dish/examples/*.md      ← 端到端示例
skills/add-dish/review-prompt.md   ← 跨 CLI 审稿提示词
data/*.yaml                        ← 数据真源
schemas/*.json                     ← 校验契约
```

## 跨 CLI 二审 (Step 6)

写完草案后，会自动调 codex / gemini 审稿。如果你的 maintainer 主要用 Cline，他可能没装 codex/gemini —— 那就走 Tier 2 半自动模式（输出指令，让 maintainer 手动跨 CLI）。

## 不要

- 不要 `git` 任何操作
- 不要调外部 API
- 不要擅自写文件 (Edit/Write 前必须给 maintainer 看草稿)
- 不要把新条目 status 设成 approved
