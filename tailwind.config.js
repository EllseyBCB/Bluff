/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dunkle Lila-Farbwelt von "Wiz Bluff"
        wiz: {
          950: '#0d0620',
          900: '#150a33',
          800: '#1f1147',
          700: '#2c195f',
          600: '#3d2480',
          500: '#5a35b8',
          400: '#8b5cf6',
          300: '#b394ff',
          200: '#d6c5ff',
          100: '#efe8ff',
        },
        crystal: '#7ef3e1',
        gold: '#ffd166',
      },
      boxShadow: {
        glow: '0 0 24px rgba(139, 92, 246, 0.45)',
        'glow-sm': '0 0 12px rgba(139, 92, 246, 0.35)',
        crystal: '0 0 18px rgba(126, 243, 225, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(4deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        sparkle: 'sparkle 2.4s ease-in-out infinite',
        'pop-in': 'pop-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
