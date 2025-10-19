export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:   { 900:'#0b0c0f', 800:'#101216', 700:'#141821' },
        pane:  '#111216',
        acid:  '#caff2c',
        mint:  '#22c55e',
        lilac: '#a855f7'
      },
      boxShadow: { soft: '0 8px 30px rgba(0,0,0,.25)' },
      borderRadius: { xl: '1rem', '2xl':'1.25rem' }
    }
  },
  plugins: []
}
