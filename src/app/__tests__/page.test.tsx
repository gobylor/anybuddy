import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

describe('Home page', () => {
  it('renders the title and reveals a buddy after species selection', async () => {
    const user = userEvent.setup()
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'AnyBuddy' })).toBeInTheDocument()
    expect(
      screen.getByText(/A small utility by Lor —— AI Builder/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Pick the exact Claude Code buddy you want/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Choose a species to reveal your companion profile/i),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Select duck/i }))

    expect(screen.getByText(/Your legendary duck/i)).toBeInTheDocument()
  })
})
