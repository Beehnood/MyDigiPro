/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Inclut tous les fichiers source
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          200: '#D9C2A8', // Couleur beige personnalisée
        },
      },
    },
  },
  plugins: [],
};