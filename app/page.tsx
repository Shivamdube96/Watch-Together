'use client'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
export default function Home() {
  const router = useRouter()
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="py-10 rounded-3xl border shadow-sm bg-gradient-to-b from-white/5 to-white/0 backdrop-blur">
        <h1 className="text-4xl font-semibold tracking-tight text-center">Watch‑Together</h1>
        <p className="text-muted-foreground mt-2 text-center">Paste a link, watch at the same time, and chat — no signup required.</p>
      </div>
      <Card>
        <CardHeader className="font-medium">Start a session</CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button onClick={() => router.push(`/s/${uuidv4()}`)}>Create a session</Button>
          <p className="text-xs text-muted-foreground">Works with YouTube, Vimeo, MP4, and HLS (.m3u8).</p>
        </CardContent>
      </Card>
    </main>
  )
}
