#!/usr/bin/env tsx
/**
 * chef-agent — GitHub-side glue for chef-bot remote endpoint.
 *
 * 1. Read GitHub issue (from GITHUB_EVENT_PATH or --issue-file fixture)
 * 2. Parse structured fields (dish_zh / dish_en / country / region / notes)
 * 3. POST to CHEF_BOT_URL with Authorization: Bearer CHEF_BOT_TOKEN
 * 4. Validate response with zod schema
 * 5. Write data/dishes.yaml + glossary.yaml + docs/{zh,en}/compose/<slug>.md
 * 6. Run npm run validate; abort on fail
 * 7. (CI mode only) git checkout -b chef-bot/issue-N → commit + push → gh pr create
 *
 * The endpoint at CHEF_BOT_URL owns: prompts, persona selection, LLM choice,
 * provider API keys. None of that lives in this repo.
 */

import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises'
import { writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { z } from 'zod'
import yaml from 'js-yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/* ──────────────────── 1 + 2: load issue + parse ──────────────────── */

interface IssueInput {
  number: number
  title: string
  body: string
  user: string
  dish_zh: string
  dish_en: string
  country: string
  region?: string
  notes?: string
}

function loadIssue(): IssueInput {
  const fixtureFlag = process.argv.indexOf('--issue-file')
  let raw: string
  let issue: { number: number; title: string; body: string; user: { login: string } }

  if (fixtureFlag !== -1) {
    raw = readFileSync(process.argv[fixtureFlag + 1], 'utf-8')
    const fixture = JSON.parse(raw) as { issue: typeof issue }
    issue = fixture.issue
  } else if (process.env.GITHUB_EVENT_PATH) {
    raw = readFileSync(process.env.GITHUB_EVENT_PATH, 'utf-8')
    const event = JSON.parse(raw) as { issue: typeof issue }
    issue = event.issue
  } else {
    throw new Error('No GITHUB_EVENT_PATH and no --issue-file flag')
  }

  return {
    ...parseTemplate(issue.body),
    number: issue.number,
    title: issue.title,
    body: issue.body,
    user: issue.user.login,
  }
}

/** Parse GitHub Issue Form body. Each field is rendered as `### {label}\n\n{value}`. */
export function parseTemplate(body: string): {
  dish_zh: string; dish_en: string; country: string; region?: string; notes?: string
} {
  const fieldOf = (label: string): string => {
    const re = new RegExp(`###\\s+${label}[^\\n]*\\n+([\\s\\S]*?)(?=\\n###\\s|$)`, 'i')
    const m = body.match(re)
    return m ? m[1].trim() : ''
  }
  return {
    dish_zh: fieldOf('菜名（中文）'),
    dish_en: fieldOf('菜名（英文）'),
    country: fieldOf('国家代码').split('\n')[0].trim().toUpperCase(),
    region: fieldOf('子地区') || undefined,
    notes: fieldOf('备注') || undefined,
  }
}

/* ──────────────────── 3 + 4: POST to remote + validate ──────────────────── */

const BilingualName = z.object({ zh: z.string(), en: z.string() })

const Schema = z.object({
  agent_label: z.string().optional(),
  agent_avatar_url: z.string().url().optional(),
  slug: z.string(),
  decision_path: z.enum(['use_existing', 'adapt_existing', 'propose_new', 'out_of_scope']),
  confidence: z.enum(['high', 'medium', 'low']),
  assumptions: z.array(z.string()),
  dish: z.object({
    id: z.string().regex(/^DISH-[A-Z0-9-]+$/),
    name: BilingualName,
    cuisine: z.object({ country: z.string(), region: z.string().optional() }),
    status: z.literal('proposed'),
    cross_reviewed: z.literal(false),
    cross_reviewer_cli: z.literal('skipped'),
    uses: z.object({
      sku: z.array(z.string()).default([]),
      sop: z.array(z.string()).default([]),
      ratio: z.array(z.string()).default([]),
    }),
    fresh_ingredients: z.array(z.object({
      name: BilingualName,
      amount: z.union([z.number(), z.string()]),
      unit: z.union([z.string(), BilingualName]),
    })),
    yield: z.object({ servings: z.number().int().min(1) }),
    time: z.object({
      prep_min: z.number().int().min(0),
      hands_on_min: z.number().int().min(0),
      unattended_min: z.number().int().min(0),
      total_min: z.number().int().min(0),
    }),
    hardware_required: z.array(z.string()).default(['MVP']),
    hardware_extension: z.array(z.string()).default([]),
    flavor_structure: z.object({
      salt: z.string().nullable(),
      fat: z.string().nullable(),
      acid: z.string().nullable(),
      heat: z.string().nullable(),
    }),
    flavor_tags: z.array(z.string()),
    diet_tags: z.array(z.string()),
    meal_pattern: z.string(),
    notes: BilingualName,
  }),
  glossary_additions: z.array(z.object({
    zh: z.string(),
    en: z.string(),
    alias_zh: z.array(z.string()).optional(),
    alias_en: z.array(z.string()).optional(),
    category: z.string(),
    notes: z.string().optional(),
  })).default([]),
  markdown_zh: z.string(),
  markdown_en: z.string(),
  commit_message: z.string(),
})

type AgentOutput = z.infer<typeof Schema>

async function callChefBot(issue: IssueInput): Promise<AgentOutput> {
  const url = process.env.CHEF_BOT_URL
  const token = process.env.CHEF_BOT_TOKEN
  if (!url) throw new Error('CHEF_BOT_URL not set — chef-bot endpoint required')

  const body = {
    dish_zh: issue.dish_zh,
    dish_en: issue.dish_en,
    country: issue.country,
    region: issue.region,
    notes: issue.notes,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { 'authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`chef-bot endpoint returned ${res.status}: ${text.slice(0, 500)}`)
  }
  const json = await res.json()
  return Schema.parse(json)
}

/* ──────────────────── 5: apply changes ──────────────────── */

async function appendDish(dish: AgentOutput['dish']) {
  const path = join(ROOT, 'data/dishes.yaml')
  const text = await readFile(path, 'utf-8')
  const dump = yaml.dump([dish], { lineWidth: 200, quotingType: '"' }).trimEnd()
  await writeFile(path, text.trimEnd() + '\n\n' + dump + '\n', 'utf-8')
}

async function appendGlossary(terms: AgentOutput['glossary_additions']) {
  if (terms.length === 0) return
  const path = join(ROOT, 'data/glossary.yaml')
  const text = await readFile(path, 'utf-8')
  const dump = yaml.dump(terms, { lineWidth: 200, quotingType: '"' }).trimEnd()
  await writeFile(path, text.trimEnd() + '\n\n' + dump + '\n', 'utf-8')
}

async function writeMarkdown(slug: string, body: string, lang: 'zh' | 'en') {
  const dir = join(ROOT, `docs/${lang}/compose`)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, `${slug}.md`), body, 'utf-8')
}

