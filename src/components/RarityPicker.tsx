'use client'

import { RARITIES, RARITY_COLORS, RARITY_STARS, type Rarity } from '@/lib/types'

type Props = {
  selected: Rarity | null
  onSelect: (rarity: Rarity) => void
}

export function RarityPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {RARITIES.map((rarity) => {
        const isSelected = selected === rarity
        const color = RARITY_COLORS[rarity]
        return (
          <button
            key={rarity}
            onClick={() => onSelect(rarity)}
            aria-pressed={isSelected}
            className="min-h-[44px] cursor-pointer rounded-full border px-4 py-2.5 text-sm capitalize tracking-[0.08em] transition duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: isSelected ? color : 'rgb(255 255 255 / 0.08)',
              backgroundColor: isSelected
                ? `${color}18`
                : 'rgb(var(--surface-strong) / 0.55)',
              color: isSelected ? color : 'rgb(var(--text-1))',
              boxShadow: isSelected
                ? `0 16px 32px -24px ${color}`
                : '0 12px 30px -28px rgb(0 0 0 / 0.85)',
            }}
          >
            <span className="mr-2 font-mono text-[11px] uppercase">
              {RARITY_STARS[rarity]}
            </span>
            {rarity}
          </button>
        )
      })}
    </div>
  )
}
