# Watch‑Together — Shadcn Styled Chat + Emoji (v9b)

- Clean shadcn look (tokens + Tailwind v4)
- Chat bubbles with tails, timestamps, names
- Emoji picker (emoji-picker-react) in Radix Popover
- Realtime chat via Supabase; video sync unchanged

## Setup
```bash
npm i
```
`.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Dev
```bash
npm run dev
```

## Deploy
Push to GitHub → Import on Vercel → add env vars.
