/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50:"#f6f7fb",100:"#e8eaf3",200:"#cfd3e1",300:"#a8afc6",
          400:"#7a84a4",500:"#596184",600:"#444a69",700:"#363a53",
          800:"#272a3b",900:"#191c27",950:"#0f1218"
        },
        brand:{ base:"#00e6b8", soft:"#00c7a0", ring:"#00ffd0" },
        note:{ good:"#22c55e", warn:"#f59e0b", bad:"#ef4444" }
      },
      spacing:{ xs:"0.25rem", sm:"0.5rem", md:"0.75rem", lg:"1rem", xl:"1.5rem","2xl":"2rem" },
      boxShadow:{ ring:"0 0 0 2px rgba(0,230,184,.35)" },
      borderRadius:{ xl:"14px","2xl":"18px" }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
