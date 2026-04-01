#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const cliPath = fileURLToPath(new URL('../packages/cli/bin/anybuddy.mjs', import.meta.url))
const sandboxRoot = mkdtempSync(join(tmpdir(), 'anybuddy-cli-startup-profile-test-'))
const homeDir = join(sandboxRoot, 'home')
const binDir = join(sandboxRoot, 'bin')
const tokenValue = 'claude_token_1234567890abcdef'
const exactUserId = '6299a096cb4c781bbb8f2dae2e3912b1d2a078a479b65abe7f9a0fb435f7c4a3'

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
  `#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const tokenValue = ${JSON.stringify(tokenValue)}
const exactUserId = ${JSON.stringify(exactUserId)}
const configPath = path.join(process.env.HOME, '.claude.json')
const args = process.argv.slice(2)

function readConfig() {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\\n', 'utf8')
}

if (args[0] === 'setup-token') {
  process.stdout.write('Opening browser for login...\\n')
  process.stdout.write(tokenValue + '\\n')
  process.exit(0)
}

let config = readConfig()

if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
  const hasHydratedProfile =
    config.oauthAccount &&
    config.oauthAccount.billingType !== undefined &&
    config.oauthAccount.accountCreatedAt !== undefined &&
    config.oauthAccount.subscriptionCreatedAt !== undefined

  if (!hasHydratedProfile) {
    config.oauthAccount = {
      accountUuid: 'live-account-uuid',
      emailAddress: 'user@example.com',
      organizationUuid: 'org-uuid',
      billingType: 'pro',
      accountCreatedAt: '2026-01-01T00:00:00.000Z',
      subscriptionCreatedAt: '2026-01-01T00:00:00.000Z'
    }
    writeConfig(config)
  }
}

const input = fs.readFileSync(0, 'utf8')
if (input.includes('/buddy')) {
  config = readConfig()
  const seed = (config.oauthAccount && config.oauthAccount.accountUuid) || config.userID || 'anon'
  const isLegendaryRabbit = seed === exactUserId

  config.companion = {
    name: isLegendaryRabbit ? 'Spark' : 'Pickle',
    personality: isLegendaryRabbit
      ? 'A legendary rabbit of few words.'
      : 'A common chonk of few words.',
    hatchedAt: 1775053226611
  }

  writeConfig(config)
}
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

const launchResult = spawnSync('claude', [], {
  cwd: repoRoot,
  env: { ...env, CLAUDE_CODE_OAUTH_TOKEN: tokenValue },
  input: '/buddy\n/exit\n',
  encoding: 'utf8',
})

assert(
  launchResult.status === 0,
  'Simulated Claude launch exited with a non-zero status',
  `stdout:\n${launchResult.stdout}\n\nstderr:\n${launchResult.stderr}`
)

const configPath = join(homeDir, '.claude.json')
assert(existsSync(configPath), 'Expected ~/.claude.json to exist after simulated launch')

const config = JSON.parse(readFileSync(configPath, 'utf8'))

assert(
  config.userID === exactUserId,
  'Expected final ~/.claude.json to keep the requested userID',
  JSON.stringify(config, null, 2)
)
assert(
  config.companion?.personality === 'A legendary rabbit of few words.',
  'Expected /buddy to hatch using userID instead of a refetched accountUuid',
  JSON.stringify(config, null, 2)
)
assert(
  !config.oauthAccount?.accountUuid,
  'Expected startup profile fetch to stay blocked so accountUuid remains absent',
  JSON.stringify(config, null, 2)
)

console.log('Sandbox startup profile flow passed')

rmSync(sandboxRoot, { recursive: true, force: true })
