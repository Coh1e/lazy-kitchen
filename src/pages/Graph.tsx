import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { buildGlobalGraph } from '../graph'
import type { NodeKind } from '../graph'
import GlobalGraph from '../components/GlobalGraph'

const KINDS: { kind: NodeKind; zh: string; en: string }[] = [
  { kind: 'dish', zh: '菜品', en: 'Dish' },
  { kind: 'sku', zh: 'SKU', en: 'SKU' },
  { kind: 'sop', zh: 'SOP', en: 'SOP' },
  { kind: 'ratio', zh: '调味公式', en: 'Ratio' },
  { kind: 'hw', zh: '硬件', en: 'Hardware' },
]

export default function Graph() {
  const { lang } = useParams<{ lang: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const t = (en: string, zh: string) => (currentLang === 'en' ? en : zh)
  const graph = useMemo(() => buildGlobalGraph(currentLang), [currentLang])
  const [hidden, setHidden] = useState<Set<NodeKind>>(new Set())

  function toggle(k: NodeKind) {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  return (
    <>
      <div className="section-header">
        <div className="section-header__eyebrow">{t('GRAPH', '依赖图')}</div>
        <h1 className="section-header__title">
          {t('Global dependency graph', '全局依赖图')}
        </h1>
        <p className="section-header__intro">
          {t(
            `Force-directed layout. ${graph.nodes.length} nodes, ${graph.edges.length} edges. Click a dish (yolk) to open its detail page.`,
            `力导向布局。${graph.nodes.length} 个节点 / ${graph.edges.length} 条边。点黄色菜品节点打开详情。`,
          )}
        </p>
      </div>

      <div className="global-graph__filters">
        {KINDS.map((k) => {
          const isHidden = hidden.has(k.kind)
          return (
            <button
              key={k.kind}
              type="button"
              className={`filter-pill global-graph__filter--${k.kind}${isHidden ? '' : ' active'}`}
              onClick={() => toggle(k.kind)}
            >
              <span className="global-graph__filter-swatch" />
              {k[currentLang]}
            </button>
          )
        })}
      </div>

      <GlobalGraph graph={graph} lang={currentLang} hiddenKinds={hidden} />

      <p className="muted" style={{ marginTop: 16 }}>
        {t(
          'Hover any node to see its label; only dish nodes are labeled by default.',
          '悬停查看标签；默认仅菜品节点显示标签。',
        )}
      </p>
    </>
  )
}
