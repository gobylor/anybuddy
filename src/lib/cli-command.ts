type BuildCliCommandOptions = {
  species: string
  rarity: string
  userID: string
}

export function buildCliCommand({
  species,
  rarity,
  userID,
}: BuildCliCommandOptions) {
  return `npx @openlor/anybuddy --species ${species} --rarity ${rarity} --user-id ${userID}`
}
