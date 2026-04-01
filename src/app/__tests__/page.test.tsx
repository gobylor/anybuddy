// @vitest-environment jsdom

import '@/test/setup'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildCliCommand } from '@/lib/cli-command'
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
      screen.getByText(/Pick the Claude Code buddy vibe you want/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Choose a species to reveal your companion profile/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Species gallery/i)).toBeInTheDocument()
    expect(screen.getByText(/Rarity filter/i)).toBeInTheDocument()

    const repoLink = screen.getByRole('link', {
      name: /view anybuddy repository on github/i,
    })

    expect(repoLink).toHaveAttribute(
      'href',
      'https://github.com/gobylor/anybuddy',
    )
    expect(repoLink).toHaveAttribute('target', '_blank')
    expect(repoLink).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(repoLink).toHaveAttribute('rel', expect.stringContaining('noreferrer'))

    await user.click(screen.getByRole('button', { name: /Select duck/i }))

    expect(screen.getByText(/Your legendary duck/i)).toBeInTheDocument()
  })

  it('shows the shorter species-and-rarity command in the result card and keeps it stable when cycling matches', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const command = buildCliCommand({
      species: 'duck',
      rarity: 'legendary',
    })

    await user.click(screen.getAllByRole('button', { name: /select duck/i })[0])

    expect(screen.getByText(command)).toBeInTheDocument()
    expect(screen.queryByText(/--user-id/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /copy userid/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show another/i }))

    expect(screen.getByText(command)).toBeInTheDocument()
    expect(screen.queryByText(/--user-id/)).not.toBeInTheDocument()
  })
})
