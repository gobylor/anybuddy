import type { Rarity, Species } from './types'
import db from './database.json'

export type BuddyEntry = {
  userID: string
  eye: string
  hat: string
  shiny: boolean
  stats: Record<string, number>
}

type Database = Record<string, Record<string, BuddyEntry[]>>

const database = db as Database

export function lookup(species: Species, rarity: Rarity): BuddyEntry[] {
  return database[species]?.[rarity] ?? []
}
