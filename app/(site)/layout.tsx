import type {Metadata, Viewport} from 'next'
import {Newsreader, Patrick_Hand, Poppins} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import FloatingActions from '@/components/FloatingActions'
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

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-newsreader',
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
