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
      screen.getByText(/伙伴选择面板/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /选择物种、筛选稀有度，揭晓最适合你 Claude Code 的伙伴档案/,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/选择一个物种来打开伙伴档案/),
    ).toBeInTheDocument()
    expect(screen.getByText(/物种图鉴/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /稀有度筛选/ })).toBeInTheDocument()
    expect(screen.getByText(/Lor —— AI Builder/i)).toBeInTheDocument()

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

    await user.click(screen.getByRole('button', { name: /选择 鸭子/i }))

    expect(
      screen.getByRole('heading', { name: /伙伴档案/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/你的传说鸭子/i)).toBeInTheDocument()
  })

  it('shows the shorter species-and-rarity command in the result card and keeps it stable when cycling matches', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const command = buildCliCommand({
      species: 'duck',
      rarity: 'legendary',
    })

    await user.click(screen.getAllByRole('button', { name: /选择 鸭子/i })[0])

    expect(screen.getByText(command)).toBeInTheDocument()
    expect(screen.queryByText(/--user-id/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /copy userid/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /换一个/i }))

    expect(screen.getByText(command)).toBeInTheDocument()
    expect(screen.queryByText(/--user-id/)).not.toBeInTheDocument()
  })
})
