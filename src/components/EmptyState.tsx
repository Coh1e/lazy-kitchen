interface Props {
  title: string
  sub: string
}

export default function EmptyState({ title, sub }: Props) {
  return (
    <div className="empty">
      <div className="empty__title">{title}</div>
      <div className="empty__sub">{sub}</div>
    </div>
  )
}
