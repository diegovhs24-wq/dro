import type {Viewport} from 'next'
import {Poppins} from 'next/font/google'
import ConsentBanner from '@/components/analytics/ConsentBanner'
import GoogleTag from '@/components/analytics/GoogleTag'
import '../globals.css'

// Layout voor advertentie-landingspagina's: geen menu en geen footer-links
// naar de rest van de site, zodat de bezoeker bij één actie blijft
// (aanvraag of bellen). Wel dezelfde cookietoestemming en Google-tag.
//
// Zelfde huisstijl als de rest van de site: Poppins, warme tinten, oranje accent.

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#181613',
}

export default function LandingLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className={`${poppins.className} ${poppins.variable} bg-white text-lp-ink antialiased`}>
      {children}
      <GoogleTag />
      <ConsentBanner />
    </div>
  )
}
