# Watch‑Together — Zinc theme glow‑up (v10)

- **shadcn 'zinc' theme** mapped to Tailwind v4 tokens
- Subtle **radial background glow**
- Softer **rounded-3xl** cards, pill inputs, nicer focus rings
- **Chat bubbles** with avatars (initials), tails, timestamps
- **Emoji picker** (emoji-picker-react) in Radix Popover
- Supabase Realtime chat + synced video controls

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
