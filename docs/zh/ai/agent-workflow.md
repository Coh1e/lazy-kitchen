# Agent 工作流 / Agent workflow

懒蛋厨房有两套 add-dish 工作流：你**本地 CLI** + **GitHub chef-bot**。

## 本地工作流（你自己 CLI）

```text
你 CLI 里 → /add-dish 番茄炒蛋
  → Claude Code (or Cline + DeepSeek) 跑 5+1 步交互流
  → 每步等你 yes/no
  → 写入 data/ + docs/
  → git commit + push
  → CF Pages 自动 deploy → bep.coh1e.com
```

详见 [skills/add-dish/workflow.md](../../../skills/add-dish/workflow.md)。

## chef-bot GitHub 工作流（社区，前后端解耦）

```text
路人 → 开 GitHub Issue (用 add-dish.yml template 填菜名/菜系)
maintainer → 检查请求合理 → 加 label `agent-go`
GitHub Action → 触发 .github/workflows/chef-agent.yml
chef-agent.ts (公开 repo) → 解析 issue → POST 到 chef-bot Worker
                            (URL 在 secrets CHEF_BOT_URL)
chef-bot Worker (chef-bot/ 子目录，wrangler 部署到 *.workers.dev) →
  按 cuisine.country 路由 persona:
    · CN/HK/TW/MO → 唐牛 (DeepSeek)
    · 其它一切 → Remy / 雷米 (Gemini)
  → 加载该 persona prompt (bundle 自 skills/chef-bot/personas/*.md)
  → 调 LLM 生成结构化 JSON (dish + glossary + 双语 markdown + assumptions)
  → 返回
chef-agent.ts → 写文件 + npm run validate → git commit + push 到 chef-bot/issue-N
              → gh pr create (label: agent-proposal, needs-maintainer-review)
PR → 社区评论纠正 assumptions
maintainer → review + merge 或 close
merge → CF Pages 自动 deploy → 新菜上线
```

## Personas 是公开 + 社区可治理的

`skills/chef-bot/personas/*.md` 是开源 prompt，社区可在 issue 提议新 persona
或弹劾现有的。详见 [persona-governance.md](./persona-governance.md)。

## 自部署 chef-bot endpoint (fork / self-host)

repo 含完整 Worker 源码 (`chef-bot/`)，只要你有 CF 账户：

```bash
cd chef-bot
npm install
wrangler login
wrangler secret put DEEPSEEK_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put AUTH_TOKEN          # 可选
wrangler deploy
```

部署完拿 URL → 主 repo Settings → Secrets：
- `CHEF_BOT_URL` = 你 Worker 的 URL
- `CHEF_BOT_TOKEN` = 你设的 AUTH_TOKEN

## 想加菜（用 maintainer 部署的官方 endpoint）？

打开 [新 Issue → 🍳 加一道菜](https://github.com/Coh1e/lazy-kitchen/issues/new?template=add-dish.yml)，
填好表单等 maintainer 触发。
