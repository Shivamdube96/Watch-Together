import './globals.css'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Watch-Together',
  description: 'Paste a link. Watch in sync. Chat live.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background text-foreground')}>{children}</body>
    </html>
  )
}
