/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        'primary': '#e20514',
        'secondary': '#FEF2F4',
        'black-light': '#1A1A1A',
        'love': '#e20785',
        'passion': '#f69220',
        'dream': '#00a4a5'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

