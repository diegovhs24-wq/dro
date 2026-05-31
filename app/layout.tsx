import type {Metadata} from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
