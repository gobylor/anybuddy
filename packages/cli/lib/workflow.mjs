import * as db from './database.mjs'
import * as config from './config.mjs'
import * as token from './token.mjs'
import * as shell from './shell.mjs'
import * as print from './print.mjs'

export async function run(species, rarity) {
  // Step 1: Validate & Lookup
  print.step(`Looking up: ${rarity} ${species}`)
  const errors = db.validate(species, rarity)
  if (errors.length > 0) {
    errors.forEach(e => print.error(e))
    process.exit(1)
  }

  const userID = db.lookup(species, rarity)
  if (!userID) {
    print.error(`No userID found for ${species}/${rarity}`)
    process.exit(1)
  }
  print.info(`Found userID: ${userID.slice(0, 8)}...`)

  // Step 2: Get OAuth Token
  print.step('Getting OAuth token...')
  if (!token.isClaudeInstalled()) {
    print.error('Claude Code CLI not found.')
    print.info('Install it: npm install -g @anthropic-ai/claude-code')
    process.exit(1)
  }

  print.info('Opening browser for login...')
  let oauthToken
  try {
    oauthToken = token.getToken()
  } catch (err) {
    print.error(`Failed to get token: ${err.message}`)
    process.exit(1)
  }
  print.success('Token captured')

  // Step 3: Edit ~/.claude.json
  print.step('Updating ~/.claude.json')

  if (config.backup()) {
    print.info(`Backed up to ${config.backupPath()}`)
  }

  config.resetToMinimal()
  print.info('Config reset to minimal')

  try {
    token.spawnClaudeAndExit(oauthToken)
    print.info('Config regenerated (no accountUuid)')
  } catch {
    print.warn('Could not auto-generate config — proceeding with manual edit')
    // If spawning claude fails, the minimal config still works.
    // Just inject userID into whatever we have.
  }

  config.injectUserID(userID)
  print.success('UserID injected')

  // Step 4: Persist token
  print.step('Persisting token to shell config')
  const { rcFile, action } = shell.persistToken(oauthToken)
  print.success(`CLAUDE_CODE_OAUTH_TOKEN ${action} in ${rcFile}`)

  // Step 5: Done
  print.step('Done!')
  print.info('Restart your terminal, run claude, type /buddy')
  print.info(`Your ${rarity} ${species} is waiting`)
}
