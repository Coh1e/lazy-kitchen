interface Props {
  lang: 'zh' | 'en'
}

export default function Sidebar({ lang }: Props) {
  const t = lang === 'zh'
    ? { start: '开始', cover: '封面' }
    : { start: 'Start', cover: 'Cover' }
  return (
    <aside className="sidebar">
      <h3>{t.start}</h3>
      <ul>
        <li><a href={`#/${lang}/cover`}>{t.cover}</a></li>
      </ul>
    </aside>
  )
}
