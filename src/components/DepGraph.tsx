import { useMemo, useRef, useState, useEffect } from 'react'
import { hierarchy, tree, type HierarchyPointNode } from 'd3-hierarchy'
import type { Dish } from '../data'
import { buildTree, type TreeNode } from '../graph'

interface Props {
  dish: Dish
  lang: 'zh' | 'en'
}

const NODE_W = 160
const NODE_H = 44
const V_GAP = 90  // vertical distance per level

export default function DepGraph({ dish, lang }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((entries) => {
      setWidth(Math.max(320, entries[0].contentRect.width))
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const { nodes, links, height } = useMemo(() => {
    const data = buildTree(dish, lang)
    const root = hierarchy<TreeNode>(data)
    const depth = root.height
    const layout = tree<TreeNode>().size([width - NODE_W, depth * V_GAP])
    layout(root)
    return {
      nodes: root.descendants() as HierarchyPointNode<TreeNode>[],
      links: root.links() as Array<{ source: HierarchyPointNode<TreeNode>; target: HierarchyPointNode<TreeNode> }>,
      height: depth * V_GAP + NODE_H + 32,
    }
  }, [dish, lang, width])

  // Empty tree (dish with no uses) — show hint
  if (nodes.length <= 1) {
    return (
      <div className="dep-graph dep-graph--empty">
        <div className="dep-graph__title">{t('Dependency graph', '依赖图')}</div>
        <p className="muted">
          {t(
            `${dish.name?.[lang] ?? dish.id} has no SKU/SOP/Ratio dependencies.`,
            `${dish.name?.[lang] ?? dish.id} 无 SKU/SOP/Ratio 依赖。`,
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="dep-graph" ref={ref}>
      <div className="dep-graph__title">{t('Dependency graph', '依赖图')}</div>
      <svg width={width} height={height} className="dep-graph__svg">
        <g transform={`translate(${NODE_W / 2}, ${NODE_H / 2 + 8})`}>
          {links.map((l, i) => {
            // Vertical S-curve via cubic bezier
            const sx = l.source.x, sy = l.source.y
            const tx = l.target.x, ty = l.target.y
            const my = (sy + ty) / 2
            const d = `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`
            return <path key={i} d={d} className="dep-graph__edge" />
          })}
          {nodes.map((n) => (
            <g
              key={n.data.id}
              transform={`translate(${n.x - NODE_W / 2},${n.y - NODE_H / 2})`}
              className={`dep-graph__node dep-graph__node--${n.data.kind}`}
            >
              <rect width={NODE_W} height={NODE_H} rx={6} className="dep-graph__node-bg" />
              <text x={NODE_W / 2} y={NODE_H / 2 - 2} className="dep-graph__node-label">
                {truncate(n.data.label, 16)}
              </text>
              <text x={NODE_W / 2} y={NODE_H / 2 + 12} className="dep-graph__node-sub">
                {n.data.kind.toUpperCase()}{n.data.sub ? ` · ${n.data.sub}` : ''}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <Legend lang={lang} />
    </div>
  )
}

function Legend({ lang }: { lang: 'zh' | 'en' }) {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh)
  const items = [
    { kind: 'dish', label: t('Dish', '菜品') },
    { kind: 'sku', label: t('SKU pack', 'SKU 包') },
    { kind: 'sop', label: t('SOP procedure', 'SOP 工艺') },
    { kind: 'ratio', label: t('Ratio formula', 'Ratio 调味公式') },
    { kind: 'hw', label: t('Hardware', '硬件') },
  ]
  return (
    <div className="dep-graph__legend">
      {items.map((i) => (
        <span key={i.kind} className={`dep-graph__legend-item dep-graph__node--${i.kind}`}>
          <span className="dep-graph__legend-swatch" />
          {i.label}
        </span>
      ))}
    </div>
  )
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n - 1) + '…'
}
