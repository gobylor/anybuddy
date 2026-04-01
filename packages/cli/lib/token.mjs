import { execFileSync, execSync } from 'node:child_process'

export function isClaudeInstalled() {
  try {
    execSync('which claude', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export function getToken() {
  // claude setup-token opens browser for OAuth, then prints token to stdout.
  // We inherit stderr so the user sees progress, but capture stdout for the token.
  const output = execFileSync('claude', ['setup-token'], {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
    timeout: 300_000, // 5 minute timeout for OAuth flow
  })

  // Token is typically the last non-empty line of output
  const lines = output.trim().split('\n').filter(l => l.trim())
  const token = lines[lines.length - 1]?.trim()

  if (!token) {
    throw new Error('Failed to capture OAuth token from claude setup-token')
  }

  return token
}

export function spawnClaudeAndExit(token) {
  // Start claude with the token env var to generate full config without accountUuid.
  // Pipe /exit to stdin so it exits immediately after startup.
  execFileSync('claude', [], {
    encoding: 'utf8',
    input: '/exit\n',
    env: { ...process.env, CLAUDE_CODE_OAUTH_TOKEN: token },
    stdio: ['pipe', 'ignore', 'ignore'],
    timeout: 60_000,
  })
}
