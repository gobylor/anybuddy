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
    const ok = await copyToClipboard(entry.userID)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="rounded-lg border-2 p-6"
      style={{ borderColor: color, backgroundColor: `${color}08` }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold capitalize" style={{ color }}>
          Your {rarity} {species}
        </h2>
        <p className="text-sm" style={{ color }}>
          {RARITY_STARS[rarity]}
          {entry.shiny ? ' ✨ Shiny!' : ''}
        </p>
      </div>

      {/* Sprite + info — stack on mobile, side-by-side on sm+ */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-center">
        <SpritePreview bones={bones} large />
        <div className="flex flex-col gap-2 text-sm">
          <p>
            <span className="text-muted">Eye:</span> {entry.eye}
          </p>
          <p>
            <span className="text-muted">Hat:</span>{' '}
            {entry.hat === 'none' ? '—' : entry.hat}
          </p>
          <p>
            <span className="text-muted">Shiny:</span>{' '}
            {entry.shiny ? 'Yes ✨' : 'No'}
          </p>
        </div>
      </div>

      {/* UserID + Copy */}
      <div className="mt-6 flex flex-col gap-3">
        <label className="text-xs text-muted">Your userID:</label>
        <div className="flex gap-2">
          <code className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm font-mono select-all overflow-x-auto">
            {entry.userID}
          </code>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded border transition-colors cursor-pointer whitespace-nowrap text-sm"
            style={{
              color: copied ? '#7ee787' : '#e6edf3',
              borderColor: copied ? '#7ee787' : '#30363d',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {totalEntries > 1 && (
          <button
            onClick={onShuffle}
            className="text-xs text-muted hover:text-text transition-colors cursor-pointer self-start"
          >
            ↻ Show another ({entryIndex + 1}/{totalEntries})
          </button>
        )}
      </div>
    </div>
  )
}
