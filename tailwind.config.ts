import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: [
          'var(--font-display)',
          'Segoe UI',
          'sans-serif',
        ],
        sans: [
          'var(--font-body)',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SF Mono',
          'Fira Code',
          'monospace',
        ],
      },
      colors: {
        bg: 'rgb(var(--bg-0) / <alpha-value>)',
        panel: 'rgb(var(--bg-1) / <alpha-value>)',
        elevated: 'rgb(var(--bg-2) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-strong': 'rgb(var(--surface-strong) / <alpha-value>)',
        text: 'rgb(var(--text-0) / <alpha-value>)',
        muted: 'rgb(var(--text-1) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        border: 'rgb(var(--line) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        sprite: 'rgb(var(--sprite) / <alpha-value>)',
        rarity: {
          common: '#8b949e',
          uncommon: '#7ee787',
          rare: '#79c0ff',
          epic: '#d2a8ff',
          legendary: '#ffa657',
        },
      },
    },
  },
  plugins: [],
}
export default config
