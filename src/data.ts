import dishesYaml from '../data/dishes.yaml'
import glossaryYaml from '../data/glossary.yaml'
import sopYaml from '../data/sop.yaml'
import ratiosYaml from '../data/ratios.yaml'
import hardwareYaml from '../data/hardware.yaml'
import skuDryYaml from '../data/sku/dry.yaml'
import skuWetYaml from '../data/sku/wet.yaml'
import skuCookedYaml from '../data/sku/cooked.yaml'
import skuSoupYaml from '../data/sku/soup.yaml'
import skuReadyYaml from '../data/sku/ready.yaml'

export type DishStatus =
  | 'planned' | 'draft' | 'proposed' | 'review' | 'approved' | 'deprecated'

export interface BilingualName { zh: string; en: string }

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
  hardware_required?: string[]
  hardware_extension?: string[]
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

export interface SOP {
  id: string
  name: BilingualName
  category?: string
  cooking_method?: string
  station?: string
  time_tier?: string
  equipment_required?: string[]
  cut_required?: string[]
  hardware?: string[]
}

export interface SKU {
  id: string
  type: 'DRY' | 'WET' | 'COOKED' | 'SOUP' | 'READY'
  name: BilingualName
  flavor_tags?: string[]
  packaging_sop?: string
  use_sop?: string[]
}

export interface Ratio {
  id: string
  name: BilingualName
  is_mother?: boolean
  parent?: string | null
  daughters?: string[]
}

export interface Hardware {
  id: string
  name: BilingualName
  category?: string
  is_mvp?: boolean
}

export const dishes: Dish[] = (dishesYaml as { items: Dish[] }).items
export const glossary: GlossaryEntry[] = (glossaryYaml as { terms: GlossaryEntry[] }).terms
export const sops: SOP[] = (sopYaml as { items: SOP[] }).items
export const ratios: Ratio[] = (ratiosYaml as { ratios: Ratio[] }).ratios
export const hardware: Hardware[] = (hardwareYaml as { items: Hardware[] }).items

export const skus: SKU[] = [
  ...((skuDryYaml as { items: SKU[] }).items ?? []),
  ...((skuWetYaml as { items: SKU[] }).items ?? []),
  ...((skuCookedYaml as { items: SKU[] }).items ?? []),
  ...((skuSoupYaml as { items: SKU[] }).items ?? []),
  ...((skuReadyYaml as { items: SKU[] }).items ?? []),
]

/** Convert a dish ID like `DISH-CN-TOMATO-EGGS` to URL slug `cn-tomato-eggs`. */
export function dishIdToSlug(id: string): string {
  return id.toLowerCase().replace(/^dish-/, '').replace(/_/g, '-')
}

/** Reverse: find dish by URL slug. */
export function findDishBySlug(slug: string): Dish | null {
  const target = slug.toLowerCase()
  return dishes.find((d) => dishIdToSlug(d.id) === target) ?? null
}

export function findSku(id: string): SKU | null {
  return skus.find((s) => s.id === id) ?? null
}

export function findSop(id: string): SOP | null {
  return sops.find((s) => s.id === id) ?? null
}

export function findRatio(id: string): Ratio | null {
  return ratios.find((r) => r.id === id) ?? null
}

export function findHardware(id: string): Hardware | null {
  return hardware.find((h) => h.id === id) ?? null
}
