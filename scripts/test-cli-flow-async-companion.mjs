#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const cliPath = fileURLToPath(new URL('../packages/cli/bin/anybuddy.mjs', import.meta.url))
const sandboxRoot = mkdtempSync(join(tmpdir(), 'anybuddy-cli-async-test-'))
const homeDir = join(sandboxRoot, 'home')
const binDir = join(sandboxRoot, 'bin')
const tokenValue = 'claude_token_1234567890abcdef'
const exactUserId = '130fd416a47deff2b960f1466416208a92c6c1f01411e108c559b8b7043a9d02'

function fail(message, details) {
  console.error(`Error: ${message}`)
  if (details) {
    console.error(details)
  }
  console.error(`Sandbox preserved at ${sandboxRoot}`)
  process.exit(1)
}

function assert(condition, message, details) {
  if (!condition) {
    fail(message, details)
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

mkdirSync(homeDir)
mkdirSync(binDir)

writeFileSync(
  join(homeDir, '.claude.json'),
  JSON.stringify(
    {
      hasCompletedOnboarding: true,
      theme: 'dark',
      userID: 'old-user-id',
      companion: { species: 'old-companion' },
      oauthAccount: { accountUuid: 'old-account-uuid' },
    },
    null,
    2
  ) + '\n',
  'utf8'
)

writeFileSync(
  join(binDir, 'claude'),
  `#!/bin/sh
set -eu

if [ "\${1:-}" = "setup-token" ]; then
  printf '%s\\n' "Opening browser for login..."
  printf '%s\\n' "${tokenValue}"
  exit 0
fi

cat > "$HOME/.claude.json" <<'JSON'
{
  "hasCompletedOnboarding": true,
  "theme": "dark",
  "oauthAccount": {
    "accountUuid": "generated-account-uuid"
  }
}
JSON

(
  sleep 0.2
  cat > "$HOME/.claude.json" <<'JSON'
{
  "hasCompletedOnboarding": true,
  "theme": "dark",
  "userID": "${exactUserId}",
  "oauthAccount": {
    "accountUuid": "async-account-uuid"
  },
  "companion": {
    "species": "async-companion"
  }
}
JSON
) &
`,
  { mode: 0o755 }
)

const env = {
  ...process.env,
  HOME: homeDir,
  PATH: `${binDir}:${process.env.PATH || ''}`,
  SHELL: '/bin/zsh',
}

const result = spawnSync(
  process.execPath,
  [cliPath, '--species', 'rabbit', '--rarity', 'legendary', '--user-id', exactUserId],
  {
    cwd: repoRoot,
    env,
    encoding: 'utf8',
  }
)

assert(
  result.status === 0,
  'CLI exited with a non-zero status',
  `stdout:\n${result.stdout}\n\nstderr:\n${result.stderr}`
)

sleep(500)

const configPath = join(homeDir, '.claude.json')
assert(existsSync(configPath), 'Expected ~/.claude.json to exist after CLI run')

const config = JSON.parse(readFileSync(configPath, 'utf8'))

assert(
  config.userID === exactUserId,
  'Expected final ~/.claude.json to keep the exact requested userID',
  JSON.stringify(config, null, 2)
)
assert(
  !('companion' in config),
  'Expected final ~/.claude.json to remove companion even after async Claude rewrite',
  JSON.stringify(config, null, 2)
)
assert(
  !config.oauthAccount?.accountUuid,
  'Expected final ~/.claude.json to remove oauthAccount.accountUuid even after async Claude rewrite',
  JSON.stringify(config, null, 2)
)

console.log('Sandbox async companion flow passed')

rmSync(sandboxRoot, { recursive: true, force: true })
