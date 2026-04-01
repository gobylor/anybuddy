'use client'

import { useState } from 'react'
import { buildCliCommand } from '@/lib/cli-command'

function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false)
  }
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

export function Instructions({
  species,
  rarity,
  userID,
}: {
  species: string
  rarity: string
  userID: string
}) {
  const [copied, setCopied] = useState(false)

  const command = buildCliCommand({ species, rarity, userID })

  const handleCopy = async () => {
    const ok = await copyToClipboard(command)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold text-text">How to apply</h3>

      <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
        <p className="font-bold text-accent mb-3">
          Run this in your terminal:
        </p>

        <div className="relative group">
          <pre className="bg-[#0d1117] p-3 pr-20 rounded text-sm overflow-x-auto text-text/80 leading-relaxed">
            {command}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all border"
            style={{
              color: copied ? '#7ee787' : '#e6edf3',
              borderColor: copied ? '#7ee787' : '#30363d',
              backgroundColor: copied ? '#7ee78715' : '#161b22',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <p className="text-xs text-muted mt-3">
          The CLI handles everything: OAuth login, config setup, and exact buddy injection.
          <br />
          After it finishes, restart your terminal, run{' '}
          <code className="text-accent">claude</code>, type{' '}
          <code className="text-accent">/buddy</code>.
        </p>
      </div>

      {/* Recovery */}
      <div className="p-3 bg-[#1c1206] rounded-lg border border-accent/30 text-xs">
        <p className="text-accent font-bold mb-1">Something went wrong?</p>
        <p className="text-muted">Restore your backup:</p>
        <code className="block bg-[#0d1117] p-2 rounded mt-1 overflow-x-auto">
          cp ~/.claude.json.bak ~/.claude.json
        </code>
      </div>
    </div>
  )
}
