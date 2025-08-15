'use client'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { ChatMessageItem } from '@/components/chat-message'
import { Smile, Send } from 'lucide-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false }) as any

export function RealtimeChat({ roomName, username }: { roomName: string; username: string }) {
  const { messages, sendMessage } = useRealtimeChat(roomName, username)
  const [t, setT] = useState('')
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)
  useChatScroll(messages, listRef)

  const onEmojiClick = (emojiData: any) => {
    const emoji = emojiData?.emoji || ''
    setT((prev) => prev + emoji)
  }

  const handleSend = () => {
    if (!t.trim()) return
    sendMessage(t); setT('')
  }

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
        <div className="flex items-center gap-2 pt-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Emoji">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <EmojiPicker theme="auto" onEmojiClick={onEmojiClick} width={300} height={350} />
            </PopoverContent>
          </Popover>
          <Input
            placeholder="Type a message…"
            value={t}
            onChange={(e)=>setT(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==='Enter') { handleSend() } }}
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
