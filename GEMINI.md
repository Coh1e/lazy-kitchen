# 懒蛋厨房 / Lazy Kitchen — Gemini CLI guide

> 这是给 Gemini CLI 用的入口。等同于 `AGENTS.md` 的内容，重定向到同一份真源。

请阅读 [AGENTS.md](./AGENTS.md) — 所有 agentic CLI 共用同一套约定。

## Gemini 在 LK 项目里的特殊定位

### 1. chef-bot 的 "Remy" persona 后端

Gemini 是 **Remy / 雷米** 的底层 LLM，覆盖**所有非中文菜系**（西/日/印/东南亚/中东/拉美/非洲...）。
chef-bot Worker (`chef-bot/src/`) 在国家代码不属于 CN/HK/TW/MO 时调用 Gemini API
生成 dish 草案。

如果你被 chef-bot Worker 调到，按 `skills/chef-bot/system-prompt.md` 严格输出 JSON。

### 2. 跨 CLI 二审者 (review-dish)

Gemini 适合做 add-dish 的 **Step 6 二审者**（与 Cline + DeepSeek 写稿配合，跨家族独立判断）。
maintainer 在 propose_new 路径会自动调你做审稿，按 `skills/add-dish/review-prompt.md`
输出 JSON。

中文菜系细节虽然 DeepSeek 更精，但 Gemini 在结构化校验 / 跨文化对照上很可靠。

## 校验闭环

```bash
npm run validate          # JSON Schema 校验
npm run lint:bilingual    # 双语完备性
npm run build:glossary    # 术语对账
```

永远不要 git 操作、不要在 skill 里调外部 API、不要擅自写文件。
