import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:," />
        
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
        `}</style>
      </head>
      <body className="overflow-hidden min-h-screen w-full">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              marginTop: '50vh',
              transform: 'translateY(-50%)',
            },
          }}
        />
      </body>
    </html>
  )
}
