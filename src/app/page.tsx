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
    <main className="px-4 py-4 sm:px-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-surface/90 shadow-[0_36px_110px_-56px_rgba(39,76,69,0.32)] sm:rounded-[40px]">
          <div className="absolute inset-x-0 top-0 h-2.5 bg-[linear-gradient(90deg,rgba(126,198,177,0.88),rgba(39,76,69,0.22),rgba(126,198,177,0.55))]" />
          <div className="pointer-events-none absolute inset-x-10 top-2.5 h-px bg-border/55" />

          <div className="relative px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12 lg:px-12 lg:pb-14 lg:pt-14">
            <section className="editorial-rise border-b border-border/55 pb-10 sm:pb-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl space-y-4 sm:space-y-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-muted sm:text-[12px]">
                    Selection sheet / editorial utility
                  </p>
                  <h1 className="max-w-3xl text-[4rem] font-semibold leading-[0.86] tracking-[-0.06em] text-text sm:text-[6rem] lg:text-[7.25rem]">
                    AnyBuddy
                  </h1>
                  <p className="max-w-2xl text-lg text-text sm:text-[1.35rem]" lang="zh-CN">
                    抽卡靠运气，换卡靠{' '}
                    <span className="font-semibold text-[#3e6d61]">AnyBuddy</span>
                    。
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted sm:text-[12px]">
                    Any Buddy You Want.
                  </p>
                  <p className="max-w-[38rem] text-base leading-relaxed text-muted sm:text-lg">
                    Choose a species, refine the rarity, and reveal the
                    companion dossier that best fits your Claude Code setup.
                  </p>
                </div>

                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View AnyBuddy repository on GitHub"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-[18px] border border-border/70 bg-bg/65 text-muted transition duration-200 hover:-translate-y-0.5 hover:border-[#3e6d61]/45 hover:bg-surface-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3e6d61]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
            </section>

            <section
              aria-labelledby="species-heading"
              className="editorial-rise mt-8 rounded-[28px] border border-border/70 bg-[#fffdf9]/88 p-5 shadow-[0_24px_70px_-52px_rgba(39,76,69,0.32)] md:p-6"
            >
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                    01
                  </p>
                  <h2 id="species-heading" className="text-2xl text-text sm:text-3xl">
                    Species gallery
                  </h2>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">
                    Start with the companion type. The first selection still
                    primes legendary so the first reveal lands immediately.
                  </p>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                  Companion index
                </p>
              </div>
              <SpeciesGrid selected={species} onSelect={handleSpeciesSelect} />
            </section>

            <section
              aria-labelledby="rarity-heading"
              className="editorial-rise mt-6 rounded-[28px] border border-border/65 bg-bg/75 p-5 md:p-6"
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                    02
                  </p>
                  <h2 id="rarity-heading" className="text-xl text-text sm:text-2xl">
                    Rarity filter
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-muted">
                  Tune the dossier by rarity without interrupting the fast
                  species-to-result flow.
                </p>
              </div>
              <RarityPicker selected={rarity} onSelect={setRarity} />
            </section>

            <div ref={resultRef} className="mt-8">
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
                <section className="editorial-rise rounded-[28px] border border-dashed border-border/70 bg-bg/72 px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] sm:px-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                    03
                  </p>
                  <h2 className="mt-3 text-2xl text-text sm:text-[2rem]">
                    Companion dossier
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted">
                    Choose a species to open the companion dossier.
                  </p>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
                    Legendary is primed on the first pick so the reveal stays
                    immediate once you start.
                  </p>
                </section>
              )}
            </div>

            <footer className="editorial-rise mt-12 border-t border-border/60 pt-6 text-sm text-muted">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1.5">
                  <p>
                    Not affiliated with Anthropic. Community tool based on
                    public information.
                  </p>
                  <p>Works with Claude Code v2.1.x · SALT: friend-2026-401</p>
                </div>
                <p className="font-mono uppercase tracking-[0.22em] text-[#3e6d61]">
                  Lor —— AI Builder
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}
