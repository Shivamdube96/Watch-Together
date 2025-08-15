'use client'
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { ChatMessageItem } from '@/components/chat-message'

export function RealtimeChat({ roomName, username, onMessage }: { roomName: string; username: string; onMessage?: (messages: any[]) => void }) {
  const { messages, sendMessage } = useRealtimeChat(roomName, username)
  const [t, setT] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  useChatScroll(messages, listRef)

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader className="flex items-center justify-between">
        <div className="font-semibold">Chat</div>
        <div className="text-xs text-muted-foreground">Realtime via Supabase</div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2">
        <ScrollArea className="flex-1">
          <div ref={listRef} className="pr-1">
            {messages.map((m, i) => (
              <ChatMessageItem key={m.id + i} message={m} isOwn={m.user.name === username} />
            ))}
            {!messages.length && <div className="text-xs text-muted-foreground text-center pt-6">No messages yet.</div>}
          </div>
        </ScrollArea>
        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Type a message…"
            value={t}
            onChange={(e)=>setT(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==='Enter') { sendMessage(t); setT('') } }}
          />
          <Button onClick={()=>{ sendMessage(t); setT('') }}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}
