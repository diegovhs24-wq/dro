import {createClient} from '@sanity/client'

// Aparte, server-only client met schrijfrechten (SANITY_API_WRITE_TOKEN).
// Nooit importeren vanuit client components: deze token mag nooit naar de
// browser lekken. Gedeeld door alle API routes die naar Sanity schrijven.
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lxi5ttc2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
