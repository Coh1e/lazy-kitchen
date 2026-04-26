import { useParams } from 'react-router-dom'
import { getDoc } from '../markdown'
import { findDishBySlug } from '../data'
import MarkdownView from '../components/MarkdownView'
import GiscusBlock from '../components/GiscusBlock'
import DepGraph from '../components/DepGraph'
import EmptyState from '../components/EmptyState'

export default function Compose() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  const currentLang = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en'
  const doc = getDoc(`${currentLang}/compose/${slug}`)
  const dish = slug ? findDishBySlug(slug) : null

  if (!doc) {
    return (
      <EmptyState
        title={currentLang === 'zh' ? '没找到这道菜' : 'Dish not found'}
        sub={`compose/${slug}`}
      />
    )
  }

  return (
    <>
      <MarkdownView body={doc.body} />
      {dish && <DepGraph dish={dish} lang={currentLang} />}
      <GiscusBlock termId={slug ?? ''} lang={currentLang} />
    </>
  )
}
