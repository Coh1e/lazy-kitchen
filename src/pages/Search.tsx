import { useSearchParams, useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { dishes, glossary } from '../data'
import { listDocs } from '../markdown'

export default function Search() {
  const { lang } = useParams<{ lang: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim()

  const hits = useMemo(() => {
    if (!q) return [] as Array<{ to: string; title: string; sub: string }>
    const norm = q.toLowerCase()
    const out: Array<{ to: string; title: string; sub: string }> = []

    // dishes
    for (const d of dishes) {
      const name = d.name?.[currentLang] ?? d.name?.en ?? d.id
      const altName = d.name?.en ?? ''
      const idLow = d.id.toLowerCase()
      if (
        name.toLowerCase().includes(norm) ||
        altName.toLowerCase().includes(norm) ||
        idLow.includes(norm)
      ) {
        const slug = d.id.toLowerCase().replace(/^dish-/, '').replace(/_/g, '-')
        out.push({ to: `/${currentLang}/compose/${slug}`, title: name, sub: d.id })
      }
    }
    // docs
    for (const p of listDocs(currentLang)) {
      if (
        p.title.toLowerCase().includes(norm) ||
        p.slug.toLowerCase().includes(norm) ||
        p.body.toLowerCase().includes(norm)
      ) {
        out.push({ to: `/${p.slug}`, title: p.title, sub: p.slug })
      }
    }
    // glossary
    for (const t of glossary) {
      if (
        t.zh.toLowerCase().includes(norm) ||
        t.en.toLowerCase().includes(norm) ||
        (t.alias_en ?? []).some((a) => a.toLowerCase().includes(norm)) ||
        (t.alias_zh ?? []).some((a) => a.toLowerCase().includes(norm))
      ) {
        out.push({ to: `/${currentLang}/glossary`, title: `${t.zh} / ${t.en}`, sub: t.category ?? 'term' })
      }
    }
    return out.slice(0, 50)
  }, [q, currentLang])

  return (
    <>
      <h1>
        {currentLang === 'zh' ? '搜索 / Search' : 'Search'}: <code>{q}</code>
      </h1>
      <p className="muted">
        {currentLang === 'zh' ? `${hits.length} 条结果` : `${hits.length} results`}
      </p>
      <div className="grid-2">
        {hits.map((h, i) => (
          <Link key={i} to={h.to} className="dish-card">
            <h3 className="dish-card__title">{h.title}</h3>
            <div className="dish-card__id">{h.sub}</div>
          </Link>
        ))}
      </div>
    </>
  )
}
