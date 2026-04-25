import { NavLink } from 'react-router-dom'

interface Props {
  lang: 'zh' | 'en'
  onNavigate?: () => void
}

interface Section {
  heading: { zh: string; en: string }
  links: Array<{ path: string; zh: string; en: string }>
}

const sections: Section[] = [
  {
    heading: { zh: '开始', en: 'Start' },
    links: [
      { path: 'start/philosophy', zh: '理念', en: 'Philosophy' },
      { path: 'start/workflow', zh: '使用循环', en: 'Workflow' },
      { path: 'start/hardware', zh: '硬件', en: 'Hardware' },
      { path: 'start/pantry-layers', zh: '储藏分层', en: 'Pantry layers' },
      { path: 'start/heat-and-oil', zh: '火候与油温', en: 'Heat & oil' },
      { path: 'start/safety', zh: '食品安全', en: 'Safety' },
    ],
  },
  {
    heading: { zh: '采买', en: 'Buy' },
    links: [
      { path: 'buy/buying-guide', zh: '采购总论', en: 'Buying guide' },
      { path: 'buy/ingredients', zh: '基础食材', en: 'Ingredients' },
      { path: 'buy/fresh-aromatics', zh: '生鲜香辛', en: 'Fresh aromatics' },
      { path: 'buy/condiments', zh: '基础调料', en: 'Condiments' },
      { path: 'buy/dry-pantry', zh: '干货母库', en: 'Dry pantry' },
      { path: 'buy/hardware-guide', zh: '硬件指南', en: 'Hardware guide' },
      { path: 'buy/consumables-guide', zh: '耗材指南', en: 'Consumables' },
    ],
  },
  {
    heading: { zh: '预制 — SKUs', en: 'Pack — SKUs' },
    links: [
      { path: 'pack/index', zh: 'SKU 货架', en: 'SKU shelf' },
      { path: 'pack/packaging-guide', zh: '分装指南', en: 'Packaging guide' },
      { path: 'pack/dry/canton-clear-beef', zh: '⭐ 广式清汤牛腩包', en: '⭐ Cantonese clear beef' },
    ],
  },
  {
    heading: { zh: '工艺 — SOPs', en: 'Cook — SOPs' },
    links: [
      { path: 'cook/index', zh: 'SOP 总览', en: 'SOP overview' },
      { path: 'cook/mise-en-place', zh: '备菜纪律', en: 'Mise en place' },
      { path: 'cook/doneness', zh: '断生判断', en: 'Doneness' },
      { path: 'cook/canton-clear-beef', zh: '广式清汤牛腩 SOP', en: 'Cantonese clear beef' },
    ],
  },
  {
    heading: { zh: '菜品组合', en: 'Compose' },
    links: [
      { path: 'compose/canton-clear-beef-noodles', zh: '清汤牛腩粉', en: 'Cantonese clear beef noodles' },
      { path: 'compose/tomato-eggs', zh: '番茄炒蛋', en: 'Tomato and eggs' },
    ],
  },
  {
    heading: { zh: '调味公式 & 词典', en: 'Ratios & Glossary' },
    links: [
      { path: 'ratios/index', zh: '调味公式', en: 'Ratios' },
      { path: 'glossary', zh: '中英术语', en: 'Glossary' },
    ],
  },
  {
    heading: { zh: '🪧 告示栏', en: '🪧 Bulletin Board' },
    links: [
      { path: 'board/index', zh: '总览', en: 'Overview' },
      { path: 'board/proposed', zh: '待审议', en: 'Proposed' },
      { path: 'board/recent', zh: '最近发布', en: 'Recently approved' },
      { path: 'board/contributing', zh: '怎么参与', en: 'How to participate' },
    ],
  },
  {
    heading: { zh: 'AI', en: 'AI' },
    links: [
      { path: 'ai/how-it-works', zh: 'AI 工作流', en: 'How it works' },
      { path: 'ai/choose-your-ai', zh: '选你的 AI', en: 'Choose your AI' },
      { path: 'ai/using-claude-code', zh: '用 Claude Code', en: 'Using Claude Code' },
    ],
  },
]

export default function Sidebar({ lang, onNavigate }: Props) {
  return (
    <nav>
      {sections.map((s) => (
        <div key={s.heading.en}>
          <h3>{s.heading[lang]}</h3>
          <ul>
            {s.links.map((l) => (
              <li key={l.path}>
                <NavLink
                  to={`/${lang}/${l.path}`}
                  end
                  onClick={onNavigate}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {l[lang]}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
