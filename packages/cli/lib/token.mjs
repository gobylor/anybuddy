import { execFileSync, execSync } from 'node:child_process'

const ANSI_ESCAPE_RE = /\u001B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g
const CONTROL_RE = /[\u0000-\u001F\u007F]/g
const ZERO_WIDTH_RE = /[\u200B-\u200D\uFEFF]/g
const TOKEN_RE = /^[A-Za-z0-9._~+/=-]{20,}$/

function cleanOutputLine(line) {
  return line
    .replace(ANSI_ESCAPE_RE, '')
    .replace(CONTROL_RE, '')
    .replace(ZERO_WIDTH_RE, '')
    .trim()
}

function looksLikeToken(line) {
  return (
    line.length >= 20 &&
    !/\s/.test(line) &&
    !/^https?:\/\//i.test(line) &&
    TOKEN_RE.test(line)
  )
}

function extractToken(output) {
  const lines = String(output).split(/\r?\n|\r/g)

  for (let i = lines.length - 1; i >= 0; i--) {
    const candidate = cleanOutputLine(lines[i])
    if (looksLikeToken(candidate)) {
      return candidate
    }
  }

  return null
}

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

  const token = extractToken(output)

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
