import type { CompanionBones, Hat, Species } from './types'

// Frame 0 only — static rendering for web (no animation in v1).
// Each entry is 5 lines tall, 12 chars wide. {E} = eye placeholder.
const BODIES: Record<Species, string[]> = {
  duck: [
    '            ',
    '    __      ',
    '  <({E} )___  ',
    '   (  ._>   ',
    '    `--´    ',
  ],
  goose: [
    '            ',
    '     ({E}>    ',
    '     ||     ',
    '   _(__)_   ',
    '    ^^^^    ',
  ],
  blob: [
    '            ',
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (      )  ',
    '   `----´   ',
  ],
  cat: [
    '            ',
    '   /\\_/\\    ',
    '  ( {E}   {E})  ',
    '  (  ω  )   ',
    '  (")_(")   ',
  ],
  dragon: [
    '            ',
    '  /^\\  /^\\  ',
    ' <  {E}  {E}  > ',
    ' (   ~~   ) ',
    '  `-vvvv-´  ',
  ],
  octopus: [
    '            ',
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (______)  ',
    '  /\\/\\/\\/\\  ',
  ],
  owl: [
    '            ',
    '   /\\  /\\   ',
    '  (({E})({E}))  ',
    '  (  ><  )  ',
    '   `----´   ',
  ],
  penguin: [
    '            ',
    '  .---.     ',
    '  ({E}>{E})     ',
    ' /(   )\\    ',
    '  `---´     ',
  ],
  turtle: [
    '            ',
    '   _,--._   ',
    '  ( {E}  {E} )  ',
    ' /[______]\\ ',
    '  ``    ``  ',
  ],
  snail: [
    '            ',
    ' {E}    .--.  ',
    '  \\  ( @ )  ',
    '   \\_`--´   ',
    '  ~~~~~~~   ',
  ],
  ghost: [
    '            ',
    '   .----.   ',
    '  / {E}  {E} \\  ',
    '  |      |  ',
    '  ~`~``~`~  ',
  ],
  axolotl: [
    '            ',
    '}~(______)~{',
    '}~({E} .. {E})~{',
    '  ( .--. )  ',
    '  (_/  \\_)  ',
  ],
  capybara: [
    '            ',
    '  n______n  ',
    ' ( {E}    {E} ) ',
    ' (   oo   ) ',
    '  `------´  ',
  ],
  cactus: [
    '            ',
    ' n  ____  n ',
    ' | |{E}  {E}| | ',
    ' |_|    |_| ',
    '   |    |   ',
  ],
  robot: [
    '            ',
    '   .[||].   ',
    '  [ {E}  {E} ]  ',
    '  [ ==== ]  ',
    '  `------´  ',
  ],
  rabbit: [
    '            ',
    '   (\\__/)   ',
    '  ( {E}  {E} )  ',
    ' =(  ..  )= ',
    '  (")__(")  ',
  ],
  mushroom: [
    '            ',
    ' .-o-OO-o-. ',
    '(__________)',
    '   |{E}  {E}|   ',
    '   |____|   ',
  ],
  chonk: [
    '            ',
    '  /\\    /\\  ',
    ' ( {E}    {E} ) ',
    ' (   ..   ) ',
    '  `------´  ',
  ],
}

const HAT_LINES: Record<Hat, string> = {
  none: '',
  crown: '   \\^^^/    ',
  tophat: '   [___]    ',
  propeller: '    -+-     ',
  halo: '   (   )    ',
  wizard: '    /^\\     ',
  beanie: '   (___)    ',
  tinyduck: '    ,>      ',
}

export function renderSprite(bones: CompanionBones): string[] {
  const body = BODIES[bones.species].map((line) =>
    line.replaceAll('{E}', bones.eye),
  )
  const lines = [...body]
  // Place hat on blank line 0
  if (bones.hat !== 'none' && !lines[0]!.trim()) {
    lines[0] = HAT_LINES[bones.hat]
  }
  // Trim blank hat slot when unused (all frame-0 line-0s are blank)
  if (!lines[0]!.trim()) {
    lines.shift()
  }
  return lines
}
