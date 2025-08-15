'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export type ChatMessage = {
  id: string
  content: string
  user: { name: string }
  createdAt: string
}

export function useRealtimeChat(roomName: string, username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const channel = useMemo(
    () => supabase.channel(`chat-${roomName}`),
    [roomName]
  )

  useEffect(() => {
    const sub = channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages((m) => [...m, payload as ChatMessage])
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [channel])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      content: text,
      user: { name: username || 'guest' },
      createdAt: new Date().toISOString()
    }
    setMessages((m)=>[...m, msg])
    channel.send({ type: 'broadcast', event: 'message', payload: msg })
  }

  return { messages, sendMessage }
}
