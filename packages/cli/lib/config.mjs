import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const CLAUDE_JSON = join(homedir(), '.claude.json')
const CLAUDE_JSON_BAK = join(homedir(), '.claude.json.bak')

const MINIMAL_CONFIG = {
  hasCompletedOnboarding: true,
  theme: 'dark',
}

export function exists() {
  return existsSync(CLAUDE_JSON)
}

export function backup() {
  if (existsSync(CLAUDE_JSON)) {
    copyFileSync(CLAUDE_JSON, CLAUDE_JSON_BAK)
    return true
  }
  return false
}

export function read() {
  if (!existsSync(CLAUDE_JSON)) return null
  return JSON.parse(readFileSync(CLAUDE_JSON, 'utf8'))
}

export function write(config) {
  writeFileSync(CLAUDE_JSON, JSON.stringify(config, null, 2) + '\n', 'utf8')
}

export function resetToMinimal() {
  write(MINIMAL_CONFIG)
}

export function injectUserID(userID) {
  const config = read()
  if (!config) throw new Error('~/.claude.json does not exist')

  config.userID = userID

  // Remove companion to force re-hatch
  delete config.companion

  // Remove accountUuid so /buddy uses userID
  if (config.oauthAccount) {
    delete config.oauthAccount.accountUuid
  }

  write(config)
}

export function configPath() {
  return CLAUDE_JSON
}

export function backupPath() {
  return CLAUDE_JSON_BAK
}
