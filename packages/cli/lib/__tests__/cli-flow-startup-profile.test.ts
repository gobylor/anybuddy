import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url))
const scriptPath = fileURLToPath(
  new URL('../../../../scripts/test-cli-flow-startup-profile.mjs', import.meta.url)
)

describe('CLI startup profile guard', () => {
  it('prevents Claude startup from refetching accountUuid before /buddy runs', () => {
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: repoRoot,
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Sandbox startup profile flow passed')
  })
})
