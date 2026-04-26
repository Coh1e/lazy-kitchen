# chef-bot — non-interactive add-dish via remote Worker

`chef-bot` 是 `add-dish` skill 的**机器变体**，跑在 GitHub Actions 里，
处理社区在 Issues 提的"加菜请求"。

## 架构（前后端 wrangler 解耦）

```
GitHub Issue + agent-go label
     ↓
.github/workflows/chef-agent.yml (公开)
     ↓
scripts/chef-agent.ts (公开 — 解析 issue + 转发请求 + 写文件 + 开 PR)
     ↓ HTTP POST { dish_zh, dish_en, country, region, notes }
chef-bot/ Worker (公开源码 — wrangler 部署到 *.workers.dev 或自定子域)
     ├─ src/routing.ts — country → persona key (CN/HK/TW/MO → 唐牛, else → Remy)
     ├─ src/personas-bundle.ts — import personas/*.md ?raw 进 bundle
     ├─ src/llm.ts — DeepSeek (唐牛) 或 Gemini (Remy) via Vercel AI SDK
     └─ src/index.ts — Workers handler
     ↓ 返回结构化 JSON (dish, glossary_additions, markdown_zh, markdown_en, ...)
scripts/chef-agent.ts
     ↓
data/dishes.yaml + data/glossary.yaml + docs/{zh,en}/compose/<slug>.md
     ↓ git commit + push
chef-bot/issue-N-<slug> 分支
     ↓ gh pr create
PR with labels: agent-proposal, needs-maintainer-review
     ↓ maintainer 审 + merge
CF Pages auto-deploy → bep.coh1e.com
```

## 当前 personas (公开 + 社区可治理)

| Persona | 菜系覆盖 | LLM | 文件 |
|---|---|---|---|
| **唐牛** | 中餐 (CN/HK/TW/MO) | DeepSeek | [personas/tangniu.md](./personas/tangniu.md) |
| **Remy / 雷米** | 一切其它 (FR/IT/US/JP/KR/IN/SEA/ME/拉美/非洲...) | Gemini | [personas/remy.md](./personas/remy.md) |

Remy 处理非西方菜系时会在 assumptions 第一条声明"我是西餐背景，对 X 菜系
仅有书本/旅行级了解"，建议社区核对。

## 治理：提议 / 弹劾 personas

**任何人可以**：

- **提议新 persona**：开 issue 用 `🍳 提议新 chef persona` 模板，附 prompt 草稿
- **弹劾现有 persona**：开 issue 用 `🚫 弹劾 chef persona` 模板，列具体不准确证据

**maintainer 终裁**（公开理由），merge 后 chef-bot Worker 自动 redeploy。

详见 [docs/zh/ai/persona-governance.md](../../docs/zh/ai/persona-governance.md)。

## 持续 8 条硬规则（继承 add-dish/workflow.md）

机器模式仍受 `skills/add-dish/workflow.md` 的 8 条硬规则约束 —— 唯一差异是
**第 1 条改为机器模式**："不能等用户 yes，但所有假设必须显式列在响应的
`assumptions[]` 段，让社区/maintainer 在 review 时能逐条纠正。"

## 自部署 chef-bot Worker (fork / self-host)

repo 含完整 Worker 源码 (`chef-bot/`)，只要你有 CF 账户：

```bash
cd chef-bot
npm install
wrangler login
wrangler secret put DEEPSEEK_API_KEY    # platform.deepseek.com
wrangler secret put GEMINI_API_KEY      # aistudio.google.com
wrangler secret put AUTH_TOKEN          # 自定 random 字符串 (可选)
wrangler deploy
# 拿到 URL: https://lazy-kitchen-chef-bot.<your-account>.workers.dev
```

然后回主 repo Settings → Secrets：

| Secret | Value |
|---|---|
| `CHEF_BOT_URL` | 你 Worker 部署的完整 URL |
| `CHEF_BOT_TOKEN` | 你设的 AUTH_TOKEN（可选） |

## 法律说明

角色名"唐牛"、"Remy / 雷米"为通用文化符号致敬；头像为原创设计，不复刻任何
特定影视作品中的人物造型或演员肖像。如有侵权疑虑请提 issue。

## 端到端流程

详见 [docs/{zh,en}/ai/agent-workflow.md](../../docs/zh/ai/agent-workflow.md)。
