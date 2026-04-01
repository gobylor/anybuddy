#!/usr/bin/env node

import { SPECIES, RARITIES } from '../lib/constants.mjs'
import { run } from '../lib/workflow.mjs'
import { header, error } from '../lib/print.mjs'

function printHelp() {
  console.log(`
Usage: npx anybuddy [options]

Options:
  --species <name>    Target species (required)
  --rarity <name>     Target rarity (required)
  --list              Show all available species and rarities
  --help, -h          Show help

Examples:
  npx anybuddy --species duck --rarity legendary
  npx anybuddy --species dragon --rarity epic
  npx anybuddy --list
`)
}

function printList() {
  console.log('\nSpecies:')
  console.log(`  ${SPECIES.join(', ')}`)
  console.log('\nRarities:')
  console.log(`  ${RARITIES.join(', ')}`)
  console.log()
}

function parseArgs(argv) {
  const args = argv.slice(2)
  const opts = {}

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--species':
        opts.species = args[++i]
        if (!opts.species) { error('--species requires a value'); process.exit(1) }
        break
      case '--rarity':
        opts.rarity = args[++i]
        if (!opts.rarity) { error('--rarity requires a value'); process.exit(1) }
        break
      case '--list':     opts.list = true; break
      case '--help':
      case '-h':         opts.help = true; break
      default:
        error(`Unknown option: ${args[i]}`)
        printHelp()
        process.exit(1)
    }
  }

  return opts
}

const opts = parseArgs(process.argv)

header()

if (opts.help) {
  printHelp()
  process.exit(0)
}

if (opts.list) {
  printList()
  process.exit(0)
}

if (!opts.species || !opts.rarity) {
  error('--species and --rarity are required')
  printHelp()
  process.exit(1)
}

await run(opts.species, opts.rarity)
