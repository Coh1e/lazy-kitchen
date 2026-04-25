import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DishCard from '../../../src/components/DishCard'
import type { Dish } from '../../../src/data'

const mock: Dish = {
  id: 'DISH-CN-TOMATO-EGGS',
  name: { zh: '番茄炒蛋', en: 'Tomato and eggs' },
  cuisine: { country: 'CN', region: '中' },
  status: 'proposed',
  uses: { sop: ['SOP-STIR-FRY-001'] },
  time: { hands_on_min: 5, total_min: 8 },
  flavor_tags: ['umami', 'sour'],
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('DishCard', () => {
  it('renders the dish name in the chosen language', () => {
    renderWithRouter(<DishCard dish={mock} lang="zh" />)
    expect(screen.getByText('番茄炒蛋')).toBeInTheDocument()
    expect(screen.getByText('Tomato and eggs')).toBeInTheDocument() // alt label
  })

  it('renders status badge', () => {
    renderWithRouter(<DishCard dish={mock} lang="zh" />)
    expect(screen.getByText('PROPOSED')).toBeInTheDocument()
  })

  it('links to the compose route with kebab-case slug', () => {
    renderWithRouter(<DishCard dish={mock} lang="zh" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/zh/compose/cn-tomato-eggs')
  })

  it('shows hands-on time when present', () => {
    renderWithRouter(<DishCard dish={mock} lang="en" />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/min hands-on/)).toBeInTheDocument()
  })
})
