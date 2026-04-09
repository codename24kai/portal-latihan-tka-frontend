/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          dark: '#5A4BD1',
          light: '#A29BFE',
          50: '#F0EEFF',
        },
        secondary: {
          DEFAULT: '#00CEC9',
          dark: '#00B5B0',
          light: '#55EFC4',
        },
        accent: {
          DEFAULT: '#FD79A8',
          dark: '#E84393',
          light: '#FEB3D2',
        },
        surface: '#F8F9FE',
        card: '#FFFFFF',
        dark: {
          DEFAULT: '#1E1E2E',
          surface: '#2D2D44',
          text: '#A0A0B8',
          border: '#3D3D55',
        },
        correct: '#00B894',
        incorrect: '#E17055',
        warning: '#FDCB6E',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(108, 92, 231, 0.08)',
        'card-hover': '0 8px 24px rgba(108, 92, 231, 0.15)',
        'glow': '0 0 20px rgba(108, 92, 231, 0.25)',
        'option': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'option-active': '0 4px 16px rgba(108, 92, 231, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}