import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        outfit: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          mid: '#132240',
          light: '#1C3057',
        },
        teal: {
          DEFAULT: '#1A6B9C',
          light: '#2589BF',
        },
        amber: {
          DEFAULT: '#D4A843',
          light: '#ECC564',
          warm: '#F0C96E',
        },
        cream: '#F5EDD8',
        rope: '#8B6914',
      },
      animation: {
        'wave-slow': 'wave 12s linear infinite',
        'wave-mid': 'wave 9s linear infinite reverse',
        'wave-fast': 'wave 6s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
