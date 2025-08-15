'use client'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

type Signal =
  | { type: 'presence'; name: string }
  | { type: 'load'; url: string; sentAt: number }
  | { type: 'ctrl'; action: 'play' | 'pause' | 'seek'; t: number; sentAt: number }
  | { type: 'state-request' }
  | { type: 'state'; url: string; isPlaying: boolean; t: number; sentAt: number }
  | { type: 'chat'; msg: { name: string; text: string; at: number; ts: number } }

export default function Session() {
  const params = useParams<{ id: string }>()
  const roomId = params.id

  const [name, setName] = useState<string>('')
  const [nameModal, setNameModal] = useState(true)

  const [url, setUrl] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<Array<{name:string;text:string;at:number;ts:number}>>([])
  const [presence, setPresence] = useState<string[]>([])

  const playerRef = useRef<any>(null)
  const lastSeekRef = useRef<number>(0)

  // channel with presence
  const channel = useMemo(() =>
    supabase.channel(`room-${roomId}`, { config: { presence: { key: 'anon' } } }), [roomId])

  const send = (payload: Signal) => {
    channel.send({ type: 'broadcast', event: 'signal', payload })
  }

  useEffect(() => {
    // Load cached name if exists
    const cached = typeof window !== 'undefined' ? localStorage.getItem('wt_name') : null
    if (cached) { setName(cached); setNameModal(false) }

    // Subscribe
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as Record<string, Array<any>>
        setPresence(Object.keys(state))
      })
      .on('broadcast', { event: 'signal' }, ({ payload }) => {
        const p = payload as Signal

        if (p.type === 'load') {
          setUrl(p.url)
          setIsPlaying(false)
        }

        if (p.type === 'ctrl') {
          const player = playerRef.current
          if (!player) return
          const driftMs = Date.now() - p.sentAt
          const target = p.t + driftMs / 1000
          if (p.action === 'play') {
            try { player.seekTo(target, 'seconds') } catch {}
            setIsPlaying(true)
          }
          if (p.action === 'pause') {
            setIsPlaying(false)
            try { player.seekTo(p.t, 'seconds') } catch {}
          }
          if (p.action === 'seek') {
            try { player.seekTo(p.t, 'seconds') } catch {}
          }
        }

        if (p.type === 'state-request') {
          const player = playerRef.current
          const t = player ? (player.getCurrentTime?.() || 0) : 0
          send({ type: 'state', url, isPlaying, t, sentAt: Date.now() })
        }

        if (p.type === 'state') {
          setUrl(p.url)
          const player = playerRef.current
          const drift = Date.now() - p.sentAt
          const target = p.t + drift / 1000
          try { player?.seekTo(target, 'seconds') } catch {}
          setIsPlaying(p.isPlaying)
        }

        if (p.type === 'chat') {
          setMessages(m => [...m, p.msg])
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ name: name || 'guest' })
          // Ask others for current state
          send({ type: 'state-request' })
        }
      })

    return () => { channel.unsubscribe() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePlay = () => {
    setIsPlaying(true)
    const player = playerRef.current
    const t = player?.getCurrentTime?.() || 0
    send({ type: 'ctrl', action: 'play', t, sentAt: Date.now() })
  }
  const handlePause = () => {
    setIsPlaying(false)
    const player = playerRef.current
    const t = player?.getCurrentTime?.() || 0
    send({ type: 'ctrl', action: 'pause', t, sentAt: Date.now() })
  }
  const handleSeek = (t: number) => {
    const now = Date.now()
    if (now - lastSeekRef.current < 300) return
    lastSeekRef.current = now
    send({ type: 'ctrl', action: 'seek', t, sentAt: Date.now() })
  }

  const loadUrl = () => {
    if (!inputUrl.trim()) return
    setUrl(inputUrl.trim())
    setIsPlaying(false)
    send({ type: 'load', url: inputUrl.trim(), sentAt: Date.now() })
  }

  const sendChat = (text: string) => {
    if (!text.trim()) return
    const player = playerRef.current
    const at = player?.getCurrentTime?.() || 0
    const msg = { name, text, at, ts: Date.now() }
    setMessages(m => [...m, msg])
    send({ type: 'chat', msg })
  }

  // Name capture
  const submitName = () => {
    if (!name.trim()) return
    if (typeof window !== 'undefined') localStorage.setItem('wt_name', name.trim())
    setNameModal(false)
    channel.track({ name: name.trim() })
  }

  return (
    <main className="max-w-6xl mx-auto p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Session: {roomId}</h1>
          <div className="text-xs text-slate-500">Share this URL with your partner</div>
        </div>
        <div className="text-sm text-slate-600">Online: {presence.length}</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-4 space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Paste YouTube / Vimeo / MP4 / .m3u8 URL"
              value={inputUrl}
              onChange={e=>setInputUrl(e.target.value)}
              onKeyDown={e=>{ if (e.key==='Enter') loadUrl() }}
            />
            <button onClick={loadUrl} className="px-3 py-2 rounded bg-blue-600 text-white">Load</button>
          </div>

          <div className="aspect-video w-full bg-slate-200 rounded-xl overflow-hidden">
            {url ? (
              <ReactPlayer
                ref={playerRef}
                url={url}
                playing={isPlaying}
                width="100%"
                height="100%"
                controls
                onPlay={handlePlay}
                onPause={handlePause}
                onSeek={(seconds: number) => handleSeek(seconds)}
                onError={() => {
                  alert('This link cannot be embedded. We\'ll open it in a new tab.')
                  window.open(url, '_blank')
                }}
              />
            ) : (
              <div className="grid place-items-center h-full text-slate-500 text-sm">Paste a media URL to start</div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <div>Controls are synced across participants (last action wins).</div>
            <button onClick={() => send({ type: 'state-request' })} className="px-2 py-1 rounded border">Re‑sync</button>
          </div>
        </section>

        {/* Chat */}
        <aside className="bg-white rounded-2xl border shadow-sm p-4 flex flex-col h-[70vh]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Chat</h3>
            <span className="text-xs text-slate-500">Timestamped</span>
          </div>
          <div className="flex-1 overflow-auto space-y-2 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`rounded p-2 border ${m.name===name? 'bg-slate-50' : 'bg-blue-50'}`}>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-medium text-slate-700">{m.name}</span>
                  <span>@ {formatTime(m.at)}</span>
                </div>
                <div className="text-sm">{m.text}</div>
              </div>
            ))}
            {!messages.length && <div className="text-xs text-slate-400 text-center pt-6">No messages yet.</div>}
          </div>
          <ChatInput onSend={sendChat} />
        </aside>
      </div>

      {nameModal && (
        <NameModal name={name} setName={setName} onSubmit={submitName} />
      )}
    </main>
  )
}

