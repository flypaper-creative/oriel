/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b0e14",
          800: "#10151f",
          700: "#141a26",
          600: "#1b2331",
          500: "#243044",
          400: "#33455f",
          300: "#4a6184",
          200: "#7d90ad",
          100: "#aeb8ce",
        },
        limepulse: {
          50: "#eafff6",
          100: "#c6ffe7",
          200: "#8cffd0",
          300: "#44f9b9",
          400: "#12e6b8",
          500: "#00e6b8",
          600: "#00c6a1",
          700: "#00a386",
          800: "#007b68",
          900: "#014f43",
        },
        amberline: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706"
        }
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.25)",
        neon: "0 0 0 2px rgba(0,230,184,.35), 0 8px 40px rgba(0,230,184,.12)"
      }
    }
  },
  plugins: [],
};
