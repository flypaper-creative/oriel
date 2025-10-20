export default {
  darkMode:'class',
  content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme:{ extend:{ colors:{ oriel:{ bg:'#0E0F12', accent:'#FFD761', surface:'#1B1C22', text:'#EAEAEA', mute:'#7C7C84' } },
    borderRadius:{'2xl':'1.25rem'}, boxShadow:{glow:'0 0 24px rgba(255,215,97,.35)'} } },
  plugins:[
    (()=>{ try{return require('@tailwindcss/forms')}catch{return ()=>{}}})(),
    (()=>{ try{return require('@tailwindcss/typography')}catch{return ()=>{}}})(),
  ],
}
