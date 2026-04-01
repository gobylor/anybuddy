import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const CLAUDE_JSON = join(homedir(), '.claude.json')
const CLAUDE_JSON_BAK = join(homedir(), '.claude.json.bak')

const MINIMAL_CONFIG = {
  hasCompletedOnboarding: true,
  theme: 'dark',
}
const STABILIZE_ATTEMPTS = 10
const STABILIZE_DELAY_MS = 100
const STABILIZE_CLEAN_STREAK = 5

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

function applyBuddyState(config, userID) {
  config.userID = userID

  // Remove companion to force re-hatch
  delete config.companion

  // Keep oauthAccount metadata keys present with null values so Claude
  // treats the profile as already hydrated and does not re-fetch accountUuid.
  const oauthAccount = { ...(config.oauthAccount || {}) }
  delete oauthAccount.accountUuid
  if (oauthAccount.billingType === undefined) oauthAccount.billingType = null
  if (oauthAccount.accountCreatedAt === undefined) oauthAccount.accountCreatedAt = null
  if (oauthAccount.subscriptionCreatedAt === undefined) oauthAccount.subscriptionCreatedAt = null
  config.oauthAccount = oauthAccount

  return config
}

function hasExpectedBuddyState(config, userID) {
  return (
    config?.userID === userID &&
    !('companion' in config) &&
    !config.oauthAccount?.accountUuid &&
    config.oauthAccount?.billingType !== undefined &&
    config.oauthAccount?.accountCreatedAt !== undefined &&
    config.oauthAccount?.subscriptionCreatedAt !== undefined
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function injectUserID(userID) {
  const config = read()
  if (!config) throw new Error('~/.claude.json does not exist')

  write(applyBuddyState(config, userID))
}

export async function stabilizeBuddyState(userID) {
  let lastConfig = null
  let cleanStreak = 0

  for (let attempt = 0; attempt < STABILIZE_ATTEMPTS; attempt++) {
    injectUserID(userID)
    await sleep(STABILIZE_DELAY_MS)
    lastConfig = read()

    if (lastConfig && hasExpectedBuddyState(lastConfig, userID)) {
      cleanStreak += 1
      if (cleanStreak >= STABILIZE_CLEAN_STREAK) {
        return lastConfig
      }
    } else {
      cleanStreak = 0
    }
  }

  throw new Error(
    `~/.claude.json kept restoring stale companion state: ${JSON.stringify(lastConfig, null, 2)}`
  )
}

export function configPath() {
  return CLAUDE_JSON
}

export function backupPath() {
  return CLAUDE_JSON_BAK
}
