#!/usr/bin/env bun

// AnyBuddy Database Generator
// Brute-forces userIDs for every species × rarity combo.
// MUST run with Bun for correct wyhash results.

const SALT = 'friend-2026-401'
const ENTRIES_PER_COMBO = 5

const SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus',
  'owl', 'penguin', 'turtle', 'snail', 'ghost', 'axolotl',
  'capybara', 'cactus', 'robot', 'rabbit', 'mushroom', 'chonk',
]
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary']
const EYES = ['·', '✦', '×', '◉', '@', '°']
const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck']
const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK']
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 }
const RARITY_FLOOR = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 }

// --- PRNG — exact copy from ref/cc-source/buddy/companion.ts ---

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s) {
  return Number(BigInt(Bun.hash(s)) & 0xffffffffn)
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)]
}

function rollRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0)
  let roll = rng() * total
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity]
    if (roll < 0) return rarity
  }
  return 'common'
}

function rollStats(rng, rarity) {
  const floor = RARITY_FLOOR[rarity]
  const peak = pick(rng, STAT_NAMES)
  let dump = pick(rng, STAT_NAMES)
  while (dump === peak) dump = pick(rng, STAT_NAMES)
  const stats = {}
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    } else {
      stats[name] = floor + Math.floor(rng() * 40)
    }
  }
  return stats
}

function rollFrom(userId) {
  const seed = hashString(userId + SALT)
  const rng = mulberry32(seed)
  const rarity = rollRarity(rng)
  const species = pick(rng, SPECIES)
  const eye = pick(rng, EYES)
  const hat = rarity === 'common' ? 'none' : pick(rng, HATS)
  const shiny = rng() < 0.01
  const stats = rollStats(rng, rarity)
  return { rarity, species, eye, hat, shiny, stats }
}

// --- Random userID generation ---

function randomUserId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

// --- Main ---

console.log('Generating AnyBuddy database...')
console.log(`  ${SPECIES.length} species x ${RARITIES.length} rarities x ${ENTRIES_PER_COMBO} entries each`)
console.log('')

const db = {}
let totalFound = 0
const totalNeeded = SPECIES.length * RARITIES.length * ENTRIES_PER_COMBO
let iterations = 0

for (const species of SPECIES) {
  db[species] = {}
  for (const rarity of RARITIES) {
    db[species][rarity] = []
  }
}

while (totalFound < totalNeeded) {
  const userId = randomUserId()
  const result = rollFrom(userId)
  iterations++

  const bucket = db[result.species][result.rarity]
  if (bucket.length < ENTRIES_PER_COMBO) {
    bucket.push({
      userID: userId,
      eye: result.eye,
      hat: result.hat,
      shiny: result.shiny,
      stats: result.stats,
    })
    totalFound++
    if (totalFound % 50 === 0 || totalFound === totalNeeded) {
      process.stdout.write(`\r  Found ${totalFound}/${totalNeeded} (${iterations.toLocaleString()} iterations)`)
    }
  }
}
console.log('\n')

// --- Verification: round-trip every entry ---

console.log('Verifying all entries...')
let verified = 0
let errors = 0

for (const species of SPECIES) {
  for (const rarity of RARITIES) {
    for (const entry of db[species][rarity]) {
      const check = rollFrom(entry.userID)
      if (check.species !== species || check.rarity !== rarity) {
        console.error(`MISMATCH: ${entry.userID} expected ${species}/${rarity}, got ${check.species}/${check.rarity}`)
        errors++
      }
      if (check.eye !== entry.eye || check.hat !== entry.hat || check.shiny !== entry.shiny) {
        console.error(`TRAIT MISMATCH: ${entry.userID} traits don't match`)
        errors++
      }
      verified++
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} verification errors. Database NOT written.`)
  process.exit(1)
}
console.log(`  All ${verified} entries verified OK`)

// --- Write output ---

const outputPath = new URL('../src/lib/database.json', import.meta.url).pathname
await Bun.write(outputPath, JSON.stringify(db, null, 2))
const sizeKB = (JSON.stringify(db).length / 1024).toFixed(1)
console.log(`\nWritten to ${outputPath} (${sizeKB} KB)`)
