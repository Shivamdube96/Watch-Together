import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import { initials } from '@/lib/initials'

export function ChatMessageItem({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <div className={cn('mt-3 flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && (
        <div className="grid place-items-center h-7 w-7 rounded-full bg-zinc-200 text-zinc-700 text-[11px] font-medium">
          {initials(message.user.name)}
        </div>
      )}
      <div className={cn('max-w-[78%] w-fit flex flex-col', isOwn && 'items-end')}>
        <div className={cn('text-[10px] px-1 text-muted-foreground mb-1', isOwn && 'text-right')}>
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
      {isOwn && (
        <div className="grid place-items-center h-7 w-7 rounded-full bg-zinc-900 text-zinc-50 text-[11px] font-medium">
          {initials(message.user.name)}
        </div>
      )}
    </div>
  )
}
