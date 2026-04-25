# 懒蛋厨房 / Lazy Kitchen — Gemini CLI guide

> 这是给 Gemini CLI 用的入口。等同于 `AGENTS.md` 的内容，重定向到同一份真源。

请阅读 [AGENTS.md](./AGENTS.md) — 所有 agentic CLI 共用同一套约定。

核心要点:

- 加新菜：严格按 `skills/add-dish/workflow.md`
- 审稿（被 add-dish 跨 CLI 调用时）：严格按 `skills/add-dish/review-prompt.md`
- 校验闭环：`bun run scripts/validate-data.ts` + `lint-bilingual.ts` + `build-glossary.ts`
- 永远不要 git 操作、不要调外部 API、不要擅自写文件

## Gemini 在 LK 项目里的特殊定位

Gemini 适合做 add-dish 的 **Step 6 二审者**（与 Cline + DeepSeek 写稿配合，跨家族独立判断）。
maintainer 在 propose_new 路径会自动调你做审稿，按 review-prompt.md 输出 JSON。

中文菜系细节虽然 DeepSeek 更精，但 Gemini 在结构化校验 / 跨文化对照上很可靠。
