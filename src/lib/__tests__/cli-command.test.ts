import { describe, expect, it } from 'vitest'
import { buildCliCommand } from '../cli-command'

describe('buildCliCommand', () => {
  it('includes the exact userID so the CLI applies the selected buddy variant', () => {
    expect(
      buildCliCommand({
        species: 'turtle',
        rarity: 'legendary',
        userID: '14a197f94a5767f008c89e62829f69374037680b6f424715fffc309eee535ca2',
      })
    ).toBe(
      'npx @openlor/anybuddy --species turtle --rarity legendary --user-id 14a197f94a5767f008c89e62829f69374037680b6f424715fffc309eee535ca2'
    )
  })
})
