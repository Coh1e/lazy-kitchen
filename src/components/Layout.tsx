import { Outlet, useParams } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const { lang } = useParams<{ lang: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'

  return (
    <div className="app">
      <Topbar lang={currentLang} />
      <div className="layout">
        <Sidebar lang={currentLang} />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
