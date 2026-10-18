/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'renova-primaria': '#014C30'
        // 'renova-secundaria': '#F59E0B'
      }
    },
  },
  plugins: [],
}