# 懒蛋厨房 / Lazy Kitchen — Agent contributor guide

> 这是给 Codex CLI / Cursor / Aider / Cline 等读 `AGENTS.md` 约定的 AI 工具用的入口。
> Claude Code 见 `CLAUDE.md`；Gemini CLI 见 `GEMINI.md`（都指向本文件）。

## 这是什么仓库

懒蛋厨房 (Lazy Kitchen) — **结构化、AI 化、硬件极简（10 件套）、时间最优**的厨房知识库。

- **内容是产品**：YAML 在 `data/` 是单一真源
- **网站是查看皮肤**：Vite + React 19 + React Router 7 + D3 + TypeScript，CF Workers Static Assets 部署到 https://bep.coh1e.com
- **AI 在你（agent）这边跑**：仓库里只有 prompt 模板 + 数据；不在仓库自己调外部 API（chef-bot Worker 例外，它是独立后端）
- **社区共建**：所有新菜先 `status: proposed` 进站点告示栏；社区用 GitHub Discussions / Giscus 评论

## 两种 AI 工作流

### 1. Human 模式：maintainer 本地 CLI 跑

`maintainer` 在他的 CLI（Claude Code / Cline + DeepSeek / Codex / Gemini / Aider）里调
`/add-dish 菜名`，**严格按 `skills/add-dish/workflow.md` 5+1 步执行**。

```
1. Read skills/add-dish/workflow.md         (端到端流程 + 8 条硬规则)
2. Read skills/add-dish/examples/use-existing.md  (示例 1)
3. Read skills/add-dish/examples/propose-new.md   (示例 2)
4. 按 5+1 步执行，每步等 maintainer 确认
```

### 2. 机器模式 (chef-bot)：跑在 GitHub Action 里

社区开 Issue → maintainer 加 `agent-go` label → workflow 调 chef-bot Worker → 出 PR 草案。
不是交互式的；按 cuisine 路由到 persona (唐牛 / Remy)。

详见 [skills/chef-bot/README.md](skills/chef-bot/README.md)。

## 当 maintainer 让你"审一道菜"时（review-dish）

你大概率被 add-dish skill 在 Step 6 跨 CLI 调用做二审。

**严格按 `skills/add-dish/review-prompt.md` 输出 JSON**。10 项审计清单，三个 verdict (approved / revise / reject)。

## 关键数据文件 (你需要 Read)

```
data/glossary.yaml             ← 术语护栏，不许擅自翻译
data/sku/*.yaml                ← 5 类 SKU (DRY/WET/COOKED/SOUP/READY)
data/sop.yaml                  ← 现有 SOP
data/ratios.yaml               ← 调味公式（5 母酱 + 中式 hongshao + 派生）
data/pairings.yaml             ← 食材配对
data/hardware.yaml             ← MVP 10 件套 (锁死)
data/hardware-extensions.yaml  ← 非 MVP 设备 + workaround
data/dishes.yaml               ← 现有菜（含 60 个 planned roadmap）
data/flavor-vocabulary.yaml    ← flavor_tags 受控词表
schemas/*.json                 ← JSON Schema 契约
```

## 校验 + 构建命令

```bash
npm run validate          # JSON Schema 校验所有 yaml
npm run lint:bilingual    # 双语完备性
npm run build:glossary    # 术语对账
npm run build             # vite build → dist/ (CF deploy 用)
npm run dev               # vite dev (本地 :5173 预览)
npm run test              # unit + e2e + visual
npm run test:unit         # vitest (RTL + parsing 测试)
npm run test:e2e          # playwright e2e
npm run test:visual       # playwright visual regression
```

## 公网与部署

- 站点：https://bep.coh1e.com (CF Workers Static Assets)
- Repo：https://github.com/Coh1e/lazy-kitchen
- chef-bot Worker：`chef-bot/` 子目录，wrangler 单独 deploy

## 不要

- 不要 `git add` / `git commit` / `git push`（maintainer 手动；机器模式由 GitHub Action 做）
- 不要在 skill 里直接 fetch / curl 外部 API（chef-bot Worker 例外）
- 不要静默修改文件（每次写入前展示草稿等用户确认；机器模式假设要列在 assumptions[]）
- 不要新条目 status 设成 approved（必须经过社区 + 跨 CLI 审）
- 不要忘记量度的 g/ml 换算（硬规则 8）