function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [t, setT] = useState('')
  return (
    <div className="mt-3 flex gap-2">
      <input
        className="flex-1 px-3 py-2 border rounded"
        placeholder="Type a message…"
        value={t}
        onChange={e=>setT(e.target.value)}
        onKeyDown={e=>{ if (e.key==='Enter') { onSend(t); setT('') } }}
      />
      <button onClick={() => { onSend(t); setT('') }} className="px-3 py-2 rounded bg-blue-600 text-white">Send</button>
    </div>
  )
}

function NameModal({ name, setName, onSubmit }: { name:string; setName:(s:string)=>void; onSubmit:()=>void }) {
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border">
        <h3 className="text-lg font-semibold mb-2">Pick a name for this session</h3>
        <input
          className="w-full px-3 py-2 border rounded mb-3"
          placeholder="e.g., Alex"
          value={name}
          onChange={e=>setName(e.target.value)}
          onKeyDown={e=>{ if (e.key==='Enter') onSubmit() }}
        />
        <button onClick={onSubmit} className="w-full px-3 py-2 rounded bg-black text-white">Continue</button>
        <p className="text-xs text-slate-500 mt-2">No signup. Name is stored locally.</p>
      </div>
    </div>
  )
}

function formatTime(t: number) {
  const s = Math.max(0, Math.floor(t))
  const mm = String(Math.floor(s/60)).padStart(2, '0')
  const ss = String(s%60).padStart(2, '0')
  return `${mm}:${ss}`
}
