import dishesYaml from '../data/dishes.yaml'
import glossaryYaml from '../data/glossary.yaml'

export type DishStatus =
  | 'planned' | 'draft' | 'proposed' | 'review' | 'approved' | 'deprecated'

export interface BilingualName {
  zh: string
  en: string
}

export interface Dish {
  id: string
  name: BilingualName
  cuisine: { country: string; region?: string }
  status: DishStatus
  uses?: { sku?: string[]; sop?: string[]; ratio?: string[] }
  fresh_ingredients?: Array<{
    name: BilingualName
    amount?: number | string
    unit?: string | BilingualName
  }>
  yield?: { servings?: number }
  time?: { prep_min?: number; hands_on_min?: number; unattended_min?: number; total_min?: number }
  flavor_tags?: string[]
  diet_tags?: string[]
  meal_pattern?: string
  notes?: string | BilingualName
  planned_skus?: string[]
  planned_sops?: string[]
}

export interface GlossaryEntry {
  zh: string
  en: string
  alias_zh?: string[]
  alias_en?: string[]
  category?: string
  notes?: string
  do_not_translate_as?: string[]
}

const dishesData = dishesYaml as { items: Dish[] }
const glossaryData = glossaryYaml as { terms: GlossaryEntry[] }

export const dishes: Dish[] = dishesData.items
export const glossary: GlossaryEntry[] = glossaryData.terms
