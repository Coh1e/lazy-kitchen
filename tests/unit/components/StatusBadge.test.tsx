import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../../../src/components/StatusBadge'

describe('StatusBadge', () => {
  it('uppercases the status text', () => {
    render(<StatusBadge status="proposed" />)
    expect(screen.getByText('PROPOSED')).toBeInTheDocument()
  })

  it('applies status-specific class for color theming', () => {
    const { container } = render(<StatusBadge status="approved" />)
    expect(container.firstChild).toHaveClass('status-badge--approved')
  })
})
