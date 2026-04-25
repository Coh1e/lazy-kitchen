# 用 Claude Code 跑 LK / Using Claude Code

如果你用 Claude Code，本仓库已经原生支持 `add-dish` skill。

## 安装

详见 https://claude.com/claude-code

## 调用

进入仓库根目录，启动 Claude Code:

```bash
cd lazy-kitchen
claude
```

然后:

```text
> /add-dish 红烧肉饭
```

Claude Code 会自动加载 `.claude/skills/add-dish/SKILL.md`，按 5 + 1 步交互式执行。

## 常用提示

- 想跳过 Step 6 跨 CLI 审稿: `/add-dish 红烧肉饭 skip-review`
- 想纯本地草稿（不进告示栏）: 跑完后手动改 yaml 里的 `status` 从 `proposed` 回 `draft`
- 想批量审已存在的 draft: `/review-drafts`（注：v1 暂未实现，可手动让 add-dish 在已有 yaml 上重跑 Step 6）

## Claude Code 的局限（中文场景）

Claude Code 默认走 Anthropic 模型；中文菜系细节有时不如 DeepSeek 精准。建议:

- 中文重场景：换用 [Cline + DeepSeek](#/zh/ai/choose-your-ai)
- 跨 CLI 二审：在 Cline 写完后，开 Claude Code 跑 review（用 review-prompt.md）

详见 [选你的 AI](#/zh/ai/choose-your-ai)。
