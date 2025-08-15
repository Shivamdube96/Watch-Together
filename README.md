# Watch-Together (Next.js + Supabase) — v3

**Fixes:** JSX conditionals (`&&` instead of `and`) + boolean state setters cleaned. Tailwind v4 PostCSS plugin is configured.

## Setup

1) Install deps:
```bash
npm i
```

2) Env vars in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

3) Dev:
```bash
npm run dev
```

## Deploy (Vercel)
- Push to GitHub and import.
- Add env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Notes
- Dynamic import uses `react-player` main entry.
- Conditional rendering uses `&&` for JSX.
