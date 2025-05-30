// tailwind.config.js
const plugin = require('tw-animate-css');

module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'rgb(58, 59, 119)',
        secondary: 'var(--secondary)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      keyframes: {
        fadeInScale: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        bounceRocket: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(-10deg)',
          },
        },
      },
      animation: {
        fadeInScale: 'fadeInScale 0.3s ease forwards',
        slideInRight: 'slideInRight 0.4s ease forwards',
        slideInLeft: 'slideInLeft 0.4s ease forwards',
        'custom-bounce': 'bounceRocket 2s infinite',
      },
    },
  },
  plugins: [plugin],
};