async function applyChanges(out: AgentOutput) {
  await appendDish(out.dish)
  await appendGlossary(out.glossary_additions)
  await writeMarkdown(out.slug, out.markdown_zh, 'zh')
  await writeMarkdown(out.slug, out.markdown_en, 'en')
}

/* ──────────────────── 6: validate ──────────────────── */

function validate() {
  execSync('npm run validate', { cwd: ROOT, stdio: 'inherit' })
  execSync('npm run lint:bilingual', { cwd: ROOT, stdio: 'inherit' })
}

/* ──────────────────── 7: git + PR (CI only) ──────────────────── */

function renderPRBody(out: AgentOutput, issue: IssueInput): string {
  const avatarLine = out.agent_avatar_url
    ? `<img src="${out.agent_avatar_url}" align="right" width="120" alt="${out.agent_label ?? 'chef-bot'}">\n\n`
    : ''
  const labelLine = out.agent_label ? `\n> Agent: **${out.agent_label}**` : ''

  return [
    avatarLine + `## 🍳 chef-bot 提案: ${out.dish.name.zh} / ${out.dish.name.en}`,
    '',
    `> 由 #${issue.number} 触发 (@${issue.user})${labelLine}`,
    '',
    '### 决策',
    `- **路径**: ${out.decision_path}`,
    `- **信心**: ${out.confidence}`,
    `- **Cross-CLI 审稿**: ⏸ 跳过（机器模式默认；maintainer 觉得需要请触发 review-dish）`,
    '',
    '### 假设（社区可在评论纠错）',
    ...out.assumptions.map((a, i) => `${i + 1}. ${a}`),
    '',
    '### 文件 diff',
    `- \`data/dishes.yaml\` (新增 \`${out.dish.id}\`)`,
    out.glossary_additions.length > 0
      ? `- \`data/glossary.yaml\` (新增 ${out.glossary_additions.length} 词条: ${out.glossary_additions.map((g) => g.zh).join(', ')})`
      : '',
    `- \`docs/zh/compose/${out.slug}.md\` (新建)`,
    `- \`docs/en/compose/${out.slug}.md\` (新建)`,
    '',
    '### 待 maintainer',
    '- [ ] yaml 字段对吗',
    '- [ ] 双语翻译妥吗',
    '- [ ] cross-CLI 二审要不要跑',
    '',
    `Closes #${issue.number}`,
  ].filter(Boolean).join('\n')
}

