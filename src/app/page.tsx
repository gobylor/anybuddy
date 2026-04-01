'use client'

import { useEffect, useRef, useState } from 'react'
import { SpeciesGrid } from '@/components/SpeciesGrid'
import { RarityPicker } from '@/components/RarityPicker'
import { ResultCard } from '@/components/ResultCard'
import { Instructions } from '@/components/Instructions'
import { lookup } from '@/lib/database'
import type { Rarity, Species } from '@/lib/types'

const PHASES = ['Pick Species', 'Pick Rarity', 'Copy UserID'] as const

export default function Home() {
  const [species, setSpecies] = useState<Species | null>(null)
  const [rarity, setRarity] = useState<Rarity | null>(null)
  const [entryIndex, setEntryIndex] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)

  const phase = !species ? 0 : !rarity ? 1 : 2

  // Reset entry index when selection changes
  useEffect(() => {
    setEntryIndex(0)
  }, [species, rarity])

  // Auto-scroll to result when both selected
  useEffect(() => {
    if (species && rarity && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [species, rarity])

  const handleSpeciesSelect = (s: Species) => {
    setSpecies(s)
    // Auto-select legendary on first species pick
    if (!rarity) setRarity('legendary')
  }

  const entries = species && rarity ? lookup(species, rarity) : []
  const entry = entries[entryIndex % Math.max(entries.length, 1)] ?? null

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-accent mb-2">
          AnyBuddy
        </h1>
        <div className="space-y-1">
          <p
            className="text-sm sm:text-base text-text"
            lang="zh-CN"
          >
            抽卡靠运气，换卡靠 <span className="text-accent font-bold">AnyBuddy</span>。
          </p>
          <p className="text-sm sm:text-base text-text font-semibold tracking-[0.04em]">
            Any Buddy You Want.
          </p>
        </div>
        <p className="text-muted text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Pick any Claude Code <code className="text-text">/buddy</code>{' '}
          companion you want, browse all 18 species and every rarity, and copy a
          matching user ID in seconds.
        </p>
      </div>

      {/* Phase indicator */}
      <div className="flex justify-center gap-4 mb-8 text-xs">
        {PHASES.map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 ${i <= phase ? 'text-accent' : 'text-muted'}`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < phase
                  ? 'bg-accent text-[#0d1117]'
                  : i === phase
                    ? 'border-2 border-accent'
                    : 'border border-[#30363d]'
              }`}
            >
              {i < phase ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      {/* Species grid */}
      <section className="mb-6">
        <SpeciesGrid selected={species} onSelect={handleSpeciesSelect} />
      </section>

      {/* Rarity picker */}
      <section className="mb-8">
        <RarityPicker selected={rarity} onSelect={setRarity} />
      </section>

      {/* Result + Instructions */}
      <div ref={resultRef}>
        {species && rarity && entry ? (
          <>
            <ResultCard
              species={species}
              rarity={rarity}
              entry={entry}
              entryIndex={entryIndex}
              totalEntries={entries.length}
              onShuffle={() =>
                setEntryIndex((i) => (i + 1) % entries.length)
              }
            />
            <Instructions
              species={species}
              rarity={rarity}
              userID={entry.userID}
            />
          </>
        ) : (
          <div className="text-center text-muted py-12 border-2 border-dashed border-[#30363d] rounded-lg">
            Pick a species above to see your buddy
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-[#30363d] text-center text-xs text-muted">
        <p>
          Not affiliated with Anthropic. Community tool based on public
          information.
        </p>
        <p className="mt-1">
          Works with Claude Code v2.1.x · SALT: friend-2026-401
        </p>
      </footer>
    </main>
  )
}
