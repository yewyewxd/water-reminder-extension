/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa',
          normal: '#2563eb',
          dark: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}
