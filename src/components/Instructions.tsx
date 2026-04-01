'use client'

export function Instructions() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.9fr)]">
      <section className="rounded-[28px] border border-white/5 bg-panel/80 p-5 shadow-[0_28px_70px_-44px_rgba(0,0,0,0.95)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h3 className="text-xl text-text sm:text-2xl">How to apply</h3>
            <p className="text-sm leading-relaxed text-muted">
              The command now lives in the result card so the primary action
              stays centered on the reveal.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          The CLI still handles OAuth login and config setup. After it
          finishes, restart your terminal, run{' '}
          <code className="text-accent">claude</code>, and type{' '}
          <code className="text-accent">/buddy</code> when you’re ready to
          continue.
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
