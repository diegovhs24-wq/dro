import type {Viewport} from 'next'
import localFont from 'next/font/local'
import ConsentBanner from '@/components/analytics/ConsentBanner'
import GoogleTag from '@/components/analytics/GoogleTag'
import '../globals.css'

// Layout voor advertentie-landingspagina's: geen menu en geen footer-links
// naar de rest van de site, zodat de bezoeker bij één actie blijft
// (aanvraag of bellen). Wel dezelfde cookietoestemming en Google-tag.
//
// Lettertype: Archivo (SIL Open Font License, zie fonts/OFL-Archivo.txt),
// zelf gehost als variabel font met breedte-as: koppen breed en stevig,
// lopende tekst normaal. Geen verzoek naar Google Fonts.

const archivo = localFont({
  src: './fonts/archivo-variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-lp',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#26313A',
}

export default function LandingLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className={`${archivo.className} ${archivo.variable} bg-white text-lp-ink antialiased`}>
      {children}
      <GoogleTag />
      <ConsentBanner />
    </div>
  )
}
