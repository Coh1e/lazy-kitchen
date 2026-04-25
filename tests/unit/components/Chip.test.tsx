import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Chip from '../../../src/components/Chip'

describe('Chip', () => {
  it('renders text content', () => {
    render(<Chip text="川 · CN" />)
    expect(screen.getByText('川 · CN')).toBeInTheDocument()
  })

  it('default variant if not specified', () => {
    const { container } = render(<Chip text="x" />)
    expect(container.firstChild).toHaveClass('chip--default')
  })

  it('respects variant prop', () => {
    const { container } = render(<Chip text="x" variant="strong" />)
    expect(container.firstChild).toHaveClass('chip--strong')
  })
})
