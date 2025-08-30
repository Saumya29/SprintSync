/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',   // Blue
        secondary: '#10B981', // Green
        danger: '#EF4444',    // Red
        dark: '#1F2937',      // Dark gray
        light: '#F3F4F6',     // Light gray
      }
    },
  },
  plugins: [],
}