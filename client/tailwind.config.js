/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5ed',
          100: '#ffe8d5',
          200: '#ffd0aa',
          300: '#ffb074',
          400: '#ff8438',
          500: '#ff5722', // Zomato / Swiggy energetic food orange-crimson
          600: '#f03e11',
          700: '#c72b0b',
          800: '#9e240f',
          900: '#7f2110',
          950: '#450d06'
        },
        secondary: {
          50: '#fdf2f2',
          100: '#fde2e2',
          200: '#fcc8c8',
          500: '#e23744',
          600: '#cf1f2e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
