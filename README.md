# Watch-Together (Next.js + Supabase) — v5

**Fix Tailwind v4 missing CSS in production**

- Uses Tailwind v4's `@import "tailwindcss";` in `app/globals.css`
- ESM PostCSS config `postcss.config.mjs` with `["@tailwindcss/postcss"]`
- Removed `tailwind.config.js` (v4 auto-detects sources)
- Keeps earlier fixes: layout body classes, ReactPlayer typing, `@/*` alias

## Setup

```bash
npm i
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Run locally:
```bash
npm run dev
```

Deploy on Vercel and set the same env vars.
