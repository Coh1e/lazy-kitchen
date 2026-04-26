# 懒蛋厨房 / Lazy Kitchen

> **让人类拥有世界舌头！**
> **Make Kitchen Great Again!**

一个**结构化、AI 化、硬件极简、时间最优**的厨房操作系统。

A structured, AI-curated, minimal-hardware, time-optimal kitchen operating system.

---

## 三句话讲清这是什么 / TL;DR

1. **不是菜谱网站**，是把世界菜拆成可复用 SKU + SOP + Ratio 的模块化知识库。
2. **AI 不在仓库里跑**，在你本机的 CLI 里跑（Claude Code / Cline+DeepSeek / Codex / Gemini / Aider）。仓库只放结构化数据 + 调用指令。
3. **浏览器开** https://bep.coh1e.com 即可看完整手册；想贡献新菜？开 GitHub Issue 让 chef-bot 帮，或在自己 CLI 里跑 `add-dish` skill。

---

## 三种用法 / Three Ways to Use

### A. 我只想看手册 / Just read the manual

**两种查看方式：**

**A1. 在线（推荐）**

```text
https://bep.coh1e.com
```

直接浏览器打开，无需安装。手机/平板/电脑都能看。

**A2. 本地开发预览**（贡献者用；看自己改的内容立即生效）

```bash
git clone https://github.com/Coh1e/lazy-kitchen
cd lazy-kitchen
npm install
npm run dev
# 打开 http://127.0.0.1:5173，编辑 docs/ 下 markdown，HMR 立即更新
```

### B. 我想加一道新菜 / Add a new dish

在你的 AI CLI（推荐 **Cline + DeepSeek** 跑中文菜场景最丝滑）里进入仓库目录，调用 `add-dish` skill：

```text
> /add-dish 菲律宾阿多波鸡
```

skill 会用 5+1 步交互流（分析 → 匹配现有 SKU/SOP → 草拟 → 术语审核 → 校验 → 跨 CLI 二审）跟你确认每一步，最后写入 `data/` + `docs/`。所有新条目状态恒为 `proposed`。

### C. 我想审稿 / Review someone's draft

切到一个**不同的模型**（Codex+GPT-4 / Gemini CLI）跑 `review-dish`，做跨家族二意见审稿：

```text
> /review-dish DISH-PH-ADOBO-CHICKEN
```

10 项审计清单，三个出口：`approved` / `review` / `revise`。

详见 [选你的 AI / Choose Your AI](docs/zh/ai/choose-your-ai.md)。

---

## 核心数据模型 / Core Data Model

```text
Ingredient + SKU + SOP + Ratio  =  Dish  =  Meal
```

- **Ingredient**: 食材（含采购模式、中国电商预切形态）
- **SKU**: 5 种预制包（DRY 干货 / WET 湿酱 / COOKED 熟底 / SOUP 汤底 / READY 即食）
- **SOP**: 标准流程（CIA 烹饪法分类 + Brigade 分站 + 时长档位）
- **Ratio**: 调味公式（含 5 大母酱 + 中式红烧基础 + 派生）
- **Dish**: 组合视图（SKU + SOP + 食材 + 时间双轨）

---

## 4 阶段使用循环 / 4-Phase Workflow

```text
[周期开始]
 ① 计划：浏览菜库挑想吃的（按 hands_on_min 升序，最懒优先）
 ② 采购：硬件/耗材 + 阶段性大批量调料 + 按需小量食材
 ③ 制备：按 SKU 公式混合 → 真空分装冷冻
[每天]
 ④ 执行：网购预切肉菜 → 取预制 → 按 SOP 组装 → 上桌
```

详见 [使用循环 / Workflow](docs/zh/start/workflow.md)。

---

## 硬件最小化 / Minimal Hardware

**仅需 10 件套**：

- 主厨刀 + 中式菜刀
- 炒锅 + 汤锅
- 量勺 + 厨房秤
- 真空封袋器 + 真空袋 + 茶包袋 + 冷冻标签

不需要烤箱、电饭煲、空气炸锅、料理机。需要的菜会在文档里显式标注 `hardware_extension`。

---

## 部署 / Deployment

公网站点托管在 Cloudflare Workers Static Assets：

```text
Build command:    npm run build
Build output:     dist
Custom domain:    bep.coh1e.com (在 CF 控制台绑)
```

`wrangler.jsonc` 在仓库根；详见 chef-bot 子项目 `chef-bot/README.md` 看后端 Worker 部署。

---

## 贡献 / Contributing — 社区共建模型

LK 是 **maintainer 主导 + 社区共建** 的项目。所有社交互动都用 GitHub 原生能力，没有自建后端。

### 三层参与方式（按门槛递增）

| 角色 | 怎么做 | 用什么 |
|---|---|---|
| 路过的读者 | 看完直接走 | 浏览器打开 https://bep.coh1e.com |
| 想点赞或吐槽 | 在菜页底部 Giscus 投 👍/👎，留评论 | GitHub 账号（一次注册） |
| 想加一道菜（最简）| 开 Issue 用 `add-dish` 模板，maintainer 加 `agent-go` 触发 chef-bot 自动出 PR | GitHub Issues |
| 想报错 | 提 GitHub Issue（菜系不准 / 术语错 / 时间不实） | GitHub Issues |
| 想改代码 | 提 GitHub PR（直接改 yaml） | GitHub PR |
| 想成为 maintainer | clone + 跑 `/add-dish` skill 试试，提 PR 加新菜 | CLI + GitHub PR |

### chef-bot — 让 AI 帮你加菜

- 开 [新 Issue → 🍳 加一道菜](https://github.com/Coh1e/lazy-kitchen/issues/new?template=add-dish.yml)
- maintainer 在 issue 加 `agent-go` label
- GitHub Action 把请求转发到 chef-bot Worker
- Worker 按菜系路由 persona：
  - 中餐 (CN/HK/TW/MO) → **唐牛** (DeepSeek)
  - 一切其它 → **Remy / 雷米** (Gemini)
- chef 一次性出 PR 草案 + 列出 assumptions
- 社区评议 → maintainer 审 → merge → 站点自动 deploy

**Personas 公开 + 社区可治理**：[新提议](https://github.com/Coh1e/lazy-kitchen/issues/new?template=propose-persona.yml)
或 [弹劾](https://github.com/Coh1e/lazy-kitchen/issues/new?template=impeach-persona.yml) 都接受。
详见 [persona-governance.md](docs/zh/ai/persona-governance.md)。

Fork 想自启用 chef-bot？整个 Worker 源码在 `chef-bot/` 子目录，
`cd chef-bot && wrangler deploy` 即可。详见
[skills/chef-bot/README.md](skills/chef-bot/README.md)。

### Maintainer 工作流（自动公开发布）

1. clone 本仓库
2. 在你的 AI CLI 里调 `/add-dish <菜名>` —— 5 步交互式确认
3. skill 写出 `status: proposed` 的草案
4. （可选）第 6 步自审：跨 CLI 让 Codex/Gemini 二意见
5. `git commit` + `git push`
6. CF Pages 自动部署 → 站点 [告示栏](docs/zh/board/proposed.md) 自动列出
7. 监听 GitHub Discussions 反馈
8. 改 yaml + push 迭代
9. 共识后改 `status: approved`

详见 [skill workflow](skills/add-dish/workflow.md) 和 [告示栏使用说明](docs/zh/board/contributing.md)。

---

## License

MIT
