/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {}, // Keep other extensions here if needed
    },
    variants: {
      extend: {
        opacity: ['group-hover'], // Enables group-hover for opacity
      },
    },
    plugins: [],
  }