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
})
