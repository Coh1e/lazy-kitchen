# chef-bot Worker

CF Worker that powers the chef-bot endpoint. Receives an add-dish request
from the public repo's GitHub Action, routes to the right persona + LLM,
returns a structured JSON proposal.

公开 repo 持有 personas + 触发 workflow + 解析响应 + 提 PR；本子项目只
负责"看一眼请求 → 调对的 LLM → 返回 schema-clean JSON"。

## 架构

```
公开 repo Issue + agent-go label
      ↓
.github/workflows/chef-agent.yml
      ↓
scripts/chef-agent.ts (POST 到 CHEF_BOT_URL)
      ↓
chef-bot/ Worker (本目录)
   ├─ routing.ts     : country → persona key
   ├─ personas-bundle: import .md ?text → 加载 prompt
   ├─ llm.ts         : DeepSeek / Gemini provider 封装
   ├─ schema.ts      : zod 校验响应
   └─ index.ts       : HTTP handler
      ↓
返回 { dish, glossary_additions, markdown_zh, markdown_en, ... }
```

## 当前 personas

| Persona | 菜系 | LLM | 模型 |
|---|---|---|---|
| `tangniu` | CN/HK/TW/MO | DeepSeek | `deepseek-chat` |
| `remy` | 一切其它 | Gemini | `gemini-2.5-flash` |

修改路由：`src/routing.ts`。改 prompts：`../skills/chef-bot/personas/*.md`
（公开 repo 共享 + 社区可治理）。

## 本地开发

```bash
cd chef-bot
npm install

# 复制 .dev.vars.example 成 .dev.vars 填 API keys
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars

npm run dev
# wrangler dev 默认 :8787
```

测试本地 endpoint：

```bash
curl -X POST http://127.0.0.1:8787/ \
  -H "content-type: application/json" \
  -d '{"dish_zh":"番茄炒蛋","dish_en":"Tomato and eggs","country":"CN"}'
```

## 部署到 Cloudflare

```bash
cd chef-bot
wrangler login                              # 一次性 OAuth 到你的 CF 账户

# 放 secrets (会提示交互输入)
wrangler secret put DEEPSEEK_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put AUTH_TOKEN              # 可选；自定 random 字符串

wrangler deploy
# 输出: https://lazy-kitchen-chef-bot.<your-account>.workers.dev
```

把 URL + AUTH_TOKEN 配到主 repo Settings → Secrets：

| Secret | Value |
|---|---|
| `CHEF_BOT_URL` | 上面的 workers.dev URL |
| `CHEF_BOT_TOKEN` | 你设的 AUTH_TOKEN（如果设了） |

## 环境变量

| 变量 | 必填 | 说明 |
|---|---|---|
| `DEEPSEEK_API_KEY` | 是 | platform.deepseek.com → API keys |
| `GEMINI_API_KEY` | 是 | aistudio.google.com → "Get API key" |
| `AUTH_TOKEN` | 可选 | 若设置，请求 header 必须 `Authorization: Bearer <token>` |

## Health check

```bash
curl https://lazy-kitchen-chef-bot.<account>.workers.dev/
# {"ok":true,"service":"lazy-kitchen-chef-bot"}
```

## Schema 同步约定

`src/schema.ts` 必须与公开 repo `scripts/chef-agent.ts` 里的 Schema 一致
(JSON 字段、enum 值、required 项)。任何一边改都要同步另一边，否则 chef-bot
返回的 JSON 会被 chef-agent.ts 的 zod 校验拒掉。
