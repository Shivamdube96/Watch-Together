'use client'
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { ChatMessageItem } from '@/components/chat-message'
import { Send } from 'lucide-react'

export function RealtimeChat({ roomName, username }: { roomName: string; username: string }) {
  const { messages, reactions, sendMessage, toggleReaction } = useRealtimeChat(roomName, username)
  const [t, setT] = useState('')
  const viewportRef = useRef<HTMLDivElement | null>(null)
  useChatScroll(messages, viewportRef)

  const handleSend = () => { if (!t.trim()) return; sendMessage(t); setT('') }

  return (
    <Card className="flex flex-col h-[70vh] backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <CardHeader className="flex items-center justify-between shrink-0">
        <div className="font-semibold">Chat</div>
        <div className="text-xs text-muted-foreground">Realtime via Supabase</div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0">
          <ScrollArea ref={viewportRef} className="h-full">
            <div className="pr-1 pb-2">
              {messages.map((m, i) => (
                <ChatMessageItem
                  key={m.id + i}
                  message={m}
                  isOwn={m.user.name === username}
                  username={username}
                  reactionMap={reactions[m.id]}
                  onToggle={(emoji) => toggleReaction(m.id, emoji)}
                />
              ))}
              {!messages.length && <div className="text-xs text-muted-foreground text-center pt-6">No messages yet.</div>}
            </div>
          </ScrollArea>
        </div>
        <div className="flex items-center gap-2 pt-2 shrink-0">
          <Input
            placeholder="Type a message…"
            value={t}
            onChange={(e)=>setT(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==='Enter') handleSend() }}
            className="flex-1"
          />
          <Button onClick={handleSend} aria-label="Send">
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
