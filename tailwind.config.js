/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFFAFA',
          accent: '#6699CC',
          dark: '#14213D',
        },
      },
      fontFamily: {
        title: ['Citadel', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

