/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        skeletonGradient: {
          "0%": { opacity: "50%" },
          "50%": { opacity: "100%" },
          "100%": { opacity: "50%" },
        },
      },
      animation: {
        skeletonGradient: "skeletonGradient 1s ease infinite",
      },
    },
  },
  plugins: [],
}

