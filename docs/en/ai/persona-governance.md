# Chef persona governance / Persona 社区治理

The Lazy Kitchen chef-bot personas (Tangniu / Remy / ...) can be **proposed
or impeached by anyone** in the community. The maintainer makes the final
call, but must publish reasoning.

## Current personas

| Persona | Cuisine coverage | LLM | File |
|---|---|---|---|
| **Tangniu (唐牛)** | Chinese (CN/HK/TW/MO) | DeepSeek | `skills/chef-bot/personas/tangniu.md` |
| **Remy / 雷米** | Everything else | Gemini | `skills/chef-bot/personas/remy.md` |

## Propose a new persona

1. Make sure: **doesn't overlap** with existing personas? Has stylistic differentiation?
2. Copy `skills/chef-bot/personas/_template.md` and write a complete prompt draft.
3. Open [new Issue → 🍳 Propose new chef persona](https://github.com/Coh1e/lazy-kitchen/issues/new?template=propose-persona.yml).
4. Community discusses; maintainer evaluates.
5. Maintainer accepts → opens PR adding `personas/<name>.md` + routing change + avatar.
6. PR merged → chef-bot Worker auto-redeploys → endpoint immediately uses new persona.

## Impeach an existing persona

1. Collect **concrete evidence** — at least 3 PR/issue links showing the persona's problems.
2. Propose a **replacement** — who handles the cuisine after impeachment.
3. Open [new Issue → 🚫 Impeach chef persona](https://github.com/Coh1e/lazy-kitchen/issues/new?template=impeach-persona.yml).
4. Community discusses; maintainer decides (could be: edit prompt / swap LLM / delete entirely).
5. Decision = delete → PR removes `personas/<name>.md` + routing fallback change.
6. PR merged → chef-bot Worker auto-redeploys.

Regardless of outcome, issues are kept permanently as governance history.

## Lightweight governance principles

- **Maintainer is the final decider, no voting threshold** — avoids brigading
- **Maintainer must publish reasoning** — comment on the issue explaining
- **Keep all propose/impeach issues** — for future reference
- **Replacement is mandatory** — impeachment must propose "who takes over"; no pure destruction

## Legal floor (non-negotiable)

Regardless of community wishes:

1. Personas may **not reproduce real persons / actors / famous chefs** (legal + ethical)
2. Cuisine descriptions **may not be deliberately offensive**
3. **No advertising / SKU promotion**
4. **No commercial-sales orientation**

## Proposer responsibilities

When proposing a new persona, you must yourself:

- Write ≥ 200-word prompt draft (not "Chinese chef" handwave)
- Provide an avatar concept (ChatGPT prompt or sketch link)
- Declare the name + avatar are IP-clear

## Maintainer's internal judgment

The public rule is: maintainer decides. **Internal heuristics** are kept in
maintainer's private notes (not public).
