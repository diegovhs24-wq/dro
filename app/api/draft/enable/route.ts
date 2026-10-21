import {createClient} from '@sanity/client'
import {defineEnableDraftMode} from 'next-sanity/draft-mode'

// Voorbeeldmodus (BE-07): het geheime token wordt bij Sanity gecontroleerd en
// alleen interne paden zijn toegestaan als redirect. Voorheen was elk willekeurig
// "secret" voldoende, waardoor ongepubliceerde concepten zichtbaar konden worden.
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cwblo9lu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

export const {GET} = defineEnableDraftMode({client})
