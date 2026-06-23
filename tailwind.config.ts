import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16285a',
        muted: '#68779f',
        line: '#dfe8fb',
        panel: '#f7fbff',
        brand: {
          50: '#eef6ff',
          100: '#dbeaff',
          500: '#3b82f6',
          600: '#2563eb'
        }
      },
      boxShadow: {
        panel: '0 18px 50px rgba(52, 93, 167, 0.13)',
        card: '0 14px 36px rgba(65, 93, 154, 0.11)',
        glow: '0 0 0 1px rgba(68, 126, 255, 0.42), 0 22px 60px rgba(72, 127, 255, 0.24)'
      }
    }
  },
  plugins: []
} satisfies Config
