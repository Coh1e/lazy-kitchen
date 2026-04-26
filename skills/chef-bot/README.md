# chef-bot — non-interactive add-dish via remote endpoint

`chef-bot` 是 `add-dish` skill 的**机器变体**，跑在 GitHub Actions 里，处理
社区在 Issues 提的"加菜请求"。

## 架构

```
GitHub Issue + agent-go label
     ↓
.github/workflows/chef-agent.yml (公开)
     ↓
scripts/chef-agent.ts (公开 — 解析 issue + 转发请求 + 写文件 + 开 PR)
     ↓ HTTP POST { dish_zh, dish_en, country, region, notes }
CHEF_BOT_URL endpoint (你自定义部署的 CF Worker — 私有)
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

公开 repo 只负责 **GitHub-side 接入层**：触发、解析、转发、落盘、提 PR。
**所有提示词、模型选择、persona 设定** 都在你部署的 CF Worker 里，repo 不可见。

## 你需要部署一个 chef-bot endpoint

任何能接受 POST 请求并返回符合 schema 的 JSON 的 HTTP 服务都行。最自然
的选择是 **CF Worker**（用 wrangler 部署），但也可以是 Lambda / Vercel
Functions / 自建服务器。

### 请求 schema（POST body）

```json
{
  "dish_zh": "番茄炒蛋",
  "dish_en": "Tomato and eggs",
  "country": "CN",
  "region": "中",
  "notes": "5 分钟 hands-on"
}
```

### 响应 schema（JSON body）

```json
{
  "agent_label": "可选 — 用于 PR body 显示哪位 chef 出的方案",
  "agent_avatar_url": "可选 — 完整 URL，渲染在 PR body 顶部",
  "slug": "cn-tomato-eggs",
  "decision_path": "use_existing | adapt_existing | propose_new | out_of_scope",
  "confidence": "high | medium | low",
  "assumptions": ["...", "..."],
  "dish": { /* 符合 schemas/dish.schema.json 的对象 */ },
  "glossary_additions": [
    { "zh": "...", "en": "...", "category": "...", "alias_zh": [...], "alias_en": [...], "notes": "..." }
  ],
  "markdown_zh": "# ...\n...",
  "markdown_en": "# ...\n...",
  "commit_message": "chef-bot: ..."
}
```

完整 zod schema 在 `scripts/chef-agent.ts` 里 `Schema` 常量。

### 鉴权

请求会带 `Authorization: Bearer <CHEF_BOT_TOKEN>` header。endpoint 自己决定
是否校验。

## 8 条硬规则（继承 add-dish/workflow.md）

`chef-bot` endpoint 的实现仍受 `skills/add-dish/workflow.md` 8 条硬规则约束 ——
唯一差异是**第 1 条改为机器模式**："不能等用户 yes，但所有假设必须显式列在
响应的 `assumptions[]` 段，让社区/maintainer 在 review 时能逐条纠正。"

## 配置 GitHub Action 用

repo settings → Secrets and variables → Actions → 添加：

| Secret | Value |
|---|---|
| `CHEF_BOT_URL` | 你的 endpoint 完整 URL，例 `https://chef-bot.example.workers.dev` |
| `CHEF_BOT_TOKEN` | 鉴权 token，由你的 endpoint 自己定义和校验 |

## 端到端流程

详见 `docs/{zh,en}/ai/agent-workflow.md`。
