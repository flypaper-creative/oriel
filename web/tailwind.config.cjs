module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glassBg: "rgba(255,255,255,0.06)",
        glassBorder: "rgba(255,255,255,0.12)",
        accent: "#7c5cff",
        accent2: "#00d4ff"
      },
      backdropFilter: {
        'none': 'none',
        'blur-sm': 'blur(6px)'
      }
    }
  },
  plugins: []
};
