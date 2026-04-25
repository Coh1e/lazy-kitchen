import type { GlossaryEntry } from '../data'

interface Props {
  term: GlossaryEntry
}

export default function TermCard({ term }: Props) {
  const isPitfall = !!(term.do_not_translate_as && term.do_not_translate_as.length)
  const aliasParts: string[] = []
  if (term.alias_zh?.length) aliasParts.push(`zh: ${term.alias_zh.join(', ')}`)
  if (term.alias_en?.length) aliasParts.push(`en: ${term.alias_en.join(', ')}`)

  return (
    <div className={`term-card${isPitfall ? ' pitfall' : ''}`}>
      <div className="term-card__top">
        <span className="term-card__category">{term.category ?? 'TERM'}</span>
        {isPitfall && <span className="term-card__warn">⚠ PITFALL</span>}
      </div>
      <div className="term-card__zh">{term.zh}</div>
      <div className="term-card__en">{term.en}</div>
      {aliasParts.length > 0 && (
        <div className="term-card__alias">alias · {aliasParts.join(' · ')}</div>
      )}
      {isPitfall && (
        <div className="term-card__pitfall">
          ✗ never: "{term.do_not_translate_as!.join(', ')}"
        </div>
      )}
    </div>
  )
}
