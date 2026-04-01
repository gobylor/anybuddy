'use client'

import { useState } from 'react'
import { SpritePreview } from './SpritePreview'
import type { BuddyEntry } from '@/lib/database'
import {
  HAT_LABELS,
  RARITY_COLORS,
  RARITY_LABELS,
  RARITY_STARS,
  SPECIES_LABELS,
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
      className="editorial-rise rounded-[30px] border border-border/70 bg-[#fffdf8]/92 p-6 shadow-[0_32px_88px_-54px_rgba(39,76,69,0.3)] md:p-7"
      style={{ boxShadow: `0 34px 88px -58px ${color}` }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            03
          </p>
          <h2 className="text-2xl text-text sm:text-3xl">伙伴档案</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            档案已生成。复制该物种和稀有度对应的命令，或浏览同一档案集中的其他条目。
          </p>
        </div>
        <div
          className="inline-flex w-fit items-center gap-2 rounded-[18px] border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{
            borderColor: `${color}55`,
            backgroundColor: `${color}18`,
            color,
          }}
        >
          <span>{RARITY_STARS[rarity]}</span>
          <span>{RARITY_LABELS[rarity]}</span>
          {entry.shiny ? <span>闪光</span> : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_1fr]">
        <div className="rounded-[24px] border border-border/65 bg-bg/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
            头像
          </p>
          <div className="flex min-h-[16rem] items-center justify-center">
            <SpritePreview bones={bones} large />
          </div>
          <p className="border-t border-border/60 pt-3 text-sm leading-relaxed text-muted">
            切换同一稀有度内的不同造型，视觉形象会变化但不影响已选等级。
          </p>
        </div>

        <div className="grid gap-5">
          <section className="rounded-[24px] border border-border/65 bg-surface p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl text-text">
                  你的{RARITY_LABELS[rarity]}{SPECIES_LABELS[species]}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  特征详情汇总在这里，头像与属性信息组合成一份完整的伙伴档案。
                </p>
              </div>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color }}
              >
                {entry.shiny ? '闪光变体' : '标准档案'}
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-border/60 bg-bg/58 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  眼睛
                </dt>
                <dd className="mt-2 text-lg text-text">{entry.eye}</dd>
              </div>
              <div className="rounded-[18px] border border-border/60 bg-bg/58 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  帽子
                </dt>
                <dd className="mt-2 text-lg text-text">
                  {HAT_LABELS[entry.hat as Hat]}
                </dd>
              </div>
              <div className="rounded-[18px] border border-border/60 bg-bg/58 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  闪光
                </dt>
                <dd className="mt-2 text-lg text-text">
                  {entry.shiny ? '是 ✨' : '否'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[24px] border border-border/65 bg-bg/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <div className="mb-3 space-y-1">
              <label className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                一键应用
              </label>
              <p className="text-sm leading-relaxed text-muted">
                复制以下命令并粘贴到终端中，即可将此伙伴应用到 Claude Code。
              </p>
            </div>

            <div className="group relative">
              <code className="block overflow-x-auto rounded-[18px] border border-border/60 bg-surface pl-4 pr-[7.5rem] py-3.5 text-sm select-all">
                {command}
              </code>
              <button
                onClick={handleCopy}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200"
                style={{
                  color: copied ? '#fff' : '#fff',
                  backgroundColor: copied
                    ? 'rgb(var(--success))'
                    : '#3e6d61',
                  boxShadow: copied
                    ? '0 2px 8px rgba(74,126,98,0.35)'
                    : '0 2px 8px rgba(62,109,97,0.3)',
                }}
              >
                {copied ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
                )}
                {copied ? '已复制！' : '复制'}
              </button>
            </div>

            {totalEntries > 1 && (
              <button
                onClick={onShuffle}
                className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-muted transition-colors hover:text-text"
              >
                换一个 ({entryIndex + 1}/{totalEntries})
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
