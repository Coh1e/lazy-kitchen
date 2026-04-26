import { useEffect, useMemo, useRef, useState } from 'react'
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide,
  type Simulation, type SimulationNodeDatum, type SimulationLinkDatum,
} from 'd3-force'
import { useNavigate } from 'react-router-dom'
import type { FlatGraph, FlatNode, NodeKind } from '../graph'

interface SimNode extends SimulationNodeDatum, FlatNode {}
interface SimLink extends SimulationLinkDatum<SimNode> {
  kind: string
}

interface Props {
  graph: FlatGraph
  lang: 'zh' | 'en'
  height?: number
  /** Hide nodes whose kind is in this set (live filter). */
  hiddenKinds?: Set<NodeKind>
}

export default function GlobalGraph({ graph, lang: _lang, height = 720, hiddenKinds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(960)
  const [, setTick] = useState(0)
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null)
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      setWidth(Math.max(360, entries[0].contentRect.width))
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Filtered nodes/edges based on hiddenKinds
  const visible = useMemo(() => {
    const hidden = hiddenKinds ?? new Set<NodeKind>()
    const nodes = graph.nodes.filter((n) => !hidden.has(n.kind))
    const ids = new Set(nodes.map((n) => n.id))
    const edges = graph.edges.filter((e) =>
      ids.has(typeof e.source === 'string' ? e.source : (e.source as SimNode).id)
      && ids.has(typeof e.target === 'string' ? e.target : (e.target as SimNode).id),
    )
    return { nodes, edges }
  }, [graph, hiddenKinds])

  // Build sim nodes (preserve positions across re-runs by keeping refs)
  const simNodes = useMemo<SimNode[]>(
    () => visible.nodes.map((n) => ({ ...n })),
    [visible],
  )
  const simLinks = useMemo<SimLink[]>(
    () => visible.edges.map((e) => ({ source: e.source, target: e.target, kind: e.kind })),
    [visible],
  )

  // Run simulation
  useEffect(() => {
    if (simNodes.length === 0) return

    const cx = width / 2
    const cy = height / 2

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(70)
          .strength(0.4),
      )
      .force('charge', forceManyBody<SimNode>().strength(-180))
      .force('center', forceCenter<SimNode>(cx, cy))
      .force('collide', forceCollide<SimNode>(28))
      .alpha(1)
      .alphaDecay(0.025)
      .on('tick', () => setTick((t) => t + 1))

    simRef.current = sim
    return () => { sim.stop(); simRef.current = null }
  }, [simNodes, simLinks, width, height])

  return (
    <div className="global-graph" ref={containerRef}>
      <svg width={width} height={height} className="global-graph__svg">
        <g>
          {simLinks.map((l, i) => {
            const s = l.source as SimNode
            const t = l.target as SimNode
            if (!s.x || !t.x) return null
            return (
              <line
                key={i}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                className="global-graph__edge"
              />
            )
          })}
          {simNodes.map((n) => {
            if (!n.x) return null
            const r = n.kind === 'dish' ? 9 : n.kind === 'sop' || n.kind === 'sku' ? 7 : 5
            const showLabel = hover === n.id || n.kind === 'dish'
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                className={`global-graph__node global-graph__node--${n.kind}`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => n.href && navigate(n.href)}
              >
                <circle r={r} className="global-graph__node-circle" />
                {showLabel && (
                  <text
                    x={r + 4}
                    y={4}
                    className="global-graph__node-label"
                  >
                    {n.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
