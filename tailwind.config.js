/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        accent: '#F77F00',
        light: '#F8F9FA',
        dark: '#1A1A1A'
      }
    }
  },
  plugins: []
}
