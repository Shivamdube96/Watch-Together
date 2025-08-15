'use client'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
  const router = useRouter()
  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Watch‑Together</h1>
      <p className="text-slate-600">Paste a link, watch at the same time, and chat—no signup required.</p>

      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/s/${uuidv4()}`)}
          className="px-4 py-3 rounded-lg bg-black text-white"
        >Create a session</button>
      </div>

      <div className="text-xs text-slate-500">
        Works with YouTube, Vimeo, MP4, and HLS (.m3u8). Some links can’t be embedded due to site policy.
      </div>
    </main>
  )
}
