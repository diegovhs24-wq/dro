import {createClient} from '@sanity/client'

// Server-only client met schrijfrechten (SANITY_API_WRITE_TOKEN) voor de
// dataset uit de omgeving. Alleen voor NIET-persoonsgebonden schrijfacties:
// aanvragen gaan via lib/sanityLeadsClient.ts naar de private dataset "leads".
// Nooit importeren vanuit client components: het token mag niet naar de browser.
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cwblo9lu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
