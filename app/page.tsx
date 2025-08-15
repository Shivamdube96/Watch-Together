'use client'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="py-6">
        <h1 className="text-4xl font-semibold tracking-tight">Watch‑Together</h1>
        <p className="text-muted-foreground mt-2">Paste a link, watch at the same time, and chat — no signup required.</p>
      </div>

      <Card>
        <CardHeader className="font-medium">Start a session</CardHeader>
        <CardContent>
          <Button onClick={() => router.push(`/s/${uuidv4()}`)}>Create a session</Button>
          <p className="text-xs text-muted-foreground mt-3">Works with YouTube, Vimeo, MP4, and HLS (.m3u8). Some links can’t be embedded due to site policy.</p>
        </CardContent>
      </Card>
    </main>
  )
}
