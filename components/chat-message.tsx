import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
export function ChatMessageItem({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <div className={cn('flex mt-2', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[75%] w-fit flex flex-col gap-1', isOwn && 'items-end')}>
        <div className={cn('flex items-center gap-2 text-xs px-3', isOwn && 'justify-end flex-row-reverse')}>
          <span className="font-medium">{message.user.name}</span>
          <span className="text-foreground/50 text-xs">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={cn('py-2 px-3 rounded-xl text-sm w-fit', isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
