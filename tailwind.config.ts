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
        sans:  ['var(--font-inter)',     'Inter',              'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        blush: {
          50:  '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
          400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
          800: '#9d174d', 900: '#831843', 950: '#500724',
        },
      },
      animation: {
        'float':       'float 4s ease-in-out infinite',
        'float-delay': 'float 4s ease-in-out 1.5s infinite',
        'float-slow':  'float 6s ease-in-out 0.8s infinite',
        'spin-slow':   'spin-slow 22s linear infinite',
        'spin-rev':    'spin-rev 30s linear infinite',
        'fade-up':     'fade-up 0.6s ease both',
        'scale-in':    'scale-in 0.4s ease both',
        'shimmer':     'shimmer 1.6s linear infinite',
        'pulse-ring':  'pulse-ring 2.4s ease-in-out infinite',
        'twinkle':     'twinkle 2.5s ease-in-out infinite',
        'gradient-pan':'gradient-pan 6s ease infinite',
        'heartbeat':   'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float:         { '0%,100%': { transform: 'translateY(0)'     }, '50%': { transform: 'translateY(-18px)' } },
        'spin-slow':   { to:        { transform: 'rotate(360deg)'    } },
        'spin-rev':    { to:        { transform: 'rotate(-360deg)'   } },
        shimmer:       { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'fade-up':     { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':    { from: { opacity: '0', transform: 'scale(0.92)' },     to: { opacity: '1', transform: 'scale(1)' } },
        'pulse-ring':  { '0%,100%': { boxShadow: '0 0 0 0 rgba(219,39,119,0.45)' }, '60%': { boxShadow: '0 0 0 14px rgba(219,39,119,0)' } },
        twinkle:       { '0%,100%': { opacity: '1', transform: 'scale(1)' },   '50%': { opacity: '0.3', transform: 'scale(0.6)' } },
        'gradient-pan':{ '0%,100%': { backgroundPosition: '0% 50%' },          '50%': { backgroundPosition: '100% 50%' } },
        heartbeat:     { '0%,100%': { transform: 'scale(1)' }, '25%': { transform: 'scale(1.15)' }, '50%': { transform: 'scale(1)' }, '75%': { transform: 'scale(1.08)' } },
      },
    },
  },
  plugins: [],
}

export default config
