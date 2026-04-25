# 选你的 AI / Choose your AI

LK 的 `add-dish` skill 是 **模型中立**的 —— 任何能读文件、跟你对话的 agentic CLI 都能跑。但不同 CLI / 模型组合在不同场景下体验差很多。

## CLI × 模型对照

| CLI 工具 | 默认模型 | 接 DeepSeek 难度 | 中文质量 | 场景适配 |
|---|---|---|---|---|
| Claude Code | Claude (Anthropic) | ❌ 暂不支持自定义端点 | 好 | 综合任务、Anthropic 用户 |
| Codex CLI | GPT-4 / o1 | ❌ | 好 | OpenAI 用户、强结构化输出 |
| Gemini CLI | Gemini | ❌ | 中 | Google 生态 |
| **Cline (VS Code)** | 任意 | ✅ 原生 | DeepSeek 顶 | **中文菜系细节首选** |
| **Aider** | 任意 | ✅ `--model deepseek/deepseek-chat` | DeepSeek 顶 | 喜欢 CLI + git workflow |
| **Continue.dev** | 任意 | ✅ | DeepSeek 顶 | VS Code / JetBrains 用户 |
| Cursor | 自家 + GPT/Claude | ✅ 设置里换 | 好 | 重度 IDE 用户 |

## 推荐组合

### 中文 maintainer

**写新菜（add-dish 主流程）**:
- 首选：**Cline + DeepSeek**（中文菜系细节最准）
- 备选：Aider + DeepSeek

**Step 6 跨 CLI 二审**:
- 首选：Codex + GPT-4o（结构化 JSON 输出最稳）
- 备选：Gemini CLI（独立模型家族）

→ "DeepSeek 写稿，Codex/Gemini 审稿" 是最稳的工作流。

### 国际 maintainer / 不在意中文细节

**写**: Claude Code 或 Codex CLI
**审**: 另一个（不同模型家族）

### 实在没钱 / 极简党

只用一个 CLI（Claude Code 或 Codex CLI）。
Step 6 自动降级到 Tier 3（跳过审稿），条目 status 仍为 proposed 但 `cross_reviewed: false`，等你日后补审才能升级 approved。

## 安装速查

| 工具 | 安装 |
|---|---|
| Claude Code | https://claude.com/claude-code |
| Codex CLI | npm 安装 (按官方文档) |
| Gemini CLI | https://ai.google.dev (CLI section) |
| Cline | VS Code marketplace 搜 "Cline" |
| Aider | `pip install aider-chat` |
| Continue.dev | VS Code marketplace 搜 "Continue" |
| Cursor | https://cursor.com |

## 配 DeepSeek 速查 (以 Aider 为例)

```bash
export DEEPSEEK_API_KEY=sk-xxx
aider --model deepseek/deepseek-chat
```

Cline / Continue 在 settings UI 里加 DeepSeek provider 即可。

## 我们不强求

LK 的所有 skill 都是 markdown 指令，不依赖任何特定 CLI 的 API。
你换 CLI 不会影响项目，最多影响个人体验。

试试不同组合，挑最顺手的。
