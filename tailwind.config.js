/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zebu: {
          dark: '#031b3e',
          navy: '#05234e',
          blue: '#1652f0',
          blueHover: '#0f40be',
          cyan: '#00b4d8',
          card: '#ffffff',
          bg: '#f4f7fb',
          border: '#e2e8f0',
          green: '#00a651',
          greenBg: '#e6f7ef',
          red: '#dc2626',
          redBg: '#fef2f2',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
