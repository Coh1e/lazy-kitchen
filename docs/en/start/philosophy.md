# Philosophy

> Make Kitchen Great Again!

Lazy Kitchen is not a recipe website. It is a **structured, AI-curated, minimal-hardware, time-optimal** kitchen operating system.

## Five core beliefs

### 1. Content is the product; the website is just a viewer

All real knowledge lives in `data/*.yaml`. The site is just a renderer.
Open https://bep.coh1e.com in any browser; or `git clone` + `npm install` + `npm run dev` for local preview.

### 2. AI does NOT run inside the repo

No LLM clients, no API keys, no server code in this repo.
AI runs in YOUR local CLI agent (Claude Code / Cline + DeepSeek / Codex / Gemini / Aider).
The repo only stores **instructions** (`skills/add-dish/workflow.md`) and **contracts** (`schemas/*.json`).

### 3. Hardware is locked at 10 pieces

Chef's knife + Chinese cleaver + wok + soup pot + measuring spoons + kitchen scale + vacuum sealer + bags + spice sachets + freezer labels.
**That's it.**
Any dish needing oven / rice cooker / air fryer / blender must declare it in `hardware_extension`.
This works because Chinese fresh-food e-commerce sells pre-cut meat and deboned chicken thighs.

### 4. Time double-track: hands-on vs unattended

Every dish carries `hands_on_min` + `unattended_min`.
**The lazy core isn't short total time — it's short hands-on time.**
A 4h beef stew (15min hands-on) is "lazier" than a 30min stir-fry that needs full attention.

### 5. Humans lead taste; AI is the labor

Maintainer drafts via add-dish skill → cross-family AI second-opinion → push to bulletin board → community votes/comments → consensus → publish.
Don't let AI decide taste, but use AI to accelerate execution.

## What we don't do

- No accounts (GitHub identity)
- No comment DB (GitHub Discussions / Giscus)
- No backend (CF Pages static)
- No "influencer marketing" (let food speak)
- No baking (separate v2 project)
- No "low-carb / low-fat" labels (no diet bias)

## What we don't pre-pack

- Base ingredients (eggs, tofu, onion) — preserve human ritual
- Fresh aromatics (cilantro, mint, lime) — best when fresh
- Cutting itself (delegate to e-commerce)

## What we DO pre-pack

- Dry spice combos (DRY pack, pantry-stable for months)
- Wet sauces / marinades (WET pack, vacuum-frozen for months)
- Cooked bases (COOKED block, frozen weeks)
- Soup bases (SOUP concentrate, frozen months)
- Ready meals (READY, meal-prep scenarios)

## One sentence

**Ingredient + Flavor SKU + SOP = Meal.**

Reduce a week of cooking from "30 decisions × 7 days" to "3 big decisions + 5 minutes of grab-and-assemble per meal."
