# Step 6: 跨 CLI 自审 (Cross-CLI review)

详见 `skills/add-dish/workflow.md` Step 6 + `skills/add-dish/review-prompt.md`.

## 触发矩阵

| 路径 | 信心度 | 触发跨 CLI 审 |
|---|---|---|
| use_existing | high | ⏸ 跳过 |
| use_existing | medium | ❓ 询问 maintainer |
| use_existing | low | ✓ 必须 |
| propose_new (任何) | - | ✓ 必须 |

## 执行

### Tier 1: 自动 (检测 codex / gemini / aider 在 PATH)

```bash
which codex   # → /usr/local/bin/codex
which gemini  # → /usr/local/bin/gemini
which aider   # → /usr/local/bin/aider
```

优先级: codex > gemini > aider

```bash
# 先把待审内容写到 ai/staging/draft.json (临时)
# 然后调用:
codex --headless --prompt "$(cat skills/add-dish/review-prompt.md)\n\n要审的内容:\n$(cat ai/staging/draft.json)"
```

捕获 stdout，解析 JSON 判决。

### Tier 2: 半自动 (检测不到任何辅助 CLI)

向 maintainer 输出指令:

```
请开另一个终端，进本仓库根目录，跑下面任一命令:

  $ codex --prompt "$(cat skills/add-dish/review-prompt.md)" -- ai/staging/draft.json
  $ gemini --prompt "$(cat skills/add-dish/review-prompt.md) | $(cat ai/staging/draft.json)"
  $ aider --message "审稿懒蛋厨房新菜，按 skills/add-dish/review-prompt.md 输出 JSON" ai/staging/draft.json

把审稿结果（JSON 格式）粘回这里。
```

等 maintainer 粘贴后，解析。

### Tier 3: 跳过 (`add-dish skip-review`)

maintainer 明确说不要跨审：
- 写入条目 `cross_reviewed: false`
- 写入条目 `cross_reviewer_cli: skipped`
- status 仍为 proposed
- 但 ⚠️ 提醒 maintainer：approved 的硬条件需要 cross_reviewed=true，未来要升级前需补审

## 处理三种判决

```json
{
  "verdict": "approved" | "revise" | "reject"
}
```

- `approved` → 标记 cross_reviewed=true, cross_reviewer_cli=<name>, cross_reviewer_model=<model>, cross_review_at=<ISO> → 继续 Step 5 写入
- `revise` → 显示 suggestions → 回到 Step 3 重做 (保留之前的 maintainer 确认，只改受批评的字段)
- `reject` → 显示 reject 原因 + cite → 询问 maintainer 是否完全放弃此次提案

## 不要

- 不要伪造 cross_reviewed: true (即使 Tier 1/2 都失败)
- 不要 silently 跳过 (必须明确告诉 maintainer 跳过的后果)
