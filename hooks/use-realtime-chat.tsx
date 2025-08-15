'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
export type ChatMessage = { id: string; content: string; user: { name: string }; createdAt: string }
export type ReactionState = Record<string, Record<string, string[]>> // msgId -> emoji -> users[]
type ReactionEvt = { messageId: string; emoji: string; user: string; action: 'toggle' }
export function useRealtimeChat(roomName: string, username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reactions, setReactions] = useState<ReactionState>({})
  const channel = useMemo(() => supabase.channel(`chat-${roomName}`), [roomName])
  useEffect(() => {
    const sub = channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages((m) => [...m, payload as ChatMessage])
      })
      .on('broadcast', { event: 'reaction' }, ({ payload }) => {
        const { messageId, emoji, user, action } = payload as ReactionEvt
        setReactions((prev) => {
          const byMsg = { ...(prev[messageId] || {}) }
          const users = new Set(byMsg[emoji] || [])
          if (action === 'toggle') {
            if (users.has(user)) users.delete(user)
            else users.add(user)
          }
          byMsg[emoji] = Array.from(users)
          return { ...prev, [messageId]: byMsg }
        })
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
  const toggleReaction = (messageId: string, emoji: string) => {
    setReactions((prev) => {
      const byMsg = { ...(prev[messageId] || {}) }
      const users = new Set(byMsg[emoji] || [])
      if (users.has(username)) users.delete(username)
      else users.add(username)
      byMsg[emoji] = Array.from(users)
      return { ...prev, [messageId]: byMsg }
    })
    const payload: ReactionEvt = { messageId, emoji, user: username || 'guest', action: 'toggle' }
    channel.send({ type: 'broadcast', event: 'reaction', payload })
  }
  return { messages, reactions, sendMessage, toggleReaction }
}
