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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {SPECIES.map((species) => {
        const isSelected = selected === species
        return (
          <button
            key={species}
            onClick={() => onSelect(species)}
            aria-label={`Select ${species}`}
            className={`
              group flex min-h-[10.5rem] cursor-pointer flex-col items-center justify-between
              gap-3 rounded-[24px] border px-3 py-4 text-left transition duration-200
              hover:-translate-y-1 hover:border-accent/45 hover:bg-surface-strong/90
              ${isSelected
                ? 'border-accent/55 bg-accent/10 shadow-[0_26px_60px_-36px_rgba(201,139,73,0.85)]'
                : 'border-white/5 bg-surface/65 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.85)]'}
            `}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
              species
            </span>
            <SpritePreview bones={previewBones(species)} />
            <div className="space-y-1">
              <span
                className={`block text-sm capitalize tracking-[0.08em] ${
                  isSelected ? 'text-accent' : 'text-text'
                }`}
              >
                {species}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {isSelected ? 'profile armed' : 'ready to reveal'}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
