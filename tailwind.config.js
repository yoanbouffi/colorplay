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
          blue:       '#8ebced',
          orange:     '#fcac4c',
          green:      '#89e5b3',
          purple:     '#be9fe2',
          'blue-dk':  '#74aac6',
          teal:       '#55c9a2',
          amber:      '#f9b367',
        },
        neutral: {
          dark:  '#1A1A2E',
          light: '#F8F9FC',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
