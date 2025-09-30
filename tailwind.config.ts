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
        'orb-glow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 30px #FFD700, 0 0 45px #FFD700' },
        },
        'orbit-cw': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-ccw': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'text-fade': {
          '0%': { opacity: '0' },
          '25%, 75%': { opacity: '1' }, // <-- This line is changed
          '100%': { opacity: '0' },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
      animation: {
        'orb-glow': 'orb-glow 4s ease-in-out infinite',
        'orbit-cw': 'orbit-cw 20s linear infinite',
        'orbit-ccw': 'orbit-ccw 20s linear infinite',
        'text-fade': 'text-fade 20s ease-in-out infinite',
        'text-fade-delay': 'text-fade 20s 10s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
        'star-twinkle': 'star-twinkle 3s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}
export default config