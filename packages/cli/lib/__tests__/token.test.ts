import { beforeEach, describe, expect, it, vi } from 'vitest'

const { execFileSync, execSync } = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  execSync: vi.fn(),
}))

vi.mock('node:child_process', () => ({
  execFileSync,
  execSync,
}))

import { getToken } from '../token.mjs'

describe('getToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the last non-empty line when it looks like a token', () => {
    execFileSync.mockReturnValueOnce(
      'Opening browser for login...\nclaude_token_1234567890abcdef\n'
    )

    expect(getToken()).toBe('claude_token_1234567890abcdef')
  })

  it('accepts a token wrapped in ANSI color codes', () => {
    execFileSync.mockReturnValueOnce(
      'Opening browser for login...\n\u001b[32mclaude_token_1234567890abcdef\u001b[0m\n'
    )

    expect(getToken()).toBe('claude_token_1234567890abcdef')
  })

  it('rejects spinner or control-sequence output without a token', () => {
    execFileSync.mockReturnValueOnce('\u001b[2K\u001b[1G\r')

    expect(() => getToken()).toThrow(
      'Failed to capture OAuth token from claude setup-token'
    )
  })

  it('rejects human-readable status text without a token', () => {
    execFileSync.mockReturnValueOnce(
      'Opening browser for login...\nLogin complete\n'
    )

    expect(() => getToken()).toThrow(
      'Failed to capture OAuth token from claude setup-token'
    )
  })
})
