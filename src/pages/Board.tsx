import { useParams } from 'react-router-dom'
import { dishes } from '../data'
import { getDoc } from '../markdown'
import MarkdownView from '../components/MarkdownView'
import DishCard from '../components/DishCard'
import EmptyState from '../components/EmptyState'

export default function Board() {
  const { lang, view } = useParams<{ lang: string; view?: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const t = (en: string, zh: string) => (currentLang === 'en' ? en : zh)
  const which = view ?? 'index'

  const proposed = dishes.filter((d) => d.status === 'proposed')
  const approved = dishes.filter((d) => d.status === 'approved')
  const planned = dishes.filter((d) => d.status === 'planned')

  // Doc for this board page (board/proposed.md, board/recent.md, etc.)
  const doc = getDoc(`${currentLang}/board/${which}`)

  return (
    <>
      {doc && <MarkdownView body={doc.body} />}

      <div className="grid-4" style={{ marginTop: 32 }}>
        <div className="stat-card stat-card--approved">
          <div className="stat-card__num">{approved.length}</div>
          <div className="stat-card__label">{t('Approved', '已发布')}</div>
          <div className="stat-card__sub">{t('this week', '本周')}</div>
        </div>
        <div className="stat-card stat-card--proposed">
          <div className="stat-card__num">{proposed.length}</div>
          <div className="stat-card__label">{t('Proposed', '待审议')}</div>
          <div className="stat-card__sub">{t('in review', '征集反馈')}</div>
        </div>
        <div className="stat-card stat-card--muted">
          <div className="stat-card__num">{planned.length}</div>
          <div className="stat-card__label">{t('Planned', '路线图')}</div>
          <div className="stat-card__sub">{t('roadmap', '占位中')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">—</div>
          <div className="stat-card__label">{t('Comments', '评论')}</div>
          <div className="stat-card__sub">{t('via Giscus', '由 Giscus 收集')}</div>
        </div>
      </div>

      {/* All 3 sections always shown; `which` only chooses which doc loads on top. */}
      <Section
        title={t('🍳 Proposed', '🍳 待审议')}
        items={proposed}
        lang={currentLang}
        empty={t('No active proposals right now.', '当前没有待审议菜品。')}
      />
      <Section
        title={t('✅ Approved', '✅ 已发布')}
        items={approved}
        lang={currentLang}
        empty={t('No approved dishes yet.', '暂无已发布菜品。')}
      />
      <Section
        title={t('📋 Planned (roadmap)', '📋 路线图')}
        items={planned}
        lang={currentLang}
        empty={t('Roadmap empty.', '路线图为空。')}
      />
    </>
  )
}

function Section({
  title, items, lang, empty,
}: {
  title: string
  items: typeof dishes
  lang: 'zh' | 'en'
  empty: string
}) {
  return (
    <>
      <h2>
        {title} <span className="muted" style={{ fontSize: '0.6em', fontWeight: 500 }}>
          ({items.length})
        </span>
      </h2>
      {items.length === 0 ? (
        <EmptyState title={empty} sub={lang === 'zh' ? '稍后再来。' : 'Check back later.'} />
      ) : (
        <div className="grid-3">
          {items.map((d) => <DishCard key={d.id} dish={d} lang={lang} />)}
        </div>
      )}
    </>
  )
}
