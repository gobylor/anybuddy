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
      <section className="mb-10 sm:mb-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent/80">
            A small utility by Lor —— AI Builder
          </p>
          <h1
            className="text-5xl font-semibold leading-none text-accent sm:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AnyBuddy
          </h1>
          <p
            className="text-base text-text sm:text-lg"
            lang="zh-CN"
          >
            抽卡靠运气，换卡靠{' '}
            <span className="font-semibold text-accent">AnyBuddy</span>。
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/80 sm:text-base">
            Any Buddy You Want.
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Pick the exact Claude Code buddy you want.
          </p>
        </div>
      </section>

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
            <Instructions species={species} rarity={rarity} />
          </>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-[#30363d] py-12 text-center text-muted">
            Choose a species to reveal your companion profile.
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
