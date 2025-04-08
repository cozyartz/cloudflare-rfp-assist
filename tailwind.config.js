/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        assistant: '#14532d',
        user: '#1e3a8a',
      }
    },
  },
  plugins: [],
}
