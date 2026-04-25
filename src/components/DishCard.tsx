import { Link } from 'react-router-dom'
import type { Dish } from '../data'
import StatusBadge from './StatusBadge'
import Chip from './Chip'

interface Props {
  dish: Dish
  lang: 'zh' | 'en'
}

export default function DishCard({ dish, lang }: Props) {
  const altLang = lang === 'zh' ? 'en' : 'zh'
  const name = dish.name?.[lang] ?? dish.name?.en ?? dish.id
  const altName = dish.name?.[altLang] ?? ''
  const cuisine = `${dish.cuisine?.country ?? '?'}${dish.cuisine?.region ? ' · ' + dish.cuisine.region : ''}`
  const handsOn = dish.time?.hands_on_min
  const totalMin = dish.time?.total_min
  const skuId = dish.uses?.sku?.[0] ?? dish.planned_skus?.[0] ?? '—'
  const tags = (dish.flavor_tags ?? []).slice(0, 4)
  const slug = dish.id.toLowerCase().replace(/^dish-/, '').replace(/_/g, '-')

  return (
    <Link className="dish-card" to={`/${lang}/compose/${slug}`}>
      <div className="dish-card__top">
        <StatusBadge status={dish.status} />
        <Chip text={cuisine} />
        <span className="dish-card__id">{dish.id}</span>
      </div>
      <h3 className="dish-card__title">{name}</h3>
      {altName && <p className="dish-card__subtitle">{altName}</p>}
      {handsOn !== undefined && (
        <div className="dish-card__meta">
          <span className="dish-card__time">{handsOn}</span>
          <span className="dish-card__time-unit">
            min hands-on{totalMin ? ` · ${totalMin} min total` : ''}
          </span>
        </div>
      )}
      {tags.length > 0 && (
        <div className="dish-card__tags">
          {tags.map((t) => <Chip key={t} text={t} />)}
        </div>
      )}
      <div className="dish-card__divider" />
      <div className="dish-card__sku">
        <span className="dish-card__sku-label">USES</span>
        <span className="dish-card__sku-id">{skuId}</span>
      </div>
    </Link>
  )
}
