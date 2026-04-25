import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../../../src/components/Sidebar'

describe('Sidebar', () => {
  it('renders 8 section headings', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar lang="zh" />
      </MemoryRouter>,
    )
    expect(container.querySelectorAll('h3')).toHaveLength(8)
  })

  it('uses zh labels for zh lang', () => {
    render(
      <MemoryRouter>
        <Sidebar lang="zh" />
      </MemoryRouter>,
    )
    expect(screen.getByText('开始')).toBeInTheDocument()
    expect(screen.getByText('🪧 告示栏')).toBeInTheDocument()
  })

  it('uses en labels for en lang', () => {
    render(
      <MemoryRouter>
        <Sidebar lang="en" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('🪧 Bulletin Board')).toBeInTheDocument()
  })
})
