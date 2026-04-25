import { Outlet, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import { REPO } from '../config'

export default function Layout() {
  const { lang } = useParams<{ lang: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const [drawerOpen, setDrawerOpen] = useState(false)

  // close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [lang])

  return (
    <>
      <Topbar lang={currentLang} onHamburger={() => setDrawerOpen((v) => !v)} />
      <div className="layout">
        <div className={`sidebar ${drawerOpen ? 'open' : ''}`}>
          <Sidebar lang={currentLang} onNavigate={() => setDrawerOpen(false)} />
        </div>
        <main onClick={() => drawerOpen && setDrawerOpen(false)}>
          <Outlet />
        </main>
      </div>
      <footer className="bottom">
        <a href={`https://github.com/${REPO}`}>GitHub</a> · MIT License ·{' '}
        <span className="muted">Vite + React · Figma-mirrored design</span>
      </footer>
    </>
  )
}
