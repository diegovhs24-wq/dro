import type {Viewport} from 'next'
import {Poppins} from 'next/font/google'
import ConsentBanner from '@/components/analytics/ConsentBanner'
import GoogleTag from '@/components/analytics/GoogleTag'
import '../globals.css'

// Layout voor advertentie-landingspagina's: geen menu en geen footer-links
// naar de rest van de site, zodat de bezoeker bij één actie blijft
// (aanvraag of bellen). Wel dezelfde cookietoestemming en Google-tag.

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#181613',
}

export default function LandingLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className={`${poppins.className} bg-brand-soft text-brand-ink`}>
      {children}
      <GoogleTag />
      <ConsentBanner />
    </div>
  )
}
