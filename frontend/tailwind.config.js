/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#0D1117',
        'secondary': '#161B22',
        'accent': '#58A6FF',
        'accent-hover': '#80B9FF',
        'border-color': '#30363D',
        'text-primary': '#C9D1D9',
        'text-secondary': '#8B949E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
