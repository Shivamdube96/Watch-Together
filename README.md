# Watch‑Together (Next.js + Supabase)

Paste a media URL and watch in sync with someone + live chat. No auth. Uses Supabase Realtime channels.

## Quick start

1) Install deps
```bash
npm i
```

2) Add environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL= https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= YOUR_ANON_KEY
```

3) Run locally
```bash
npm run dev
```

Open http://localhost:3000 → click **Create a session**, share the URL, paste a media link (YouTube, Vimeo, MP4, .m3u8).

## Deploy on Vercel

- Push this repo to GitHub, import in Vercel.
- Add env vars in Project Settings → Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Notes

- Some sites disallow embedding; you'll see a friendly fallback that opens in a new tab.
- Sync logic uses broadcast events with drift correction (based on send time).
- Chat is ephemeral (not persisted). You can add a `messages` table later to save history.
