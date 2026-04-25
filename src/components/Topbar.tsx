import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  lang: 'zh' | 'en'
  onHamburger: () => void
}

export default function Topbar({ lang, onHamburger }: Props) {
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search')?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQ(v)
    const trimmed = v.trim()
    if (trimmed) {
      navigate(`/${lang}/search?q=${encodeURIComponent(trimmed)}`, { replace: true })
    } else if (location.pathname.includes('/search')) {
      navigate(`/${lang}/cover`, { replace: true })
    }
  }

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <span className="topbar__hamburger" onClick={onHamburger}>☰</span>
        <span className="topbar__brand">LAZY KITCHEN</span>
        <span className="topbar__tag">/ {t('Make Kitchen Great Again', '让人类拥有世界舌头')}</span>
        <span className="topbar__spacer" />
        <span className="lang-switch">
          <a className={lang === 'zh' ? 'active' : ''} href="#/zh/cover">ZH</a>
          <span className="sep">·</span>
          <a className={lang === 'en' ? 'active' : ''} href="#/en/cover">EN</a>
        </span>
        <div className="search">
          <span className="muted">⌕</span>
          <input
            id="search"
            type="search"
            value={q}
            onChange={onChange}
            placeholder={t('Search dishes, SKUs, SOPs…', '搜索菜、SKU、SOP…')}
          />
          <span className="search-kbd">⌘K</span>
        </div>
      </div>
    </header>
  )
}
