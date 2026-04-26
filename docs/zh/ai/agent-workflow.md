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

## chef-bot GitHub 工作流（社区）

```text
路人 → 开 GitHub Issue (用 add-dish.yml template 填菜名/菜系)
maintainer → 检查请求合理 → 加 label `agent-go`
GitHub Action → 触发 .github/workflows/chef-agent.yml
chef-agent.ts → 解析 issue → POST 到 CHEF_BOT_URL endpoint
                (该 endpoint 由 maintainer 自部署，可以是 CF Worker / Lambda /
                 Vercel Functions / 其它任意 HTTP 服务)
endpoint → 一次性返回结构化 JSON (dish + glossary + 双语 markdown + assumptions)
script → 写文件 + npm run validate → git commit + push 到 chef-bot/issue-N
script → gh pr create (label: agent-proposal, needs-maintainer-review)
PR → 社区评论纠正 assumptions
maintainer → review + merge 或 close
merge → CF Pages 自动 deploy → 新菜上线
```

## 部署 chef-bot endpoint（fork / self-host 必读）

repo 不包含 chef-bot endpoint 实现 —— 那是 maintainer 自己的服务（包含
prompts / persona / 模型选择 / API key 等私有内容）。要在自己 fork 上启用 chef-bot：

1. 自部署一个 HTTP endpoint 实现 [chef-bot README](../../../skills/chef-bot/README.md)
   规定的请求 / 响应 schema。
2. repo Settings → Secrets → 加：
   - `CHEF_BOT_URL` — 你的 endpoint URL
   - `CHEF_BOT_TOKEN` — 鉴权 token（可选）
3. issue 加 `agent-go` label 触发 chef-agent workflow，会 POST 到你的 endpoint。

## 想加菜（用 maintainer 部署的官方 endpoint）？

打开 [新 Issue → 🍳 加一道菜](https://github.com/Coh1e/lazy-kitchen/issues/new?template=add-dish.yml)，
填好表单等 maintainer 触发。
