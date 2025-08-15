'use client'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RealtimeChat } from '@/components/realtime-chat'

const ReactPlayer = dynamic(() => import('react-player').then(m => m.default as any), { ssr: false }) as any

type Signal =
  | { type: 'presence'; name: string }
  | { type: 'load'; url: string; sentAt: number }
  | { type: 'ctrl'; action: 'play' | 'pause' | 'seek'; t: number; sentAt: number }
  | { type: 'state-request' }
  | { type: 'state'; url: string; isPlaying: boolean; t: number; sentAt: number }

export default function Session() {
  const params = useParams<{ id: string }>()
  const roomId = params.id
  const [name, setName] = useState<string>('')
  const [nameModal, setNameModal] = useState(true)
  const [url, setUrl] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [presence, setPresence] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const playerRef = useRef<any>(null)
  const lastSeekRef = useRef<number>(0)
  const channel = useMemo(() => supabase.channel(`room-${roomId}`, { config: { presence: { key: 'anon' } } }), [roomId])
  const send = (payload: Signal) => { channel.send({ type: 'broadcast', event: 'signal', payload }) }
  useEffect(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('wt_name') : null
    if (cached) { setName(cached); setNameModal(false) }
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as Record<string, Array<any>>
      setPresence(Object.keys(state))
    }).on('broadcast', { event: 'signal' }, ({ payload }) => {
      const p = payload as Signal
      if (p.type === 'load') { setUrl(p.url); setIsPlaying(false) }
      if (p.type === 'ctrl') {
        const player = playerRef.current; if (!player) return
        const driftMs = Date.now() - p.sentAt; const target = p.t + driftMs / 1000
        if (p.action === 'play') { try { player.seekTo(target, 'seconds') } catch {}; setIsPlaying(true) }
        if (p.action === 'pause') { setIsPlaying(false); try { player.seekTo(p.t, 'seconds') } catch {} }
        if (p.action === 'seek') { try { player.seekTo(p.t, 'seconds') } catch {} }
      }
      if (p.type === 'state-request') {
        const player = playerRef.current; const t = player ? (player.getCurrentTime?.() || 0) : 0
        send({ type: 'state', url, isPlaying, t, sentAt: Date.now() })
      }
      if (p.type === 'state') {
        setUrl(p.url); const player = playerRef.current; const drift = Date.now() - p.sentAt; const target = p.t + drift / 1000
        try { player?.seekTo(target, 'seconds') } catch {}; setIsPlaying(p.isPlaying)
      }
    }).subscribe(async (status) => { if (status === 'SUBSCRIBED') { channel.track({ name: name || 'guest' }); send({ type: 'state-request' }) } })
    return () => { channel.unsubscribe() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handlePlay = () => { setIsPlaying(true); const t = playerRef.current?.getCurrentTime?.() || 0; send({ type: 'ctrl', action: 'play', t, sentAt: Date.now() }) }
  const handlePause = () => { setIsPlaying(false); const t = playerRef.current?.getCurrentTime?.() || 0; send({ type: 'ctrl', action: 'pause', t, sentAt: Date.now() }) }
  const handleSeek = (t: number) => { const now = Date.now(); if (now - lastSeekRef.current < 300) return; lastSeekRef.current = now; send({ type: 'ctrl', action: 'seek', t, sentAt: Date.now() }) }
  const loadUrl = () => { if (!inputUrl.trim()) return; setUrl(inputUrl.trim()); setIsPlaying(false); send({ type: 'load', url: inputUrl.trim(), sentAt: Date.now() }) }
  const submitName = () => { if (!name.trim()) return; if (typeof window !== 'undefined') localStorage.setItem('wt_name', name.trim()); setNameModal(false); channel.track({ name: name.trim() }) }
  const copyInvite = async () => { const href = typeof window !== 'undefined' ? window.location.href : ''; try { await navigator.clipboard.writeText(href) } catch { const ta = document.createElement('textarea'); ta.value = href; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) } setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <main className="max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Watch‑Together</h1>
          <p className="text-xs text-muted-foreground">Room {roomId}. Share this link with your partner.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Online: {presence.length}</div>
          <Button variant="outline" onClick={copyInvite}>{copied ? 'Copied!' : 'Share URL'}</Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex gap-2">
              <Input placeholder="Paste YouTube / Vimeo / MP4 / .m3u8 URL" value={inputUrl} onChange={e=>setInputUrl(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter') loadUrl() }} />
              <Button onClick={loadUrl}>Load</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-muted rounded-xl overflow-hidden">
              {url ? (
                <ReactPlayer ref={playerRef} url={url} playing={isPlaying} width="100%" height="100%" controls onPlay={handlePlay} onPause={handlePause} onSeek={(s:number)=>handleSeek(s)} onError={()=>{ alert('This link cannot be embedded. We\'ll open it in a new tab.'); window.open(url, '_blank') }} />
              ) : (
                <div className="grid place-items-center h-full text-muted-foreground text-sm">Paste a media URL to start</div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <div>Controls are synced across participants.</div>
              <Button variant="outline" size="sm" onClick={() => send({ type: 'state-request' })}>Re-sync</Button>
            </div>
          </CardContent>
        </Card>
        <RealtimeChat roomName={String(roomId)} username={name || 'guest'} />
      </div>
      {nameModal && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <div className="bg-card text-card-foreground rounded-2xl p-6 w-full max-w-sm shadow-xl border">
            <h3 className="text-lg font-semibold mb-2">Pick a name for this session</h3>
            <Input placeholder="e.g., Alex" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter') submitName() }} className="mb-3" />
            <Button className="w-full" onClick={submitName}>Continue</Button>
            <p className="text-xs text-muted-foreground mt-2">No signup. Name is stored locally.</p>
          </div>
        </div>
      )}
    </main>
  )
}
