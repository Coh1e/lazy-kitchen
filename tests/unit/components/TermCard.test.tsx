import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermCard from '../../../src/components/TermCard'

describe('TermCard', () => {
  it('renders zh + en + alias info', () => {
    render(
      <TermCard
        term={{
          zh: '番茄',
          en: 'Tomato',
          alias_zh: ['西红柿'],
          category: 'vegetable',
        }}
      />,
    )
    expect(screen.getByText('番茄')).toBeInTheDocument()
    expect(screen.getByText('Tomato')).toBeInTheDocument()
    expect(screen.getByText(/西红柿/)).toBeInTheDocument()
    expect(screen.getByText('vegetable')).toBeInTheDocument()
  })

  it('flags pitfall when do_not_translate_as is set', () => {
    const { container } = render(
      <TermCard
        term={{
          zh: '花椒',
          en: 'Sichuan peppercorn',
          do_not_translate_as: ['black pepper'],
        }}
      />,
    )
    expect(container.firstChild).toHaveClass('pitfall')
    expect(screen.getByText(/PITFALL/)).toBeInTheDocument()
    expect(screen.getByText(/never:.*black pepper/)).toBeInTheDocument()
  })
})
