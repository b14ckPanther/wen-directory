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
      },
      // Animations for the dashboard
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config