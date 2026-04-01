export const SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus',
  'owl', 'penguin', 'turtle', 'snail', 'ghost', 'axolotl',
  'capybara', 'cactus', 'robot', 'rabbit', 'mushroom', 'chonk',
] as const
export type Species = (typeof SPECIES)[number]

export const RARITIES = [
  'common', 'uncommon', 'rare', 'epic', 'legendary',
] as const
export type Rarity = (typeof RARITIES)[number]

export const EYES = ['·', '✦', '×', '◉', '@', '°'] as const
export type Eye = (typeof EYES)[number]

export const HATS = [
  'none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck',
] as const
export type Hat = (typeof HATS)[number]

export const STAT_NAMES = [
  'DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK',
] as const
export type StatName = (typeof STAT_NAMES)[number]

export type CompanionBones = {
  rarity: Rarity
  species: Species
  eye: Eye
  hat: Hat
  shiny: boolean
  stats: Record<StatName, number>
}

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
}

export const RARITY_STARS: Record<Rarity, string> = {
  common: '★',
  uncommon: '★★',
  rare: '★★★',
  epic: '★★★★',
  legendary: '★★★★★',
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#8f958c',
  uncommon: '#87a58d',
  rare: '#7d9eb2',
  epic: '#9f90b0',
  legendary: '#b88d62',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  uncommon: '优秀',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
}

export const SPECIES_LABELS: Record<Species, string> = {
  duck: '鸭子',
  goose: '鹅',
  blob: '史莱姆',
  cat: '猫',
  dragon: '龙',
  octopus: '章鱼',
  owl: '猫头鹰',
  penguin: '企鹅',
  turtle: '乌龟',
  snail: '蜗牛',
  ghost: '幽灵',
  axolotl: '六角恐龙',
  capybara: '水豚',
  cactus: '仙人掌',
  robot: '机器人',
  rabbit: '兔子',
  mushroom: '蘑菇',
  chonk: '胖墩',
}

export const HAT_LABELS: Record<Hat, string> = {
  none: '无',
  crown: '皇冠',
  tophat: '礼帽',
  propeller: '螺旋桨帽',
  halo: '光环',
  wizard: '巫师帽',
  beanie: '毛线帽',
  tinyduck: '小鸭子',
}
