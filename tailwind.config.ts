// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0B132B',
        'gold': '#FFD700',
        'emerald': '#2ECC71',
        'gray': {
          DEFAULT: '#EAEAEA',
          dark: '#C0C0C0'
        }
      },
      fontFamily: {
        sans: ['var(--font-noto-kufi)'],
        dancing: ['var(--font-dancing-script)'],
        ruwudu: ['var(--font-ruwudu)'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '.5',
            transform: 'scale(0.95)',
          },
        },
        'bg-pan': { // Renamed from text-gradient-pan for generic use
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'star-field': {
          'from': { transform: 'translateY(0px)' },
          'to': { transform: 'translateY(-2000px)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bg-pan': 'bg-pan 4s ease-in-out infinite', // Can be used for text and backgrounds
        'star-field': 'star-field 60s linear infinite',
      },
      backgroundImage: {
        'star-field': "url('https://www.transparenttextures.com/patterns/stardust.png')",
      }
    },
  },
  plugins: [],
}
export default config