// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#FFFFFF',
          surface: '#F5F5F7',
          border: '#E8E8ED',
          'text-primary': '#1D1D1F',
          'text-secondary': '#6E6E73',
        },
        dark: {
          bg: '#000000',
          surface: '#1C1C1E',
          card: '#2C2C2E',
          border: '#3A3A3C',
          'text-primary': '#F5F5F7',
          'text-secondary': '#98989D',
        },
        accent: '#0A84FF',
      },
      fontFamily: {
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
