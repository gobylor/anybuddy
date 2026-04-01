import { describe, expect, it } from 'vitest'
import { renderSprite } from '../sprites'
import type { CompanionBones } from '../types'

const makeBones = (overrides: Partial<CompanionBones> = {}): CompanionBones => ({
  species: 'duck',
  rarity: 'common',
  eye: '·',
  hat: 'none',
  shiny: false,
  stats: { DEBUGGING: 50, PATIENCE: 50, CHAOS: 50, WISDOM: 50, SNARK: 50 },
  ...overrides,
})

describe('renderSprite', () => {
  it('replaces {E} placeholders with the eye character', () => {
    const lines = renderSprite(makeBones({ species: 'blob', eye: '✦' }))
    const joined = lines.join('\n')
    expect(joined).toContain('✦')
    expect(joined).not.toContain('{E}')
  })

  it('adds hat line when hat is set and line 0 is blank', () => {
    const lines = renderSprite(makeBones({ rarity: 'legendary', hat: 'crown' }))
    expect(lines[0]).toContain('^^^')
  })

  it('trims blank line 0 when no hat', () => {
    const lines = renderSprite(makeBones({ rarity: 'common', hat: 'none' }))
    // Frame 0 of every species has blank line 0 → trimmed → 4 lines
    expect(lines.length).toBe(4)
  })

  it('keeps 5 lines when hat occupies line 0', () => {
    const lines = renderSprite(makeBones({ rarity: 'epic', hat: 'wizard' }))
    expect(lines.length).toBe(5)
  })
})
