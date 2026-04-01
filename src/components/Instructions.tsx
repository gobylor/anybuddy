'use client'

import { useEffect, useState } from 'react'

type OS = 'mac' | 'windows' | 'linux'

function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'mac'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('linux')) return 'linux'
  return 'mac'
}

function configPath(os: OS): string {
  return os === 'windows' ? '%USERPROFILE%\\.claude.json' : '~/.claude.json'
}

function backupCmd(os: OS): string {
  return os === 'windows'
    ? 'copy %USERPROFILE%\\.claude.json %USERPROFILE%\\.claude.json.bak'
    : 'cp ~/.claude.json ~/.claude.json.bak'
}

function restoreCmd(os: OS): string {
  return os === 'windows'
    ? 'copy %USERPROFILE%\\.claude.json.bak %USERPROFILE%\\.claude.json'
    : 'cp ~/.claude.json.bak ~/.claude.json'
}

export function Instructions({ userID }: { userID: string }) {
  const [os, setOS] = useState<OS>('mac')

  useEffect(() => {
    setOS(detectOS())
  }, [])

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold text-text">How to apply</h3>

      <div className="space-y-3 text-sm">
        {/* Step 0: Backup */}
        <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
          <p className="font-bold text-accent mb-2">Step 0: Backup first</p>
          <code className="block bg-[#0d1117] p-2 rounded text-xs overflow-x-auto">
            {backupCmd(os)}
          </code>
        </div>

        {/* Step 1: Close */}
        <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
          <p className="font-bold text-text mb-2">
            Step 1: Close Claude Code completely
          </p>
          <p className="text-muted">
            Make sure Claude Code is fully closed before editing the config
            file.
          </p>
        </div>

        {/* Step 2: Open + before/after */}
        <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
          <p className="font-bold text-text mb-2">
            Step 2: Open{' '}
            <code className="text-accent">{configPath(os)}</code>
          </p>
          <p className="text-muted mb-2">
            Open the file in any text editor. Look for these fields:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted mb-1">Before:</p>
              <pre className="bg-[#0d1117] p-2 rounded text-xs overflow-x-auto text-red-400">
{`{
  ...
  "userID": "your-old-id",
  "companion": { ... },
  ...
}`}
              </pre>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">After:</p>
              <pre className="bg-[#0d1117] p-2 rounded text-xs overflow-x-auto text-success">
{`{
  ...
  "userID": "${userID}",
  ...
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Step 3: Edit */}
        <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
          <p className="font-bold text-text mb-2">
            Step 3: Replace userID &amp; delete companion
          </p>
          <ol className="list-decimal list-inside text-muted space-y-1">
            <li>
              Replace the <code className="text-text">&quot;userID&quot;</code>{' '}
              value with the one above
            </li>
            <li>
              Delete the entire{' '}
              <code className="text-text">&quot;companion&quot;</code> object (if
              it exists)
            </li>
            <li>Save the file</li>
          </ol>
        </div>

        {/* Step 4: Restart */}
        <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
          <p className="font-bold text-text mb-2">
            Step 4: Restart Claude Code and type{' '}
            <code className="text-accent">/buddy</code>
          </p>
          <p className="text-muted">Your new buddy will hatch!</p>
        </div>

        {/* Recovery */}
        <div className="p-3 bg-[#1c1206] rounded-lg border border-accent/30 text-xs">
          <p className="text-accent font-bold mb-1">Something went wrong?</p>
          <p className="text-muted">Restore your backup:</p>
          <code className="block bg-[#0d1117] p-2 rounded mt-1 overflow-x-auto">
            {restoreCmd(os)}
          </code>
        </div>
      </div>
    </div>
  )
}
