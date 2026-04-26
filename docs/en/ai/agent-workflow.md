# Agent workflow / Agent 工作流

Lazy Kitchen has two add-dish workflows: your **local CLI** + **GitHub
chef-bot**.

## Local workflow (you, your CLI)

```text
You: /add-dish "Tomato and eggs"
  → Claude Code (or Cline + DeepSeek) runs the 5+1-step interactive flow
  → confirms with you at every step
  → writes data/ + docs/
  → git commit + push
  → CF Pages auto-deploys → bep.coh1e.com
```

See [skills/add-dish/workflow.md](../../../skills/add-dish/workflow.md).

## chef-bot GitHub workflow (community, frontend-backend decoupled)

```text
Anyone → opens a GitHub Issue (add-dish.yml template: dish name / cuisine)
maintainer → reviews request → adds the `agent-go` label
GitHub Action → triggers .github/workflows/chef-agent.yml
chef-agent.ts (public repo) → parses issue → POSTs to chef-bot Worker
                              (URL in secret CHEF_BOT_URL)
chef-bot Worker (chef-bot/ subdir, wrangler-deployed to *.workers.dev) →
  routes by cuisine.country:
    · CN/HK/TW/MO → 唐牛 (Tangniu, DeepSeek)
    · everything else → Remy / 雷米 (Gemini)
  → loads matching persona prompt (bundled from skills/chef-bot/personas/*.md)
  → calls LLM, generates structured JSON (dish + glossary + bilingual markdown + assumptions)
  → returns
chef-agent.ts → writes files + npm run validate → git commit + push to chef-bot/issue-N
              → gh pr create (labels: agent-proposal, needs-maintainer-review)
PR → community comments / corrects assumptions
maintainer → reviews + merges or closes
merge → CF Pages auto-deploys → new dish ships
```

## Personas are public and community-governed

`skills/chef-bot/personas/*.md` are open-source prompts. The community can
propose new personas or impeach existing ones via issues. See
[persona-governance.md](./persona-governance.md).

## Self-deploy chef-bot endpoint (forks / self-hosting)

The repo includes complete Worker source (`chef-bot/`); just need a CF account:

```bash
cd chef-bot
npm install
wrangler login
wrangler secret put DEEPSEEK_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put AUTH_TOKEN          # optional
wrangler deploy
```

After deploy, get the URL → main repo Settings → Secrets:
- `CHEF_BOT_URL` = your Worker's URL
- `CHEF_BOT_TOKEN` = the AUTH_TOKEN you set

## Want to add a dish (using the maintainer's official endpoint)?

Open [new Issue → 🍳 Add a dish](https://github.com/Coh1e/lazy-kitchen/issues/new?template=add-dish.yml)
and fill the form; wait for the maintainer to trigger chef-bot.
