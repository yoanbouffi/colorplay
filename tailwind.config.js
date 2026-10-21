/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:   '#5B8DEF',
          violet: '#8B5CF6',
          coral:  '#F97066',
          amber:  '#F59E0B',
          mint:   '#10B981',
          pink:   '#EC4899',
        },
        surface: {
          bg:       '#080818',
          card:     '#0F0F2A',
          elevated: '#16163A',
          border:   'rgba(255,255,255,0.08)',
        },
        ink: {
          primary:   '#F0F0FF',
          secondary: 'rgba(240,240,255,0.5)',
          muted:     'rgba(240,240,255,0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-hero': 'linear-gradient(135deg, #5B8DEF 0%, #8B5CF6 50%, #EC4899 100%)',
        'grad-cta':  'linear-gradient(135deg, #5B8DEF, #8B5CF6, #EC4899)',
        'grad-violet': 'linear-gradient(135deg, #8B5CF6, #5B8DEF)',
      },
      boxShadow: {
        'glow-violet': '0 0 32px rgba(139,92,246,0.35)',
        'glow-blue':   '0 0 24px rgba(91,141,239,0.3)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        float:   'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
