type BuildCliCommandOptions = {
  species: string
  rarity: string
}

export function buildCliCommand({
  species,
  rarity,
}: BuildCliCommandOptions) {
  return `npx @openlor/anybuddy --species ${species} --rarity ${rarity}`
}
