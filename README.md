# AI Customer Resolution Agent — Standalone

A self-contained Express + React app powered by Groq AI.

## 🚀 Live Deployment Links

- **Frontend Application:** [https://nexusops-frontend.onrender.com](https://nexusops-frontend.onrender.com)
- **Backend API Service:** [https://nexusops-backened.onrender.com](https://nexusops-backened.onrender.com)

## Requirements

- Node.js 18+
- A free Groq API key → https://console.groq.com

## Setup & Run

1. **Install all dependencies** (runs once from the root):
   ```bash
   npm install
   ```

2. **Add your Groq API key**
   Create a file at `backend/.env`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the app**:
   ```bash
   npm run dev
   ```
   This starts both servers simultaneously:
   - Backend API → http://localhost:3001
   - Frontend    → http://localhost:5173

4. Open **http://localhost:5173** in your browser.

## Project Structure

```
├── backend/          Express API + SQLite + Groq AI
│   └── src/
│       ├── index.ts          Entry point
│       ├── db.ts             SQLite setup (auto-creates database.sqlite)
│       ├── data/customers.ts Mock customer records
│       └── routes/
│           ├── tickets.ts    AI ticket analysis (Groq)
│           ├── customers.ts  Customer lookup
│           └── dashboard.ts  Stats & recent tickets
│
└── frontend/         React + Vite + Tailwind CSS
    └── src/
        ├── lib/api.ts        Typed API client
        ├── components/       Layout / sidebar
        └── pages/
            ├── Submit.tsx    Ticket submission form
            ├── Result.tsx    AI resolution display
            └── Dashboard.tsx Stats + charts
```

## Notes

- The SQLite database file (`database.sqlite`) is created automatically in the project root on first run.
- No Postgres or external database needed.
- The mock customer list is in `backend/src/data/customers.ts`.
