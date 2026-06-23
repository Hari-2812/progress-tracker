/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        ink: '#1e2440',
        primary: { 50: '#eef3ff', 500: '#5667e9', 600: '#4655d4', 700: '#3c46b3' },
      },
      boxShadow: { soft: '0 18px 55px -24px rgba(48, 55, 110, .28)' },
    },
  },
  plugins: [],
};
