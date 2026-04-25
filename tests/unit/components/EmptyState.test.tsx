import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from '../../../src/components/EmptyState'

describe('EmptyState', () => {
  it('renders title and sub text', () => {
    render(<EmptyState title="No data" sub="Try again later" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('Try again later')).toBeInTheDocument()
  })
})
