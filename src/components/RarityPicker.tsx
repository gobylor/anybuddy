'use client'

import { RARITIES, RARITY_COLORS, RARITY_LABELS, RARITY_STARS, type Rarity } from '@/lib/types'

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
            className="min-h-[46px] cursor-pointer rounded-[18px] border px-4 py-2.5 text-sm tracking-[0.08em] transition duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: isSelected ? color : 'rgb(var(--line) / 0.72)',
              backgroundColor: isSelected
                ? `${color}1a`
                : 'rgb(var(--surface) / 0.82)',
              color: isSelected ? color : 'rgb(var(--text-1))',
              boxShadow: isSelected
                ? '0 16px 32px -24px rgb(39 76 69 / 0.22)'
                : '0 10px 26px -24px rgb(39 76 69 / 0.18)',
            }}
          >
            <span className="mr-2 font-mono text-[11px] uppercase">
              {RARITY_STARS[rarity]}
            </span>
            {RARITY_LABELS[rarity]}
          </button>
        )
      })}
    </div>
  )
}
