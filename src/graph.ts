import {
  type Dish, type SKU, type SOP, type Ratio,
  dishes, skus, sops, ratios,
  findSku, findSop, findRatio, findHardware,
  dishIdToSlug,
} from './data'

export type NodeKind = 'dish' | 'sku' | 'sop' | 'ratio' | 'hw'

export interface TreeNode {
  id: string
  kind: NodeKind
  label: string
  sub?: string
  children?: TreeNode[]
}

export interface FlatNode {
  id: string
  kind: NodeKind
  label: string
  status?: string
  href?: string
}

export interface FlatEdge {
  source: string
  target: string
  kind: 'uses' | 'pack' | 'use' | 'parent' | 'equipment'
}

export interface FlatGraph {
  nodes: FlatNode[]
  edges: FlatEdge[]
}

const labelOf = <T extends { name?: { zh: string; en: string } }>(
  obj: T | null,
  fallback: string,
  lang: 'zh' | 'en',
) => obj?.name?.[lang] ?? obj?.name?.en ?? fallback

/* ───────────────────────────── Per-dish tree ───────────────────────────── */

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

  root.children!.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id))
  return root
}

/* ───────────────────────────── Global flat graph ───────────────────────────── */

/**
 * Walk all dishes + SKUs + SOPs + Ratios and emit a deduped node/edge graph.
 * Used by /graph page (force-directed layout).
 */
export function buildGlobalGraph(lang: 'zh' | 'en'): FlatGraph {
  const nodeMap = new Map<string, FlatNode>()
  const edges: FlatEdge[] = []

  function add(node: FlatNode) {
    if (!nodeMap.has(node.id)) nodeMap.set(node.id, node)
  }

  for (const d of dishes) {
    add({
      id: d.id,
      kind: 'dish',
      label: labelOf(d, d.id, lang),
      status: d.status,
      href: `/${lang}/compose/${dishIdToSlug(d.id)}`,
    })
    for (const skuId of d.uses?.sku ?? []) {
      edges.push({ source: d.id, target: skuId, kind: 'uses' })
    }
    for (const sopId of d.uses?.sop ?? []) {
      edges.push({ source: d.id, target: sopId, kind: 'uses' })
    }
    for (const ratioId of d.uses?.ratio ?? []) {
      edges.push({ source: d.id, target: ratioId, kind: 'uses' })
    }
  }

  for (const sku of skus) {
    add({ id: sku.id, kind: 'sku', label: labelOf(sku, sku.id, lang) })
    if (sku.packaging_sop) edges.push({ source: sku.id, target: sku.packaging_sop, kind: 'pack' })
    for (const sopId of sku.use_sop ?? []) {
      edges.push({ source: sku.id, target: sopId, kind: 'use' })
    }
  }

  for (const sop of sops) {
    add({ id: sop.id, kind: 'sop', label: labelOf(sop, sop.id, lang) })
    for (const hwId of sop.equipment_required ?? sop.hardware ?? []) {
      add({
        id: hwId,
        kind: 'hw',
        label: findHardware(hwId)?.name?.[lang] ?? hwId,
      })
      edges.push({ source: sop.id, target: hwId, kind: 'equipment' })
    }
  }

  for (const r of ratios) {
    add({ id: r.id, kind: 'ratio', label: labelOf(r, r.id, lang) })
    if (r.parent) edges.push({ source: r.id, target: r.parent, kind: 'parent' })
  }

  // Drop edges whose target node is unknown (avoid d3-force exceptions)
  const valid = edges.filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))

  return { nodes: Array.from(nodeMap.values()), edges: valid }
}
