# Watch-Together (Next.js + Supabase) — v2

Patched for Tailwind v4's PostCSS plugin (`@tailwindcss/postcss`) and fixed imports/aliases.

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
- Set env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Notes

- PostCSS uses `@tailwindcss/postcss` (Tailwind v4+ requirement).
- Alias `@/*` is configured in `tsconfig.json`.
- `react-player` is dynamically imported from the main module.
