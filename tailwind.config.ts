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
      // Add the new font families here
      fontFamily: {
        sans: ['var(--font-ruwudu)'],
        dancing: ['var(--font-dancing-script)'],
      },
    },
  },
  plugins: [],
}
export default config
