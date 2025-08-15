# v13.1 — Fix build (remove popover), reactions + dark mode

- Removed `components/ui/popover.tsx` completely — no `@radix-ui/react-popover` required.
- Chat **reactions** (👍 ❤️ 😂 😮 😢 👏) sync live via Supabase Realtime.
- **Dark mode default** (set on <html class="dark">).

Deploy
1) Unzip and push to a fresh repo or replace your existing files.
2) Set envs on Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3) `npm i && npm run build` locally (optional), then deploy.
