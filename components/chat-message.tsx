import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

export function ChatMessageItem({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <div className={cn('mt-2 flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[80%] w-fit flex flex-col', isOwn && 'items-end')}>
        <div className={cn('text-[10px] px-2 text-muted-foreground', isOwn && 'text-right')}>
          <span className="font-medium mr-1">{message.user.name}</span>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="relative">
          <div className={cn(
            'rounded-2xl px-3 py-2 text-sm shadow-sm border',
            isOwn ? 'bg-primary text-primary-foreground border-transparent' : 'bg-muted text-foreground border-border'
          )}>
            {message.content}
          </div>
          <span className={cn('absolute -bottom-1 h-2 w-2 rotate-45', isOwn ? 'right-2 bg-primary' : 'left-2 bg-muted')} />
        </div>
      </div>
    </div>
  )
}
