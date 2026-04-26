import { useParams } from 'react-router-dom'
import { dishes } from '../data'

export default function Cover() {
  const { lang } = useParams<{ lang: string }>()
  const isZh = lang !== 'en'
  const t = (en: string, zh: string) => (isZh ? zh : en)

  const approved = dishes.filter((d) => d.status === 'approved').length
  const proposed = dishes.filter((d) => d.status === 'proposed').length
  const planned = dishes.filter((d) => d.status === 'planned').length

  return (
    <>
      <div className="section-header">
        <div className="section-header__eyebrow">
          🍳 {t('LAZY KITCHEN · v0.2', '懒蛋厨房 · v0.2')}
        </div>
        <h1 className="section-header__title">
          {t('Make Kitchen Great Again.', '让人类拥有世界舌头！')}
        </h1>
        <p className="section-header__intro">
          {t(
            'A structured, AI-curated, minimal-hardware kitchen operating system. Built as a static site + portable CLI skill — no backend, no accounts, no drama.',
            '结构化、AI 化、硬件极简、时间最优的厨房操作系统。静态站点 + 可移植 CLI skill — 无后端、无账户、不折腾。',
          )}
        </p>
      </div>

      <div className="grid-4" style={{ marginTop: 48 }}>
        <div className="stat-card">
          <div className="stat-card__num">10</div>
          <div className="stat-card__label">{t('MVP hardware', '硬件')}</div>
          <div className="stat-card__sub">{t('The locked 10-piece kit', '锁死的 10 件套')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">62</div>
          <div className="stat-card__label">{t('Design tokens', '设计 tokens')}</div>
          <div className="stat-card__sub">{t('Variables + 8 text styles', '变量 + 8 文字样式')}</div>
        </div>
        <div className="stat-card stat-card--proposed">
          <div className="stat-card__num">{approved + proposed}+{planned}</div>
          <div className="stat-card__label">{t('Dishes', '菜品')}</div>
          <div className="stat-card__sub">
            {t(`${approved} approved · ${proposed} proposed · ${planned} planned`,
               `${approved} 已发布 · ${proposed} 待审议 · ${planned} 计划中`)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">Static</div>
          <div className="stat-card__label">{t('Backend', '后端')}</div>
          <div className="stat-card__sub">{t('No server. No accounts. No DB.', '无服务器、无账户、无数据库。')}</div>
        </div>
      </div>

      <h2>{t('Three ways to use this repo', '三种用法')}</h2>
      <div className="grid-3">
        <div className="stat-card">
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-accent-hover)' }}>A.</div>
          <div className="stat-card__label">{t('Read manual', '看手册')}</div>
          <div className="stat-card__sub">
            {t('Open bep.coh1e.com in any browser. Works on phone, tablet, laptop.',
               '浏览器打开 bep.coh1e.com。手机/平板/电脑都能看。')}
          </div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-accent-hover)' }}>B.</div>
          <div className="stat-card__label">{t('Add a dish', '加新菜')}</div>
          <div className="stat-card__sub">
            {t('Run /add-dish in your CLI agent (Cline + DeepSeek recommended for Chinese).',
               'CLI 调 /add-dish（中文推荐 Cline + DeepSeek）')}
          </div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-accent-hover)' }}>C.</div>
          <div className="stat-card__label">{t('Review drafts', '审稿')}</div>
          <div className="stat-card__sub">
            {t('Switch CLI (Codex/Gemini) for cross-family second-opinion audit.',
               '换个 CLI（Codex / Gemini）做跨家族二审。')}
          </div>
        </div>
      </div>
    </>
  )
}
