Oriel — UI upgrade branch: upgrade/ui-iterative-10

This branch introduces a new web/ frontend (Vite + React + Tailwind glassmorphism prototype) and a small Express TypeScript backend (src/) with demo-mode iterate endpoint (SQLite).
Run web: cd web && npm install && npm run dev
Seed demo backend: POST http://localhost:4000/api/seed
Run demo iterate: POST http://localhost:4000/api/iterate { "input": "...", "rounds": 3 }
