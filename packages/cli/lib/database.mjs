import { readFileSync } from 'node:fs'
import { SPECIES, RARITIES } from './constants.mjs'

const db = JSON.parse(
  readFileSync(new URL('./database.json', import.meta.url), 'utf8')
)

export function lookup(species, rarity) {
  const ids = db[species]?.[rarity]
  if (!ids || ids.length === 0) return null
  return ids[Math.floor(Math.random() * ids.length)]
}

export function validate(species, rarity) {
  const errors = []
  if (!SPECIES.includes(species)) {
    errors.push(`Unknown species: "${species}". Available: ${SPECIES.join(', ')}`)
  }
  if (!RARITIES.includes(rarity)) {
    errors.push(`Unknown rarity: "${rarity}". Available: ${RARITIES.join(', ')}`)
  }
  return errors
}
