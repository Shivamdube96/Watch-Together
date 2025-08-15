# Watch-Together (Next.js + Supabase) — v4

Fixes:
- Tailwind v4: removed `@apply` from globals.css, moved classes to layout body.
- TypeScript: cast dynamic `react-player` import to `any` to satisfy changing typings.

## Setup

1) Install deps:
```bash
npm i
```

2) Add `.env.local`:
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
- Set env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Notes:
- If you prefer strict types, add `npm i -D @types/react-player` (but the library bundles its own types that vary per version).
