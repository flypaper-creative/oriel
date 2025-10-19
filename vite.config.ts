import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  define: { 'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || '') }
})