function gitCommitAndPR(out: AgentOutput, issue: IssueInput) {
  const branch = `chef-bot/issue-${issue.number}-${out.slug}`
  execSync(`git checkout -b ${branch}`, { cwd: ROOT, stdio: 'inherit' })
  execSync(`git add data/ docs/`, { cwd: ROOT, stdio: 'inherit' })
  execSync(`git commit -m "${out.commit_message.replace(/"/g, '\\"')}"`, { cwd: ROOT, stdio: 'inherit' })
  execSync(`git push -u origin ${branch}`, { cwd: ROOT, stdio: 'inherit' })

  const prBody = renderPRBody(out, issue)
  const tmpFile = join(ROOT, '.chef-pr-body.tmp.md')
  writeFileSync(tmpFile, prBody, 'utf-8')
  try {
    execSync(
      `gh pr create --base main --head ${branch} ` +
      `--title "chef-bot: ${out.dish.name.zh} (proposed)" ` +
      `--body-file ${tmpFile} ` +
      `--label agent-proposal --label needs-maintainer-review`,
      { cwd: ROOT, stdio: 'inherit' },
    )
  } finally {
    unlink(tmpFile).catch(() => {})
  }
}

/* ──────────────────── main ──────────────────── */

async function main() {
  const issue = loadIssue()
  console.log(`📋 Issue #${issue.number}: ${issue.title}`)
  console.log(`   Dish: ${issue.dish_zh} / ${issue.dish_en}`)
  console.log(`   Cuisine: ${issue.country}${issue.region ? ` / ${issue.region}` : ''}`)

  const out = await callChefBot(issue)
  console.log(`✏️  Decision: ${out.decision_path} (confidence ${out.confidence})`)
  console.log(`   Agent: ${out.agent_label ?? '(unspecified)'}`)
  console.log(`   Assumptions: ${out.assumptions.length}`)
  console.log(`   Glossary additions: ${out.glossary_additions.length}`)

  if (out.decision_path === 'out_of_scope') {
    console.error('🚫 Out of scope — aborting')
    process.exit(2)
  }

  await applyChanges(out)
  console.log('💾 Files written. Validating…')
  validate()

  if (process.env.GITHUB_ACTIONS && process.env.ISSUE_NUMBER) {
    console.log('🚀 CI mode — committing + opening PR')
    gitCommitAndPR(out, issue)
  } else {
    console.log('🧪 Local dry-run — files written but NOT committed.')
    console.log('   PR body preview:')
    console.log('---')
    console.log(renderPRBody(out, issue))
    console.log('---')
  }
}

// Only run when invoked as the entry script (not when imported by tests).
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1) })
}
