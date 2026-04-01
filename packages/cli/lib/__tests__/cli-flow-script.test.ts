import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url))
const scriptPath = fileURLToPath(new URL('../../../../scripts/test-cli-flow.mjs', import.meta.url))
const cliPath = fileURLToPath(new URL('../../bin/anybuddy.mjs', import.meta.url))

describe('test-cli-flow tool', () => {
  it('prints scoped npx usage in the help text', () => {
    const result = spawnSync(process.execPath, [cliPath, '--help'], {
      cwd: repoRoot,
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('npx @openlor/anybuddy')
  })

  it('runs the sandboxed CLI integration flow successfully', () => {
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: repoRoot,
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Sandbox CLI flow passed')
  })
})
