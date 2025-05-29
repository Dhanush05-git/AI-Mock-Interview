// tailwind.config.js
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
          // etc.
        },
        borderRadius: {
          sm: 'calc(var(--radius) - 4px)',
          md: 'calc(var(--radius) - 2px)',
          lg: 'var(--radius)',
          xl: 'calc(var(--radius) + 4px)',
        },
      },
    },
    plugins: [require('tw-animate-css')],
    theme: {
      extend: {
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
        },
        animation: {
          fadeInScale: 'fadeInScale 0.3s ease forwards',
          slideInRight: 'slideInRight 0.4s ease forwards',
          slideInLeft: 'slideInLeft 0.4s ease forwards',
        },
      },
    },
    // Removed invalid CSS block from the JavaScript configuration file

    
  }
  