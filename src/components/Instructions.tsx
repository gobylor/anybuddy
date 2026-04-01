'use client'

export function Instructions() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.9fr)]">
      <section className="rounded-[28px] border border-border/65 bg-surface p-5 shadow-[0_22px_54px_-44px_rgba(39,76,69,0.22)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              Utility notes
            </p>
            <h3 className="text-xl text-text sm:text-2xl">Application notes</h3>
            <p className="text-sm leading-relaxed text-muted">
              The command lives inside the dossier so the main action stays
              attached to the selected reveal.
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

      <aside className="rounded-[28px] border border-[#7ec6b1]/35 bg-[#e8f4f0] p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#3e6d61]">
          Recovery note
        </p>
        <h4 className="mt-2 text-lg text-text">Something went wrong?</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Restore your backup and rerun the command if the profile injection
          gets interrupted.
        </p>
        <code className="mt-4 block overflow-x-auto rounded-[18px] border border-[#7ec6b1]/45 bg-surface p-3 text-sm">
          cp ~/.claude.json.bak ~/.claude.json
        </code>
      </aside>
    </div>
  )
}
