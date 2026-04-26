import { z } from 'zod'

/**
 * IMPORTANT: Keep this schema in sync with `scripts/chef-agent.ts` Schema in
 * the public repo root. The chef-agent client validates the response against
 * the same shape.
 */

const BilingualName = z.object({ zh: z.string(), en: z.string() })

/** Enums kept in sync with main repo schemas/_common.schema.json + glossary-entry.schema.json */
const DietTag = z.enum([
  'vegan', 'vegetarian', 'halal', 'kosher',
  'no-pork', 'gluten-free', 'nut-free', 'dairy-free',
])

const GlossaryCategory = z.enum([
  'whole-spice', 'ground-spice', 'sauce', 'paste', 'vinegar', 'oil',
  'fresh-aromatic', 'protein', 'vegetable', 'grain', 'dairy',
  'technique', 'equipment', 'cuisine',
])

export const RequestSchema = z.object({
  dish_zh: z.string().min(1),
  dish_en: z.string().min(1),
  country: z.string().min(2),
  region: z.string().optional(),
  notes: z.string().optional(),
})

export type RequestBody = z.infer<typeof RequestSchema>

export const ResponseSchema = z.object({
  slug: z.string().describe('URL-safe filename slug, e.g. cn-tomato-eggs'),
  decision_path: z.enum(['use_existing', 'adapt_existing', 'propose_new', 'out_of_scope']),
  confidence: z.enum(['high', 'medium', 'low']),
  assumptions: z.array(z.string()).describe('Each non-obvious decision the agent made unilaterally'),
  dish: z.object({
    id: z.string().regex(/^DISH-[A-Z0-9-]+$/),
    name: BilingualName,
    cuisine: z.object({ country: z.string(), region: z.string().optional() }),
    // status / cross_reviewed / cross_reviewer_cli — hardcoded in index.ts.
    // (Removed from LLM schema because Gemini rejects boolean-literal enums
    //  in response_schema; DeepSeek accepts but cleaner to set in code.)
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
    diet_tags: z.array(DietTag),
    meal_pattern: z.string(),
    notes: BilingualName,
  }),
  glossary_additions: z.array(z.object({
    zh: z.string(),
    en: z.string(),
    alias_zh: z.array(z.string()).optional(),
    alias_en: z.array(z.string()).optional(),
    category: GlossaryCategory,
    notes: z.string().optional(),
  })).default([]),
  markdown_zh: z.string(),
  markdown_en: z.string(),
  commit_message: z.string(),
})

export type AgentOutput = z.infer<typeof ResponseSchema>
