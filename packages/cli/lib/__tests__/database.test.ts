import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

type WebEntry = {
  userID: string
}

type WebDatabase = Record<string, Record<string, WebEntry[]>>
type CliDatabase = Record<string, Record<string, string[]>>

const cliDb = JSON.parse(
  readFileSync(new URL('../database.json', import.meta.url), 'utf8')
) as CliDatabase

const webDb = JSON.parse(
  readFileSync(new URL('../../../../src/lib/database.json', import.meta.url), 'utf8')
) as WebDatabase

const USER_ID_PATTERN = /^[0-9a-f]{64}$/
const SALT = 'friend-2026-401'
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

function hashFNV1a(input: string) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, values: T[]): T {
  return values[Math.floor(rng() * values.length)]
}

function rollRarity(rng: () => number) {
  let roll = rng() * 100
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity]
    if (roll < 0) return rarity
  }
  return 'common'
}

function rollStats(rng: () => number, rarity: keyof typeof RARITY_FLOOR) {
  const floor = RARITY_FLOOR[rarity]
  const peak = pick(rng, STAT_NAMES)
  let dump = pick(rng, STAT_NAMES)
  while (dump === peak) dump = pick(rng, STAT_NAMES)
  const stats: Record<string, number> = {}
  for (const name of STAT_NAMES) {
    if (name === peak) stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    else if (name === dump) stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    else stats[name] = floor + Math.floor(rng() * 40)
  }
  return stats
}

function rollUserId(userID: string) {
  const rng = mulberry32(hashFNV1a(userID + SALT))
  const rarity = rollRarity(rng)
  const species = pick(rng, SPECIES)
  const eye = pick(rng, EYES)
  const hat = rarity === 'common' ? 'none' : pick(rng, HATS)
  const shiny = rng() < 0.01
  const stats = rollStats(rng, rarity)
  return { rarity, species, eye, hat, shiny, stats }
}

describe('database userID format', () => {
  it('stores only 64-character lowercase hex IDs in the website database', () => {
    for (const rarities of Object.values(webDb)) {
      for (const entries of Object.values(rarities)) {
        for (const entry of entries) {
          expect(entry.userID).toMatch(USER_ID_PATTERN)
        }
      }
    }
  })

  it('stores only 64-character lowercase hex IDs in the CLI database', () => {
    for (const rarities of Object.values(cliDb)) {
      for (const userIDs of Object.values(rarities)) {
        for (const userID of userIDs) {
          expect(userID).toMatch(USER_ID_PATTERN)
        }
      }
    }
  })

  it('keeps the CLI database as the userID projection of the website database', () => {
    for (const [species, rarities] of Object.entries(webDb)) {
      for (const [rarity, entries] of Object.entries(rarities)) {
        expect(cliDb[species]?.[rarity]).toEqual(entries.map(entry => entry.userID))
      }
    }
  })

  it('stores userIDs in buckets that match Claude Code v2.1.89 node runtime rolls', () => {
    for (const [species, rarities] of Object.entries(cliDb)) {
      for (const [rarity, userIDs] of Object.entries(rarities)) {
        for (const userID of userIDs) {
          const roll = rollUserId(userID)
          expect(roll.species).toBe(species)
          expect(roll.rarity).toBe(rarity)
        }
      }
    }
  })
})
