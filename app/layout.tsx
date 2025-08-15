import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Watch‑Together',
  description: 'Paste a link. Watch in sync. Chat live.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
