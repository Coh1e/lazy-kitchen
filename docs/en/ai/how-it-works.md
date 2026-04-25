# How it works

LK's AI runs entirely **inside maintainer's local CLI agent**. The repo stores no API keys and calls no external services.

## Picture

```text
Repo (lazy-kitchen)              Maintainer's local CLI agent
─────────────────                ─────────────────────────────
data/*.yaml          ◄────read───  Cline + DeepSeek
schemas/*.json                       │
skills/add-dish/                     ▼
  workflow.md        ◄──instruct──  Run add-dish skill (5+1 steps)
  examples/*.md                      │
                                     ▼
docs/*.md            ◄──write────  Write drafts back to data/ + docs/
                                     │
                                     ▼
                                   git push (manual)
                                     │
                                     ▼
                                   CF Pages auto-deploy
                                     │
                                     ▼
                                   Bulletin board auto-shows status: proposed
```

## 5 + 1 step overview

See `skills/add-dish/workflow.md` for full detail.

| Step | What |
|---|---|
| 1. Analyze | Parse dish → cuisine, flavors, ingredients, technique |
| 2. Match | Scan existing SKU/SOP/Ratio → confidence rating |
| 3a. use_existing | Compose dish directly (existing parts suffice) |
| 3b. propose_new | Draft new SKU/SOP/Ratio |
| 4. Glossary | New terms → maintainer audit → append |
| 5. Validate | Run 3 validation scripts → report |
| 6. Cross-CLI review | Triggered by matrix; cross-family second opinion |

## 7 hard rules

The skill MUST obey:

1. **No silent file writes** (show draft each time)
2. **New entries status = proposed** (not draft; auto-bulletin)
3. **Glossary is the terminology guardrail**
4. **Bilingual mandatory** (zh + en both filled)
5. **Validation closed loop** (run 3 scripts; rollback on fail)
6. **No git operations** (output suggested commit message)
7. **No external API calls** (model lives in maintainer's CLI)

## Try it

Install an agentic CLI (recommend Cline + DeepSeek for Chinese-heavy work), then:

```text
> /add-dish Hongshao pork belly
```

The skill will interactively confirm 5 steps. First run: ~15 min. Once familiar: 5 min.
