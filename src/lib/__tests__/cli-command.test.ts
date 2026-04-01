import { describe, expect, it } from 'vitest'
import { buildCliCommand } from '../cli-command'

describe('buildCliCommand', () => {
  it('builds the shorter species-and-rarity command for the default apply flow', () => {
    expect(
      buildCliCommand({
        species: 'turtle',
        rarity: 'legendary',
      })
    ).toBe(
      'npx @openlor/anybuddy --species turtle --rarity legendary'
    )
  })
})
