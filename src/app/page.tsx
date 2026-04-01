'use client'

import { useEffect, useRef, useState } from 'react'
import { SpeciesGrid } from '@/components/SpeciesGrid'
import { RarityPicker } from '@/components/RarityPicker'
import { ResultCard } from '@/components/ResultCard'
import { Instructions } from '@/components/Instructions'
import { buildCliCommand } from '@/lib/cli-command'
import { lookup } from '@/lib/database'
import type { Rarity, Species } from '@/lib/types'

const GITHUB_REPO_URL = 'https://github.com/gobylor/anybuddy'

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
  const command =
    species && rarity && entry
      ? buildCliCommand({
          species,
          rarity,
        })
      : null

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <section className="mb-10 sm:mb-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-accent/80">
              A small utility by Lor —— AI Builder
            </p>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View AnyBuddy repository on GitHub"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/30 bg-panel/55 text-muted transition duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-panel/75 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="currentColor"
              >
                <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.56 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.07 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.6.23 2.78.11 3.07.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.2.67.79.56a11.53 11.53 0 0 0 7.84-10.92C23.5 5.66 18.35.5 12 .5Z" />
              </svg>
            </a>
          </div>
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
            Pick the Claude Code buddy vibe you want.
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
              command={command ?? ''}
              entryIndex={entryIndex}
              totalEntries={entries.length}
              onShuffle={() =>
                setEntryIndex((i) => (i + 1) % entries.length)
              }
            />
            <Instructions />
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
