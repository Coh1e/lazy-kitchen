# Choose your AI

LK's `add-dish` skill is **model-neutral** — any agentic CLI that can read files and converse can run it. But different CLI × model combos vary widely in quality per scenario.

## CLI × model matrix

| CLI tool | Default model | DeepSeek support | Chinese quality | Best for |
|---|---|---|---|---|
| Claude Code | Claude (Anthropic) | ❌ | Good | General; Anthropic users |
| Codex CLI | GPT-4 / o1 | ❌ | Good | OpenAI users; structured output |
| Gemini CLI | Gemini | ❌ | OK | Google ecosystem |
| **Cline (VS Code)** | Any | ✅ Native | DeepSeek excels | **Chinese cuisine details** |
| **Aider** | Any | ✅ `--model deepseek/deepseek-chat` | DeepSeek excels | CLI + git workflow |
| **Continue.dev** | Any | ✅ | DeepSeek excels | VS Code / JetBrains |
| Cursor | Self + GPT/Claude | ✅ | Good | Heavy IDE users |

## Recommended combos

### Chinese maintainer

**Drafting (add-dish main flow)**:
- Top: **Cline + DeepSeek** (Chinese cuisine accuracy)
- Backup: Aider + DeepSeek

**Step 6 cross-CLI review**:
- Top: Codex + GPT-4o (most reliable structured JSON)
- Backup: Gemini CLI (independent model family)

→ "DeepSeek to draft, Codex/Gemini to review" is the sturdiest workflow.

### International maintainer / no Chinese-detail concerns

- Draft: Claude Code or Codex CLI
- Review: another (different model family)

### Minimalist

Use one CLI only (Claude Code or Codex). Step 6 auto-degrades to Tier 3 (skip review); entry stays `proposed` but `cross_reviewed: false` until later cross-audit.

## Install quick reference

| Tool | Install |
|---|---|
| Claude Code | https://claude.com/claude-code |
| Codex CLI | npm per official docs |
| Gemini CLI | https://ai.google.dev (CLI section) |
| Cline | VS Code marketplace, search "Cline" |
| Aider | `pip install aider-chat` |
| Continue.dev | VS Code marketplace, search "Continue" |
| Cursor | https://cursor.com |

## Setting DeepSeek (Aider example)

```bash
export DEEPSEEK_API_KEY=sk-xxx
aider --model deepseek/deepseek-chat
```

Cline / Continue: add DeepSeek provider in settings UI.

## We don't insist

All LK skills are markdown instructions, not API-dependent. Switching CLI doesn't affect the project, only your personal experience.

Try a few combos, pick what feels best.
