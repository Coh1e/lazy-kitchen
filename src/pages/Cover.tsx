import { useParams } from 'react-router-dom'
import { dishes, glossary } from '../data'

export default function Cover() {
  const { lang } = useParams<{ lang: string }>()
  const isZh = lang !== 'en'
  return (
    <section className="cover">
      <h1 className="section-header__title">
        {isZh ? '让人类拥有世界舌头' : 'Make Kitchen Great Again'}
      </h1>
      <div className="stats">
        <div className="stat-card">
          <div className="stat-card__value">{dishes.length}</div>
          <div className="stat-card__label">{isZh ? '菜品' : 'Dishes'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{glossary.length}</div>
          <div className="stat-card__label">{isZh ? '术语' : 'Glossary terms'}</div>
        </div>
      </div>
      <p className="phase-banner">
        {isZh
          ? '🚧 Phase 1 骨架 — Vite + React + HashRouter；更多页面正在迁移中'
          : '🚧 Phase 1 skeleton — Vite + React + HashRouter; more pages incoming'}
      </p>
    </section>
  )
}
