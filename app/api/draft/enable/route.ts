import {createClient} from '@sanity/client'
import {defineEnableDraftMode} from 'next-sanity/draft-mode'

// Voorbeeldmodus (BE-07): het geheime token wordt bij Sanity gecontroleerd en
// alleen interne paden zijn toegestaan als redirect. Voorheen was elk willekeurig
// "secret" voldoende, waardoor ongepubliceerde concepten zichtbaar konden worden.
// Vereist SANITY_API_READ_TOKEN (Viewer) in elke Vercel-omgeving.
const token = process.env.SANITY_API_READ_TOKEN

const enable = token
  ? defineEnableDraftMode({
      client: createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cwblo9lu',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
        useCdn: false,
        token,
      }),
    })
  : null

export async function GET(request: Request) {
  if (!enable) {
    console.error('DRAFT_MODE_UNAVAILABLE: SANITY_API_READ_TOKEN ontbreekt')
    return new Response('Voorbeeldmodus is niet geconfigureerd (SANITY_API_READ_TOKEN ontbreekt).', {status: 503})
  }
  return enable.GET(request)
}
