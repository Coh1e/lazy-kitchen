# Using Claude Code

If you use Claude Code, this repo natively supports the `add-dish` skill.

## Install

See https://claude.com/claude-code

## Invoke

```bash
cd lazy-kitchen
claude
```

Then:

```text
> /add-dish Hongshao pork belly
```

Claude Code auto-loads `.claude/skills/add-dish/SKILL.md` and runs the 5+1-step interactive flow.

## Common flags

- Skip Step 6 cross-CLI review: `/add-dish <name> skip-review`
- Pure local draft (don't push to bulletin board): after run, manually flip `status: proposed` back to `draft` in the yaml
- Batch review existing drafts: `/review-drafts` (note: not yet implemented in v1; can manually re-run add-dish Step 6 on existing yaml)

## Claude Code limits (Chinese scenarios)

Claude Code uses Anthropic models by default; Chinese cuisine details sometimes lag DeepSeek. Suggestion:

- Chinese-heavy: switch to [Cline + DeepSeek](#/en/ai/choose-your-ai)
- Cross-CLI review: write in Cline, then open Claude Code for the review step (using review-prompt.md)

See [Choose your AI](#/en/ai/choose-your-ai).
