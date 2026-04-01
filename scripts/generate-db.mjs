#!/usr/bin/env node

import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { SPECIES, RARITIES } from '../packages/cli/lib/constants.mjs'
import { STAT_NAMES, rollUserID } from '../packages/cli/lib/roll.mjs'

// AnyBuddy Database Generator
// Brute-forces userIDs for every species x rarity combo.
// Matches the current Node-based Claude Code runtime (v2.1.89 on this machine).

const ENTRIES_PER_COMBO = 5
const USER_ID_PATTERN = /^[0-9a-f]{64}$/

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

        const check = rollUserID(entry.userID)
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

        const check = rollUserID(userId)
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

  const result = rollUserID(userId)
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
await writeFile(webOutputPath, JSON.stringify(webDb, null, 2) + '\n', 'utf8')
const webSizeKB = (JSON.stringify(webDb).length / 1024).toFixed(1)
console.log(`\nWritten website database to ${webOutputPath} (${webSizeKB} KB)`)

const cliOutputPath = new URL('../packages/cli/lib/database.json', import.meta.url).pathname
await writeFile(cliOutputPath, JSON.stringify(cliDb, null, 2) + '\n', 'utf8')
const cliSizeKB = (JSON.stringify(cliDb).length / 1024).toFixed(1)
console.log(`Written CLI database to ${cliOutputPath} (${cliSizeKB} KB)`)
