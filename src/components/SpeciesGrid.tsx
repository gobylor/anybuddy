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
            aria-pressed={isSelected}
            className={`
              group relative flex min-h-[11rem] cursor-pointer flex-col items-center justify-between
              gap-3 rounded-[24px] border px-3 py-4 text-left transition duration-200
              hover:-translate-y-1 hover:border-[#3e6d61]/45 hover:bg-surface-strong
              ${isSelected
                ? 'border-[#3e6d61]/70 bg-[#e6f2ee] shadow-[0_22px_52px_-36px_rgba(62,109,97,0.38)]'
                : 'border-border/65 bg-bg/65 shadow-[0_18px_44px_-38px_rgba(39,76,69,0.22)]'}
            `}
          >
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-border/80 bg-white/80" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">
              species
            </span>
            <SpritePreview bones={previewBones(species)} />
            <div className="space-y-1">
              <span
                className={`block text-sm capitalize tracking-[0.08em] ${
                  isSelected ? 'text-[#355f55]' : 'text-text'
                }`}
              >
                {species}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {isSelected ? 'dossier armed' : 'ready to file'}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
