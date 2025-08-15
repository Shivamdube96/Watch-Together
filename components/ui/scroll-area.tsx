'use client'
import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children: React.ReactNode
} & ScrollAreaPrimitive.ScrollAreaProps

export const ScrollArea = React.forwardRef<HTMLDivElement, Props>(function ScrollArea(
  { className, children, ...props }, ref
) {
  return (
    <ScrollAreaPrimitive.Root className={cn('relative overflow-hidden h-full', className)} {...props}>
      <ScrollAreaPrimitive.Viewport ref={ref} className="h-full w-full rounded">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent transition-colors">
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-foreground/20" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  )
})
