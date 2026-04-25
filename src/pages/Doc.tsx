import { useParams } from 'react-router-dom'
import { getDoc } from '../markdown'
import MarkdownView from '../components/MarkdownView'
import EmptyState from '../components/EmptyState'

/**
 * Generic markdown page for: start/, buy/, pack/, cook/, ai/, ratios/.
 * Catches the rest of `/:lang/*`.
 */
export default function Doc() {
  const { lang, '*': rest } = useParams<{ lang: string; '*': string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const slug = rest?.replace(/\/$/, '') ?? ''
  const doc = getDoc(`${currentLang}/${slug}`)
    ?? getDoc(`${currentLang}/${slug}/index`)

  if (!doc) {
    return (
      <EmptyState
        title={currentLang === 'zh' ? '页面不存在' : 'Page not found'}
        sub={`${currentLang}/${slug}`}
      />
    )
  }
  return <MarkdownView body={doc.body} />
}
