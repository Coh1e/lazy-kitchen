import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseTemplate } from '../../scripts/chef-agent.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('chef-agent: parseTemplate (issue form fields)', () => {
  const fixture = JSON.parse(
    readFileSync(join(__dirname, '..', 'fixtures', 'issue-tomato-eggs.json'), 'utf-8'),
  ) as { issue: { body: string } }

  it('extracts dish_zh + dish_en + country', () => {
    const out = parseTemplate(fixture.issue.body)
    expect(out.dish_zh).toBe('番茄炒蛋')
    expect(out.dish_en).toBe('Tomato and eggs')
    expect(out.country).toBe('CN')
  })

  it('extracts optional region + notes', () => {
    const out = parseTemplate(fixture.issue.body)
    expect(out.region).toBe('中')
    expect(out.notes).toContain('5 分钟 hands-on')
  })

  it('returns undefined for missing optional fields', () => {
    const out = parseTemplate(
      '### 菜名（中文）/ Dish name (Chinese)\n\n红烧肉\n\n### 菜名（英文）/ Dish name (English)\n\nHongshao pork\n\n### 国家代码 / Country code\n\nCN\n',
    )
    expect(out.region).toBeUndefined()
    expect(out.notes).toBeUndefined()
  })
})
