'use client'

import { useState } from 'react'
import { SpritePreview } from './SpritePreview'
import type { BuddyEntry } from '@/lib/database'
import {
  RARITY_COLORS,
  RARITY_STARS,
  type CompanionBones,
  type Eye,
  type Hat,
  type Rarity,
  type Species,
} from '@/lib/types'

type Props = {
  species: Species
  rarity: Rarity
  entry: BuddyEntry
  command: string
  entryIndex: number
  totalEntries: number
  onShuffle: () => void
}

function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false)
  }
  // Fallback for older browsers / non-HTTPS
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve(ok)
}

export function ResultCard({
  species,
  rarity,
  entry,
  command,
  entryIndex,
  totalEntries,
  onShuffle,
}: Props) {
  const [copied, setCopied] = useState(false)

  const bones: CompanionBones = {
    species,
    rarity,
    eye: entry.eye as Eye,
    hat: entry.hat as Hat,
    shiny: entry.shiny,
    stats: entry.stats as CompanionBones['stats'],
  }
  const color = RARITY_COLORS[rarity]

  const handleCopy = async () => {
    const ok = await copyToClipboard(command)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="rounded-[30px] border border-accent/25 bg-surface/80 p-6 shadow-[0_40px_100px_-48px_rgba(0,0,0,0.95)] backdrop-blur md:p-7"
      style={{ boxShadow: `0 42px 90px -52px ${color}` }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
            02
          </p>
          <h2 className="text-2xl text-text sm:text-3xl">Companion profile</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Your reveal is locked in. Copy the deployment command for this
            species and rarity, or cycle through alternate matches in the same
            bucket.
          </p>
        </div>
        <div
          className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{
            borderColor: `${color}55`,
            backgroundColor: `${color}14`,
            color,
          }}
        >
          <span>{RARITY_STARS[rarity]}</span>
          <span>{rarity}</span>
          {entry.shiny ? <span>shiny</span> : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_1fr]">
        <div className="flex min-h-[17rem] items-center justify-center rounded-[24px] border border-white/5 bg-panel/80 p-5">
          <SpritePreview bones={bones} large />
        </div>

        <div className="grid gap-5">
          <section className="rounded-[24px] border border-white/5 bg-panel/80 p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl capitalize text-text">
                  Your {rarity} {species}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  Trait details are grouped here so the sprite and the lookup
                  metadata read like one profile instead of separate widgets.
                </p>
              </div>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color }}
              >
                {entry.shiny ? 'shiny variant' : 'standard profile'}
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-white/5 bg-bg/40 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  Eye
                </dt>
                <dd className="mt-2 text-lg text-text">{entry.eye}</dd>
              </div>
              <div className="rounded-[18px] border border-white/5 bg-bg/40 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  Hat
                </dt>
                <dd className="mt-2 text-lg capitalize text-text">
                  {entry.hat === 'none' ? 'None' : entry.hat}
                </dd>
              </div>
              <div className="rounded-[18px] border border-white/5 bg-bg/40 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  Shiny
                </dt>
                <dd className="mt-2 text-lg text-text">
                  {entry.shiny ? 'Yes ✨' : 'No'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[24px] border border-white/5 bg-panel/80 p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                  Deployment command
                </label>
                <p className="text-sm leading-relaxed text-muted">
                  Run this command to apply a buddy from this species and
                  rarity bucket in Claude Code.
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="rounded-full border px-4 py-2 text-sm transition-colors"
                style={{
                  color: copied ? 'rgb(var(--success))' : 'rgb(var(--text-0))',
                  borderColor: copied
                    ? 'rgb(var(--success) / 0.45)'
                    : 'rgb(var(--text-0) / 0.12)',
                  backgroundColor: copied
                    ? 'rgb(var(--success) / 0.08)'
                    : 'rgb(var(--bg-0) / 0.25)',
                }}
              >
                {copied ? 'Copied' : 'Copy command'}
              </button>
            </div>

            <code className="block overflow-x-auto rounded-[18px] border border-white/5 bg-bg/55 px-4 py-3 text-sm select-all">
              {command}
            </code>

            {totalEntries > 1 && (
              <button
                onClick={onShuffle}
                className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-muted transition-colors hover:text-text"
              >
                ↻ Show another ({entryIndex + 1}/{totalEntries})
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
