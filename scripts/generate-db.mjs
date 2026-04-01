#!/usr/bin/env bun

import { randomBytes } from 'node:crypto'

// AnyBuddy Database Generator
// Brute-forces userIDs for every species x rarity combo.
// MUST run with Bun for correct hash results.

const SALT = 'friend-2026-401'
const ENTRIES_PER_COMBO = 5
const USER_ID_PATTERN = /^[0-9a-f]{64}$/

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
  let roll = rng() * 100
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

function rollFromUserId(userId) {
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

function isValidUserId(userId) {
  return USER_ID_PATTERN.test(userId)
}

function generateCandidateUserId() {
  const userId = randomBytes(32).toString('hex')
  if (!isValidUserId(userId)) {
    throw new Error(`Generated invalid userID: ${userId}`)
  }
  return userId
}

function createEmptyDatabase() {
  const db = {}
  for (const species of SPECIES) {
    db[species] = {}
    for (const rarity of RARITIES) {
      db[species][rarity] = []
    }
  }
  return db
}

function buildCliDatabase(webDb) {
  const cliDb = {}
  for (const species of SPECIES) {
    cliDb[species] = {}
    for (const rarity of RARITIES) {
      cliDb[species][rarity] = webDb[species][rarity].map(entry => entry.userID)
    }
  }
  return cliDb
}

function sameStats(left, right) {
  return STAT_NAMES.every(name => left[name] === right[name])
}

function verifyWebsiteDatabase(db) {
  let verified = 0
  for (const species of SPECIES) {
    for (const rarity of RARITIES) {
      for (const entry of db[species][rarity]) {
        if (!isValidUserId(entry.userID)) {
          throw new Error(`Invalid website database userID: ${entry.userID}`)
        }

        const check = rollFromUserId(entry.userID)
        if (check.species !== species || check.rarity !== rarity) {
          throw new Error(
            `Bucket mismatch: ${entry.userID} expected ${species}/${rarity}, got ${check.species}/${check.rarity}`
          )
        }
        if (
          check.eye !== entry.eye ||
          check.hat !== entry.hat ||
          check.shiny !== entry.shiny ||
          !sameStats(check.stats, entry.stats)
        ) {
          throw new Error(`Trait mismatch: ${entry.userID}`)
        }
        verified++
      }
    }
  }
  return verified
}

function verifyCliProjection(webDb, cliDb) {
  let verified = 0
  for (const species of SPECIES) {
    for (const rarity of RARITIES) {
      const expectedUserIds = webDb[species][rarity].map(entry => entry.userID)
      const actualUserIds = cliDb[species][rarity]

      if (JSON.stringify(actualUserIds) !== JSON.stringify(expectedUserIds)) {
        throw new Error(`CLI projection mismatch: ${species}/${rarity}`)
      }

      for (const userId of actualUserIds) {
        if (!isValidUserId(userId)) {
          throw new Error(`Invalid CLI database userID: ${userId}`)
        }

        const check = rollFromUserId(userId)
        if (check.species !== species || check.rarity !== rarity) {
          throw new Error(
            `CLI bucket mismatch: ${userId} expected ${species}/${rarity}, got ${check.species}/${check.rarity}`
          )
        }
        verified++
      }
    }
  }
  return verified
}

console.log('Generating AnyBuddy database...')
console.log(`  ${SPECIES.length} species x ${RARITIES.length} rarities x ${ENTRIES_PER_COMBO} entries each`)
console.log('')

const webDb = createEmptyDatabase()
const seenUserIds = new Set()
let totalFound = 0
const totalNeeded = SPECIES.length * RARITIES.length * ENTRIES_PER_COMBO
let iterations = 0

while (totalFound < totalNeeded) {
  const userId = generateCandidateUserId()
  iterations++

  if (seenUserIds.has(userId)) continue
  seenUserIds.add(userId)

  const result = rollFromUserId(userId)
  const bucket = webDb[result.species][result.rarity]
  if (bucket.length >= ENTRIES_PER_COMBO) continue

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
console.log('\n')

console.log('Verifying website database...')
const verifiedWebsiteEntries = verifyWebsiteDatabase(webDb)
console.log(`  All ${verifiedWebsiteEntries} website entries verified OK`)

const cliDb = buildCliDatabase(webDb)
console.log('Verifying CLI database...')
const verifiedCliEntries = verifyCliProjection(webDb, cliDb)
console.log(`  All ${verifiedCliEntries} CLI entries verified OK`)

const webOutputPath = new URL('../src/lib/database.json', import.meta.url).pathname
await Bun.write(webOutputPath, JSON.stringify(webDb, null, 2) + '\n')
const webSizeKB = (JSON.stringify(webDb).length / 1024).toFixed(1)
console.log(`\nWritten website database to ${webOutputPath} (${webSizeKB} KB)`)

const cliOutputPath = new URL('../packages/cli/lib/database.json', import.meta.url).pathname
await Bun.write(cliOutputPath, JSON.stringify(cliDb, null, 2) + '\n')
const cliSizeKB = (JSON.stringify(cliDb).length / 1024).toFixed(1)
console.log(`Written CLI database to ${cliOutputPath} (${cliSizeKB} KB)`)
