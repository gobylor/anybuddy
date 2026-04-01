#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const cliPath = fileURLToPath(new URL('../packages/cli/bin/anybuddy.mjs', import.meta.url))
const sandboxRoot = mkdtempSync(join(tmpdir(), 'anybuddy-cli-test-'))
const homeDir = join(sandboxRoot, 'home')
const binDir = join(sandboxRoot, 'bin')
const tokenValue = 'claude_token_1234567890abcdef'
const exactUserId = '6bac3ed97f1e514d55bbe7eaac8d32dd3b9e821701877966b105200aac8d73bb'

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
  },
  "companion": {
    "species": "generated-companion"
  }
}
JSON
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
  [cliPath, '--species', 'duck', '--rarity', 'legendary', '--user-id', exactUserId],
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

const configPath = join(homeDir, '.claude.json')
const backupPath = join(homeDir, '.claude.json.bak')
const rcPath = join(homeDir, '.zshrc')

assert(existsSync(configPath), 'Expected ~/.claude.json to exist after CLI run')
assert(existsSync(backupPath), 'Expected ~/.claude.json.bak to be created')
assert(existsSync(rcPath), 'Expected ~/.zshrc to be created')

const config = JSON.parse(readFileSync(configPath, 'utf8'))
const backup = JSON.parse(readFileSync(backupPath, 'utf8'))
const rcFile = readFileSync(rcPath, 'utf8')

assert(
  config.userID === exactUserId,
  'Expected generated ~/.claude.json to include the exact requested userID',
  JSON.stringify(config, null, 2)
)
assert(!('companion' in config), 'Expected companion to be removed from ~/.claude.json')
assert(
  !config.oauthAccount?.accountUuid,
  'Expected oauthAccount.accountUuid to be removed from ~/.claude.json',
  JSON.stringify(config, null, 2)
)
assert(
  backup.userID === 'old-user-id',
  'Expected backup config to preserve the original ~/.claude.json',
  JSON.stringify(backup, null, 2)
)
assert(
  rcFile.includes(`CLAUDE_CODE_OAUTH_TOKEN='${tokenValue}'`),
  'Expected ~/.zshrc to contain the persisted OAuth token',
  rcFile
)

console.log('Sandbox CLI flow passed')

rmSync(sandboxRoot, { recursive: true, force: true })
