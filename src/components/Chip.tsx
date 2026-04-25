interface Props {
  text: string
  variant?: 'default' | 'strong' | 'outline' | 'inverse'
}

export default function Chip({ text, variant = 'default' }: Props) {
  return <span className={`chip chip--${variant}`}>{text}</span>
}
