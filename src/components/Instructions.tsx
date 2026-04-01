'use client'

import { useState } from 'react'

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

export function Instructions({ species, rarity }: { species: string; rarity: string }) {
  const [copied, setCopied] = useState(false)

  const command = `npx @openlor/anybuddy --species ${species} --rarity ${rarity}`

  const handleCopy = async () => {
    const ok = await copyToClipboard(command)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.9fr)]">
      <section className="rounded-[28px] border border-white/5 bg-panel/80 p-5 shadow-[0_28px_70px_-44px_rgba(0,0,0,0.95)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h3 className="text-xl text-text sm:text-2xl">How to apply</h3>
            <p className="text-sm leading-relaxed text-muted">
              Run the command below to inject this exact profile into Claude
              Code.
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/80">
            Deployment command
          </p>
        </div>

        <div className="relative">
          <pre className="overflow-x-auto rounded-[20px] border border-white/5 bg-bg/60 p-4 pr-28 text-sm leading-relaxed text-text/80">
            {command}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 rounded-full border px-3 py-1.5 text-xs transition-all"
            style={{
              color: copied ? 'rgb(var(--success))' : 'rgb(var(--text-0))',
              borderColor: copied
                ? 'rgb(var(--success) / 0.45)'
                : 'rgb(var(--text-0) / 0.12)',
              backgroundColor: copied
                ? 'rgb(var(--success) / 0.08)'
                : 'rgb(var(--surface) / 0.9)',
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          The CLI handles everything: OAuth login, config setup, and buddy injection.
          <br />
          After it finishes, restart your terminal, run{' '}
          <code className="text-accent">claude</code>, type{' '}
          <code className="text-accent">/buddy</code>.
        </p>
      </section>

      <aside className="rounded-[28px] border border-accent/20 bg-accent/10 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/80">
          Recovery
        </p>
        <h4 className="mt-2 text-lg text-text">Something went wrong?</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Restore your backup and rerun the command if the profile injection
          gets interrupted.
        </p>
        <code className="mt-4 block overflow-x-auto rounded-[18px] border border-accent/20 bg-bg/55 p-3 text-sm">
          cp ~/.claude.json.bak ~/.claude.json
        </code>
      </aside>
    </div>
  )
}
