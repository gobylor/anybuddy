import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SF Mono',
          'Fira Code',
          'monospace',
        ],
      },
      colors: {
        bg: '#0d1117',
        text: '#e6edf3',
        muted: '#8b949e',
        accent: '#ffa657',
        success: '#7ee787',
        sprite: '#7ee787',
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
