import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import Avatar from 'boring-avatars'

function UserAvatar({ name }: { name: string }) {
  return (
    <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border shadow-sm">
      <Avatar size={32} name={name || 'guest'} variant="beam" colors={['#0EA5E9','#8B5CF6','#F97316','#10B981','#F43F5E']} />
    </div>
  )
}

export function ChatMessageItem({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <div className={cn('mt-3 flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && <UserAvatar name={message.user.name} />}
      <div className={cn('max-w-[78%] w-fit flex flex-col', isOwn && 'items-end')}>
        <div className={cn('text-[10px] px-1 text-muted-foreground mb-1', isOwn && 'text-right')}>
          <span className="font-medium mr-1">{message.user.name}</span>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className={cn(
          'rounded-full px-4 py-2 text-sm shadow-sm border',
          isOwn ? 'bg-primary text-primary-foreground border-transparent' : 'bg-muted text-foreground border-border'
        )}>
          {message.content}
        </div>
      </div>
      {isOwn && <UserAvatar name={message.user.name} />}
    </div>
  )
}
