import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { glossary } from '../data'
import { getDoc } from '../markdown'
import MarkdownView from '../components/MarkdownView'
import TermCard from '../components/TermCard'

export default function Glossary() {
  const { lang } = useParams<{ lang: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const t = (en: string, zh: string) => (currentLang === 'en' ? en : zh)
  const doc = getDoc(`${currentLang}/glossary`)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')

  const cats = useMemo(() => {
    const set = new Set<string>()
    glossary.forEach((x) => x.category && set.add(x.category))
    return ['all', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const norm = q.toLowerCase()
    return glossary.filter((x) => {
      if (cat !== 'all' && x.category !== cat) return false
      if (!q) return true
      const haystack = [
        x.zh, x.en,
        ...(x.alias_zh ?? []), ...(x.alias_en ?? []),
        x.notes ?? '',
      ].join(' ').toLowerCase()
      return haystack.includes(norm)
    })
  }, [q, cat])

  return (
    <>
      {doc && <MarkdownView body={doc.body} />}

      <div className="search" style={{ maxWidth: '100%' }}>
        <span className="muted">⌕</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('Search terms… (zh or en)', '搜索术语… (中或英)')}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
        {cats.map((c) => (
          <a
            key={c}
            href="#"
            onClick={(e) => { e.preventDefault(); setCat(c) }}
            className={`filter-pill${c === cat ? ' active' : ''}`}
          >
            {c}
          </a>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map((term, i) => <TermCard key={`${term.zh}-${i}`} term={term} />)}
      </div>
    </>
  )
}
