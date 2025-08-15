'use client'
import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export function PopoverContent({ className, align='end', sideOffset=8, ...props }:
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { align?: 'start'|'center'|'end'; sideOffset?: number }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn('z-50 rounded-2xl border bg-popover p-2 text-popover-foreground shadow-md', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
