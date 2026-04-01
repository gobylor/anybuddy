'use client'

import { RARITIES, RARITY_COLORS, RARITY_STARS, type Rarity } from '@/lib/types'

type Props = {
  selected: Rarity | null
  onSelect: (rarity: Rarity) => void
}

export function RarityPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {RARITIES.map((rarity) => {
        const isSelected = selected === rarity
        const color = RARITY_COLORS[rarity]
        return (
          <button
            key={rarity}
            onClick={() => onSelect(rarity)}
            aria-pressed={isSelected}
            className="px-4 py-2 rounded-lg border-2 transition-colors cursor-pointer text-sm capitalize min-h-[44px]"
            style={{
              borderColor: isSelected ? color : '#30363d',
              backgroundColor: isSelected ? `${color}15` : '#161b22',
              color: isSelected ? color : '#8b949e',
            }}
          >
            <span className="mr-1">{RARITY_STARS[rarity]}</span>
            {rarity}
          </button>
        )
      })}
    </div>
  )
}
