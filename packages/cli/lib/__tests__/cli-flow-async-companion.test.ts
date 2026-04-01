import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url))
const scriptPath = fileURLToPath(
  new URL('../../../../scripts/test-cli-flow-async-companion.mjs', import.meta.url)
)

describe('CLI async companion cleanup', () => {
  it('removes companion state even if Claude rewrites the config asynchronously', () => {
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: repoRoot,
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Sandbox async companion flow passed')
  })
})
