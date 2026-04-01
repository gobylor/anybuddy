'use client'

import { useEffect, useRef, useState } from 'react'
import { SpeciesGrid } from '@/components/SpeciesGrid'
import { RarityPicker } from '@/components/RarityPicker'
import { ResultCard } from '@/components/ResultCard'
import { Instructions } from '@/components/Instructions'
import { lookup } from '@/lib/database'
import type { Rarity, Species } from '@/lib/types'

export default function Home() {
  const [species, setSpecies] = useState<Species | null>(null)
  const [rarity, setRarity] = useState<Rarity | null>(null)
  const [entryIndex, setEntryIndex] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)

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

      <section
        aria-labelledby="species-heading"
        className="mb-6 rounded-[28px] border border-border/20 bg-surface/70 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur md:p-6"
      >
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
              01
            </p>
            <h2 id="species-heading" className="text-2xl text-text sm:text-3xl">
              Species gallery
            </h2>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              Start with the companion type. The first pick still auto-primes
              legendary so the reveal stays immediate.
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Selection studio
          </p>
        </div>
        <SpeciesGrid selected={species} onSelect={handleSpeciesSelect} />
      </section>

      <section
        aria-labelledby="rarity-heading"
        className="mb-8 rounded-[28px] border border-white/5 bg-panel/70 p-5 backdrop-blur md:p-6"
      >
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              Secondary pass
            </p>
            <h2 id="rarity-heading" className="text-xl text-text sm:text-2xl">
              Rarity filter
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            Refine the reveal by rarity without losing the fast species to
            profile flow.
          </p>
        </div>
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
          <div className="rounded-lg border-2 border-dashed border-[#30363d] py-12 text-center text-muted">
            Choose a species to reveal your companion profile.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5 pt-6 text-center text-xs text-muted">
        <p>
          Not affiliated with Anthropic. Community tool based on public
          information.
        </p>
        <p className="mt-1">
          Works with Claude Code v2.1.x · SALT: friend-2026-401
        </p>
        <p className="mt-3 font-mono uppercase tracking-[0.22em] text-accent/70">
          Lor —— AI Builder
        </p>
      </footer>
    </main>
  )
}
