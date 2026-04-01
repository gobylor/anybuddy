'use client'

import { SpritePreview } from './SpritePreview'
import { SPECIES, type CompanionBones, type Species } from '@/lib/types'

type Props = {
  selected: Species | null
  onSelect: (species: Species) => void
}

function previewBones(species: Species): CompanionBones {
  return {
    species,
    rarity: 'common',
    eye: '·',
    hat: 'none',
    shiny: false,
    stats: { DEBUGGING: 50, PATIENCE: 50, CHAOS: 50, WISDOM: 50, SNARK: 50 },
  }
}

export function SpeciesGrid({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {SPECIES.map((species) => {
        const isSelected = selected === species
        return (
          <button
            key={species}
            onClick={() => onSelect(species)}
            aria-label={`Select ${species}`}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-lg border-2
              transition-colors cursor-pointer
              ${isSelected
                ? 'border-accent bg-[#1c1206]'
                : 'border-[#30363d] bg-[#161b22] hover:border-[#484f58]'}
            `}
          >
            <SpritePreview bones={previewBones(species)} />
            <span
              className={`text-xs capitalize ${isSelected ? 'text-accent' : 'text-muted'}`}
            >
              {species}
            </span>
          </button>
        )
      })}
    </div>
  )
}
