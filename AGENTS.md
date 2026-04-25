# 懒蛋厨房 / Lazy Kitchen — Agent contributor guide

> 这是给 Codex CLI / Cursor / Aider 等读 `AGENTS.md` 约定的工具用的入口。

## 这是什么仓库

懒蛋厨房 (Lazy Kitchen) — 一个**结构化、AI 化、硬件极简（10 件套）、时间最优**的厨房知识库。

- 内容是产品：YAML 在 `data/` 是单一真源
- 网站是查看皮肤：`lazy-kitchen.html` 由 `bun run scripts/build-html.ts` 生成
- AI 在你（agent）这边跑：仓库里只有指令 + 数据，不调外部 API
- 社区共建：所有新菜先 `status: proposed` 进站点告示栏，社区用 GitHub Discussions 投票评论

## 当 maintainer 让你"加一道菜"时

**严格按 `skills/add-dish/workflow.md` 执行**。完整 5 + 1 步流程 + 7 条硬规则（绝对禁止擅自写文件、git 操作、调外部 API）。

```
1. Read skills/add-dish/workflow.md          (端到端流程)
2. Read skills/add-dish/examples/use-existing.md  (示例 1)
3. Read skills/add-dish/examples/propose-new.md   (示例 2)
4. 按 5 + 1 步执行，每步等 maintainer 确认
```

## 当 maintainer 让你"审一道菜"时

你大概率是被 add-dish skill 在 Step 6 跨 CLI 调用的二审者。

**严格按 `skills/add-dish/review-prompt.md` 输出 JSON**。10 项审计清单，三个 verdict (approved / revise / reject)。

## 关键数据文件 (你需要 Read)

```
data/glossary.yaml           ← 术语护栏，不许擅自翻译
data/sku/*.yaml              ← 现有 SKU
data/sop.yaml                ← 现有 SOP
data/ratios.yaml             ← 现有调味公式（5 母酱 + 派生）
data/pairings.yaml           ← 食材配对建议
data/hardware.yaml           ← MVP 硬件清单（10 件套，锁死）
data/hardware-extensions.yaml ← 非 MVP 设备 + workaround
data/dishes.yaml             ← 现有菜（含 60 个 planned roadmap）
schemas/*.json               ← JSON Schema 契约
```

## 校验

写完后跑：

```bash
bun run scripts/validate-data.ts      # JSON Schema 校验
bun run scripts/lint-bilingual.ts     # 双语完备性
bun run scripts/build-glossary.ts     # 术语对账
bun run scripts/build-html.ts         # 重生成 lazy-kitchen.html
```

## 不要

- 不要 `git add` / `git commit` / `git push`（maintainer 手动）
- 不要调外部 API
- 不要静默修改文件
- 不要新条目 status 设成 approved（必须经过社区 + 跨 CLI 审）
