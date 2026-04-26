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

## chef-bot GitHub workflow (community)

```text
Anyone → opens a GitHub Issue (add-dish.yml template: dish name / cuisine)
maintainer → reviews request → adds the `agent-go` label
GitHub Action → triggers .github/workflows/chef-agent.yml
chef-agent.ts → parses issue → POSTs to CHEF_BOT_URL endpoint
                (this endpoint is self-hosted by the maintainer — could be
                 a Cloudflare Worker / Lambda / Vercel Functions / any HTTP service)
endpoint → returns structured JSON (dish + glossary + bilingual markdown + assumptions)
script → writes files + npm run validate → git commit + push to chef-bot/issue-N
script → gh pr create (labels: agent-proposal, needs-maintainer-review)
PR → community comments / corrects assumptions
maintainer → reviews + merges or closes
merge → CF Pages auto-deploys → new dish ships
```

## Deploying a chef-bot endpoint (required for forks / self-hosting)

This repo does **not** contain the chef-bot endpoint implementation. That
service (with prompts, persona/style choices, model selection, API keys)
is operated separately by the maintainer. To enable chef-bot on your own
fork:

1. Self-host an HTTP endpoint implementing the request/response schema in
   [chef-bot README](../../../skills/chef-bot/README.md).
2. repo Settings → Secrets → add:
   - `CHEF_BOT_URL` — your endpoint's URL
   - `CHEF_BOT_TOKEN` — bearer token (optional)
3. Add the `agent-go` label to an issue → chef-agent workflow POSTs to your endpoint.

## Want to add a dish (using the maintainer's official endpoint)?

Open [a new Issue → 🍳 Add a dish](https://github.com/Coh1e/lazy-kitchen/issues/new?template=add-dish.yml)
and fill the form; wait for the maintainer to trigger chef-bot.
