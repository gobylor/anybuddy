'use client'

export function Instructions() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.9fr)]">
      <section className="rounded-[28px] border border-border/65 bg-surface p-5 shadow-[0_22px_54px_-44px_rgba(39,76,69,0.22)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              使用说明
            </p>
            <h3 className="text-xl text-text sm:text-2xl">应用说明</h3>
            <p className="text-sm leading-relaxed text-muted">
              命令嵌入在档案中，主操作始终关联到所选的揭晓结果。
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          CLI 仍然负责 OAuth 登录和配置设置。完成后，请重启终端，运行{' '}
          <code className="text-accent">claude</code>，然后输入{' '}
          <code className="text-accent">/buddy</code> 即可继续。
        </p>
      </section>

      <aside className="rounded-[28px] border border-[#7ec6b1]/35 bg-[#e8f4f0] p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#3e6d61]">
          恢复提示
        </p>
        <h4 className="mt-2 text-lg text-text">出了问题？</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          如果配置注入过程中断，请恢复备份并重新运行命令。
        </p>
        <code className="mt-4 block overflow-x-auto rounded-[18px] border border-[#7ec6b1]/45 bg-surface p-3 text-sm">
          cp ~/.claude.json.bak ~/.claude.json
        </code>
      </aside>
    </div>
  )
}
