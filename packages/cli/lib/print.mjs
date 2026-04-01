import { readFileSync } from 'node:fs'

const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)

export function step(msg) {
  console.log(`\n${BOLD}${CYAN}->${RESET} ${BOLD}${msg}${RESET}`)
}

export function info(msg) {
  console.log(`   ${msg}`)
}

export function success(msg) {
  console.log(`   ${GREEN}${msg}${RESET}`)
}

export function warn(msg) {
  console.log(`   ${YELLOW}${msg}${RESET}`)
}

export function error(msg) {
  console.error(`\n${RED}Error: ${msg}${RESET}`)
}

export function header() {
  console.log(`${BOLD}anybuddy${RESET} ${DIM}v${pkg.version}${RESET}`)
}
