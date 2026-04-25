import Giscus from '@giscus/react'
import { REPO, GISCUS_REPO_ID, GISCUS_CATEGORY, GISCUS_CATEGORY_ID } from '../config'

interface Props {
  termId: string
  lang: 'zh' | 'en'
}

export default function GiscusBlock({ termId, lang }: Props) {
  return (
    <div className="giscus-wrapper">
      <Giscus
        repo={REPO as `${string}/${string}`}
        repoId={GISCUS_REPO_ID}
        category={GISCUS_CATEGORY}
        categoryId={GISCUS_CATEGORY_ID}
        mapping="specific"
        term={termId}
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang={lang === 'en' ? 'en' : 'zh-CN'}
        loading="lazy"
      />
    </div>
  )
}
