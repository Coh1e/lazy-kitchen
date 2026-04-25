interface Props {
  lang: 'zh' | 'en'
}

export default function Topbar({ lang }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__brand">LAZY KITCHEN</div>
      <nav className="lang-switch">
        <a href="#/zh/cover" className={lang === 'zh' ? 'active' : ''}>ZH</a>
        <span> · </span>
        <a href="#/en/cover" className={lang === 'en' ? 'active' : ''}>EN</a>
      </nav>
    </header>
  )
}
