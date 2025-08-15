import * as React from 'react'
import { cn } from '@/lib/utils'
type Props = React.InputHTMLAttributes<HTMLInputElement>
export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
      {...props}
    />
  )
}
