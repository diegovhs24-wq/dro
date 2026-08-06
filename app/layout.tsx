import type {Metadata} from 'next'
import {getSiteUrl} from '@/lib/seo/site'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="nl">
      <head>
        <link href="https://cdn.sanity.io" rel="preconnect" />
      </head>
      <body>{children}</body>
    </html>
  )
}
