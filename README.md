# Watch‑Together — Shadcn UI + Supabase Realtime (v7)

This build refreshes the UI using **shadcn/ui** and swaps the chat to the **Supabase UI style Realtime Chat** (implemented locally). Tailwind **v4** compatible.

## What's inside
- Tailwind v4 (`@import "tailwindcss"`) with shadcn tokens.
- shadcn components (`Button`, `Input`, `Card`, `ScrollArea`) under `components/ui/*`.
- Supabase Realtime-powered chat: `components/realtime-chat.tsx` + hooks.
- Video sync still uses Supabase Channels (play/pause/seek).
- "Share URL" button.

## Setup
```bash
npm i
```
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Dev
```bash
npm run dev
```

## Deploy (Vercel)
Push to GitHub → Import on Vercel → add the env vars above.

---

### Credits
- shadcn Tailwind v4 guidance: ui.shadcn.com
- Supabase UI Realtime Chat block inspiration: supabase.com/ui
