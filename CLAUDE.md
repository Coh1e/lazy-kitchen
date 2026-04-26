# 懒蛋厨房 / Lazy Kitchen — Claude Code project guide

> 这是 Claude Code 在本仓库自动加载的项目指南。等价于 `AGENTS.md` 的核心要点 +
> Claude Code 特定细节。所有 agentic CLI 通用约定见 [AGENTS.md](./AGENTS.md)。

## 一句话项目定位

**结构化、AI 化、硬件极简（10 件套）、时间最优**的厨房操作系统知识库。
内容是产品 (YAML 在 `data/` 是真源)，前端是查看皮肤 (Vite + React + D3)，
AI 在用户的 CLI 或 chef-bot Worker 里跑。

公网：https://bep.coh1e.com (CF Workers Static Assets)
Repo：https://github.com/Coh1e/lazy-kitchen

## 仓库结构

```
.
├── src/                           前端 React (Vite + TS + D3 + react-router 7)
│   ├── components/                 StatusBadge / DishCard / DepGraph / GlobalGraph etc.
│   ├── pages/                      Cover / Compose / Board / Glossary / Doc / Search / Graph
│   ├── data.ts                     YAML 数据加载 (build-time @rollup/plugin-yaml)
│   ├── graph.ts                    依赖图数据层 (per-dish tree + global flat graph)
│   └── styles/global.css           整套设计 token + 组件样式
├── index.html, vite.config.ts      前端入口
├── wrangler.jsonc                  前端 Workers Static Assets 部署配置 (PR #1 加)
│
├── chef-bot/                       后端 Worker (HTTP endpoint, wrangler 单独 deploy)
│   ├── src/                         Worker 代码 (HTTP handler + persona router + LLM 调用)
│   ├── wrangler.jsonc               chef-bot 部署配置
│   └── package.json                 子项目 deps (ai SDK + zod 等)
│
├── data/                           ★ YAML 真源 (16 文件)
│   ├── dishes.yaml                  61 道菜
│   ├── glossary.yaml                57 术语
│   ├── sop.yaml / ratios.yaml / pairings.yaml / etc.
│   └── sku/*.yaml                   5 类 SKU
├── schemas/*.json                  10 个 JSON Schema 契约
│
├── docs/                           bilingual markdown (zh + en)
│   ├── start/ buy/ pack/ cook/ ratios/ board/ ai/
│   ├── compose/                     单菜详情页 (清汤牛腩粉 + 番茄炒蛋 ...)
│   └── _theme/lazy-kitchen.css      老 CSS 真源（已 ported 到 src/styles/global.css）
│
├── skills/                         AI skill 真源（model-neutral）
│   ├── add-dish/                    /add-dish 5+1 步交互流 + 8 条硬规则
│   └── chef-bot/                    chef-bot Worker 用的 prompt + persona
│       ├── personas/tangniu.md      中餐大厨唐牛 (DeepSeek)
│       ├── personas/remy.md         西餐+一切其它 Remy/雷米 (Gemini)
│       ├── personas/_template.md    社区提案新 persona 用模板
│       └── system-prompt.md         机器模式硬规则
│
├── public/avatars/                 chef persona 头像 (256x256 PNG)
├── scripts/                        build/validate/lint 工具脚本
│   ├── validate-data.ts             ajv 校验 yaml
│   ├── lint-bilingual.ts            双语完备性
│   ├── build-glossary.ts            glossary 对账报告
│   └── chef-agent.ts                ★ GitHub Action 入口：解析 issue → POST chef-bot Worker → 写文件 → 提 PR
│
├── tests/                          unit (vitest+RTL) + e2e + visual (playwright)
├── .github/
│   ├── workflows/                   test.yml + chef-agent.yml
│   ├── ISSUE_TEMPLATE/              add-dish / propose-persona / impeach-persona
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .private/                       maintainer 私有笔记（gitignored）
└── .claude/skills/add-dish/        Claude Code 的 skill 适配（指向 skills/add-dish/）
```

## 常用命令

```bash
npm run dev               # vite dev :5173
npm run build             # vite build → dist/
npm run preview           # vite preview :4173 (e2e/visual 用)

npm run validate          # ajv yaml 校验
npm run lint:bilingual    # zh+en 镜像检查
npm run build:glossary    # 术语对账报告

npm run test              # unit + e2e + visual
npm run test:unit         # vitest (RTL)
npm run test:e2e          # playwright e2e
npm run test:visual       # playwright visual
npm run test:visual:update  # 重生 visual baselines
```

## Skills（你最常用）

### `/add-dish 菜名`

**真源**：`skills/add-dish/workflow.md` (5+1 步交互流 + 8 条硬规则)
**Claude Code 入口**：`.claude/skills/add-dish/SKILL.md`

5+1 步：分析 → 匹配 → 草拟 → glossary 审核 → 校验 + 报告 → 跨 CLI 二审（按矩阵触发）

8 条硬规则核心（违反立即停手）：
1. 不许擅自写文件，每步等 maintainer yes
2. 新条目 `status: proposed`
3. glossary 是术语护栏
4. 双语强制
5. 校验闭环 (`npm run validate && lint:bilingual && build:glossary`)
6. 不许 git 操作
7. 不许调外部 API
8. 量度必带 g/ml 换算

## 开发约定

- **TypeScript strict mode**, ES2022 target, `moduleResolution: bundler`
- **CSS Modules 不用** — 用全局 BEM-ish class names (`.dish-card__title` 等)，跟现有 design system 一致
- **Markdown 渲染** 用 `react-markdown` + `remarkGfm` + `rehypeRaw`
- **YAML 加载** 用 `@rollup/plugin-yaml` build-time 内联 (零 runtime fetch)
- **路由** HashRouter (`#/zh/cover` 等) — 保 Giscus mapping 兼容
- **测试** vitest (jsdom + RTL) + playwright (e2e + visual + webServer auto-start vite preview)
- **CI** `.github/workflows/test.yml` 在 ubuntu-latest 跑 validate + lint + build + test

## 不要

- 不要 `git add` / `git commit` / `git push`（除非 maintainer 显式要求）
- 不要在 src/ 引入 server-side deps (Node-only 模块会让 Vite build 挂)
- 不要改 schemas/* 不通知 maintainer (会破坏现有数据)
- 不要新条目 `status: approved`（必经审稿）
- 不要写"少许"、"适量"等模糊量 — 必须 g/ml/数字
- 不要在 chef-bot/ 子项目里 import 主项目的 src/* (前后端解耦)

## 当 maintainer 让你做大事时

- 优先 read 本文件 → AGENTS.md → 相关 skills/*.md → 具体 data/yaml
- 复杂任务先用 plan mode 写下来，落定再执行
- maintainer 不在身边的批量自动化（GitHub Action）按 chef-bot 模式（机器模式）执行，假设要写到 PR body 的 assumptions[]
