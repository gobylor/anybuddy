import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const ENV_VAR = 'CLAUDE_CODE_OAUTH_TOKEN'
const EXPORT_RE = new RegExp(`^export\\s+${ENV_VAR}=.*$`, 'm')

export function detectRcFile() {
  const home = homedir()
  const shell = process.env.SHELL || ''

  if (shell.includes('zsh')) return join(home, '.zshrc')
  if (shell.includes('bash')) {
    // macOS uses .bash_profile, Linux uses .bashrc
    const profile = join(home, '.bash_profile')
    if (existsSync(profile)) return profile
    return join(home, '.bashrc')
  }

  // Fallback: try common files
  const zshrc = join(home, '.zshrc')
  if (existsSync(zshrc)) return zshrc
  const bashrc = join(home, '.bashrc')
  if (existsSync(bashrc)) return bashrc

  return join(home, '.zshrc') // default
}

export function persistToken(token) {
  const rcFile = detectRcFile()
  const line = `export ${ENV_VAR}=${token}`

  if (existsSync(rcFile)) {
    const content = readFileSync(rcFile, 'utf8')
    if (EXPORT_RE.test(content)) {
      // Replace existing line
      const updated = content.replace(EXPORT_RE, line)
      writeFileSync(rcFile, updated, 'utf8')
      return { rcFile, action: 'replaced' }
    }
  }

  // Append
  appendFileSync(rcFile, `\n# AnyBuddy — Claude Code buddy token\n${line}\n`, 'utf8')
  return { rcFile, action: 'appended' }
}
