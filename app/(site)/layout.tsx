import type {Metadata, Viewport} from 'next'
import {Patrick_Hand, Poppins} from 'next/font/google'
import localFont from 'next/font/local'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import FloatingActions from '@/components/FloatingActions'
import AttributionCapture from '@/components/analytics/AttributionCapture'
import ConsentBanner from '@/components/analytics/ConsentBanner'
import GoogleTag from '@/components/analytics/GoogleTag'
import JsonLd from '@/components/seo/JsonLd'
import {getLocations, getServices, getSiteSettings} from '@/lib/cms'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {buildJsonLdGraph, buildOrganizationGraph} from '@/lib/seo/structured-data'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-hand',
})

// Newsreader (cursief, latin) staat in de repo en wordt niet meer bij elke build
// bij Google Fonts opgehaald. De Vercel-build faalde eenmalig doordat Google een
// lettertype-URL zonder bestandsextensie teruggaf (next/font 14.2.x:
// "Cannot read properties of null (reading '1')"). Variabel lettertype, gewichten 400 en 500.
const newsreader = localFont({
  src: './fonts/Newsreader-Italic-latin.woff2',
  style: 'italic',
  weight: '400 500',
  display: 'swap',
  variable: '--font-newsreader',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()
  const seo = siteSettings.globalSeo || {}
  const fallbackTitle = seo.metaTitle || siteSettings.title || 'DRO Renovaties'
  const fallbackDescription =
    seo.metaDescription || siteSettings.description || siteSettings.footer.description

  return {
    ...buildPageMetadata({
      seo,
      fallbackTitle,
      fallbackDescription,
      pathname: '/',
      image: siteSettings.footer.logo,
    }),
    ...(siteSettings.favicon ? {icons: {icon: siteSettings.favicon}} : {}),
  }
}

export default async function SiteLayout({children}: Readonly<{children: React.ReactNode}>) {
  const [siteSettings, services, locations] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getLocations(),
  ])
  const organizationGraph = buildOrganizationGraph(
    siteSettings,
    siteSettings.organizationSeo,
    locations.map((location) => location.name)
  )
  const {isEnabled: isDraftMode} = draftMode()

  return (
    <div className={`${poppins.className} ${patrickHand.variable} ${newsreader.variable}`}>
      <JsonLd data={buildJsonLdGraph(organizationGraph)} />
      <Header siteSettings={siteSettings} />
      {children}
      <Footer locations={locations} services={services} siteSettings={siteSettings} />
      <FloatingActions {...siteSettings.floatingActions} />
      <AttributionCapture />
      <GoogleTag />
      <ConsentBanner />
      {isDraftMode && (
        <>
          <VisualEditing />
          <a
            className="fixed bottom-16 right-5 z-[60] rounded-md bg-brand-ink px-3 py-2 text-xs font-semibold text-white shadow-lg"
            href="/api/draft/disable"
          >
            Preview afsluiten
          </a>
        </>
      )}
    </div>
  )
}
