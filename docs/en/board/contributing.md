# How to participate

Lazy Kitchen is a **maintainer-led + community-built** project. Whatever your cooking level, all of these are welcome.

## Three ways to contribute

### A. Vote / comment via Giscus (lowest barrier)

Each dish page embeds GitHub Discussions. You can:

- 👍 / 👎 one-tap vote
- Leave bilingual comments ("This dish should use cane vinegar, not rice vinegar")
- See others' discussion

**Requirement**: GitHub account login (one-time).

### B. File a GitHub Issue (medium barrier)

Good for systematic feedback:

| Issue type | Example |
|---|---|
| Cuisine inaccurate | "This isn't authentic Korean ganjang gejang, no Korean would use X" |
| Wrong terminology | "glossary translates 老抽 fine but alias_en should add 'sweet dark soy'" |
| Hardware requirement missed | "This dish actually needs an oven, hardware_extension didn't list it" |
| Time unrealistic | "20 min hands-on is impossible, should be 35 min" |
| Food safety risk | "Vacuum bag temp rating unclear, beginners might misuse" |
| Translation quality | "English step has ambiguity" |

→ File via the GitHub repo Issues tab.

### C. Submit a GitHub PR (higher barrier)

Directly modify yaml + docs; maintainer reviews then merges. Suitable for:

- Adding a new dish (after running add-dish skill yourself)
- Fixing a term
- Improving an SOP step
- Adding buying_guide detail
- Improving translations

PR rules:

- Must pass `bun run scripts/validate-data.ts`
- Must pass `bun run scripts/lint-bilingual.ts`
- Cross-CLI reviewed (ideal) or PR description explains skip reason

## How maintainer handles feedback

```text
Discussions comment → maintainer judgement → edit yaml → push
GitHub Issue        → maintainer triage → label / fix / close
GitHub PR           → review → validate → merge or request changes
```

Response time not guaranteed. Personal project.

## Limits

- Won't accept "this dish should be named XXX" pure taste arguments (fork it)
- Won't accept "add this sauce, add that sauce" feature creep (violates "minimal hardware" principle)
- Won't accept "build it as an App" direction-change requests (it's a static site + skill)

## Your scope

- Fork it: add any dishes you want, mark them all approved for your own use
- You don't have to merge changes back to main
- Main repo is "official Lazy Kitchen perspective"; YOUR kitchen is your kitchen
