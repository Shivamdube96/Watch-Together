import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export function Button({ className, variant='default', size='md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
  const variants: Record<string,string> = {
    default: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
    outline: 'border border-border bg-transparent hover:bg-muted',
    ghost: 'hover:bg-muted',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90'
  }
  const sizes: Record<string,string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-10 w-10'
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
