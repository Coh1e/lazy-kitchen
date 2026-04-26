import {
  type Dish, type SKU, type SOP, type Ratio,
  findSku, findSop, findRatio, findHardware,
} from './data'

export type NodeKind = 'dish' | 'sku' | 'sop' | 'ratio' | 'hw'

export interface TreeNode {
  id: string
  kind: NodeKind
  label: string
  sub?: string
  children?: TreeNode[]
}

const labelOf = <T extends { name?: { zh: string; en: string } }>(
  obj: T | null,
  fallback: string,
  lang: 'zh' | 'en',
) => obj?.name?.[lang] ?? obj?.name?.en ?? fallback

function skuChildren(sku: SKU | null, lang: 'zh' | 'en'): TreeNode[] {
  if (!sku) return []
  const children: TreeNode[] = []
  if (sku.packaging_sop) {
    const sop = findSop(sku.packaging_sop)
    children.push({
      id: sku.packaging_sop,
      kind: 'sop',
      label: labelOf(sop, sku.packaging_sop, lang),
      sub: 'pack',
    })
  }
  for (const sopId of sku.use_sop ?? []) {
    const sop = findSop(sopId)
    children.push({
      id: sopId,
      kind: 'sop',
      label: labelOf(sop, sopId, lang),
      sub: 'use',
    })
  }
  return children
}

function sopChildren(sop: SOP | null, lang: 'zh' | 'en'): TreeNode[] {
  if (!sop) return []
  const out: TreeNode[] = []
  for (const hwId of sop.equipment_required ?? sop.hardware ?? []) {
    const hw = findHardware(hwId)
    out.push({
      id: hwId,
      kind: 'hw',
      label: labelOf(hw, hwId, lang),
      sub: hw?.is_mvp ? 'MVP' : undefined,
    })
  }
  return out
}

function ratioChildren(ratio: Ratio | null, lang: 'zh' | 'en'): TreeNode[] {
  if (!ratio) return []
  const out: TreeNode[] = []
  if (ratio.parent) {
    const parent = findRatio(ratio.parent)
    out.push({
      id: ratio.parent,
      kind: 'ratio',
      label: labelOf(parent, ratio.parent, lang),
      sub: 'mother',
    })
  }
  return out
}

/**
 * Build the dependency tree rooted at a dish.
 * Depth: dish → (SKU/SOP/Ratio) → (SOP/equipment/parent-ratio).
 */
export function buildTree(dish: Dish, lang: 'zh' | 'en'): TreeNode {
  const root: TreeNode = {
    id: dish.id,
    kind: 'dish',
    label: labelOf(dish, dish.id, lang),
    sub: `${dish.cuisine?.country ?? ''}${dish.cuisine?.region ? ' · ' + dish.cuisine.region : ''}`,
    children: [],
  }

  for (const skuId of dish.uses?.sku ?? []) {
    const sku = findSku(skuId)
    root.children!.push({
      id: skuId,
      kind: 'sku',
      label: labelOf(sku, skuId, lang),
      sub: sku?.type,
      children: skuChildren(sku, lang),
    })
  }
  for (const sopId of dish.uses?.sop ?? []) {
    const sop = findSop(sopId)
    root.children!.push({
      id: sopId,
      kind: 'sop',
      label: labelOf(sop, sopId, lang),
      sub: sop?.cooking_method,
      children: sopChildren(sop, lang),
    })
  }
  for (const ratioId of dish.uses?.ratio ?? []) {
    const ratio = findRatio(ratioId)
    root.children!.push({
      id: ratioId,
      kind: 'ratio',
      label: labelOf(ratio, ratioId, lang),
      sub: ratio?.is_mother ? 'mother' : undefined,
      children: ratioChildren(ratio, lang),
    })
  }

  // Sort children for stable rendering
  root.children!.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id))
  return root
}
