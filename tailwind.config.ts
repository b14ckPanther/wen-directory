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
        // Animations for the simple loader and general UI
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.5', transform: 'scale(0.95)' },
        },
        // Animations for the "out of this world" loader
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
          '25%, 75%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        // Animations for the home page
        'bg-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'star-field': {
          'from': { transform: 'translateY(0px)' },
          'to': { transform: 'translateY(-2000px)' },
        },
        // Animation for the Category Grid
        glint: {
          '0%': { transform: 'translateX(-200%) scale(2)' },
          '100%': { transform: 'translateX(200%) scale(2)' },
        },
        // Animation for the Login Page
        'hologram-border': {
          '0%, 100%': {
            borderColor: 'rgba(255, 215, 0, 0.2)',
            boxShadow: '0 0 5px rgba(255, 215, 0, 0.2), inset 0 0 5px rgba(255, 215, 0, 0.1)',
          },
          '50%': {
            borderColor: 'rgba(255, 215, 0, 0.8)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 10px rgba(255, 215, 0, 0.4)',
          },
        },
      },
      animation: {
        // General UI animations
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // ✅ UPDATED: Loader animations with shorter durations
        'orb-glow': 'orb-glow 2.5s ease-in-out infinite',
        'orbit-cw': 'orbit-cw 15s linear infinite',
        'orbit-ccw': 'orbit-cw 15s linear infinite', // Corrected to use the right keyframe
        'text-fade': 'text-fade 10s ease-in-out infinite',
        'text-fade-delay': 'text-fade 10s 5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'star-twinkle': 'star-twinkle 1.5s ease-in-out infinite alternate',

        // Home page animations
        'bg-pan': 'bg-pan 4s ease-in-out infinite',
        'star-field': 'star-field 60s linear infinite',
        // Category grid animation
        glint: 'glint 0.5s ease-out',
        // Login page animation
        'hologram-border': 'hologram-border 4s ease-in-out infinite',
      },
      backgroundImage: {
        'star-field': "url('https://www.transparenttextures.com/patterns/stardust.png')",
      }
    },
  },
  plugins: [],
}
export default config