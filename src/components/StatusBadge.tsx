interface Props {
  status: string
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {status.toUpperCase()}
    </span>
  )
}
