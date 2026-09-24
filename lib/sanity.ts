import {createClient} from '@sanity/client'
import {draftMode} from 'next/headers'

export type SanityImage = {
  _type?: 'image'
  asset?: {
    _ref?: string
  }
  alt?: string
}

export type CmsImageSource = {
  image?: SanityImage | null
  externalImageUrl?: string | null
  alt?: string | null
}

type SanityFetchOptions = {
  revalidate?: number
}

function getProjectId() {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cwblo9lu'
}

function getDataset() {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
}

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

const client = createClient({
  projectId: getProjectId(),
  dataset: getDataset(),
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

const previewClient = process.env.SANITY_API_READ_TOKEN
  ? createClient({
      projectId: getProjectId(),
      dataset: getDataset(),
      apiVersion,
      useCdn: false,
      perspective: 'previewDrafts',
      token: process.env.SANITY_API_READ_TOKEN,
      stega: {
        enabled: true,
        studioUrl: '/studio',
      },
    })
  : null

function isPreviewMode(): boolean {
  try {
    return draftMode().isEnabled
  } catch {
    return false
  }
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: SanityFetchOptions = {},
) {
  if (isPreviewMode() && previewClient) {
    return previewClient.fetch<T>(query, params, {
      next: {revalidate: 0},
    })
  }

  // 1 uur i.p.v. 60s: er is geen Sanity-webhook voor on-demand revalidatie,
  // dus elke pagina probeerde tot nu toe elke minuut opnieuw te bouwen voor
  // content die zelden wijzigt. Individuele calls kunnen nog steeds een
  // kortere `options.revalidate` opgeven waar dat echt nodig is.
  return client.fetch<T>(query, params, {
    next: {revalidate: process.env.NODE_ENV === 'production' ? (options.revalidate ?? 3600) : 0},
  })
}

export function sanityImageUrl(image: SanityImage | null | undefined, width = 1200, quality = 75) {
  const ref = image?.asset?._ref

  if (!ref || !ref.startsWith('image-')) {
    return null
  }

  const parts = ref.split('-')

  if (parts.length < 4) {
    return null
  }

  const id = parts[1]
  const dimensions = parts[2]
  const format = parts[3]

  return `https://cdn.sanity.io/images/${getProjectId()}/${getDataset()}/${id}-${dimensions}.${format}?w=${width}&auto=format&q=${quality}`
}

export function cmsImageUrl(source: CmsImageSource | SanityImage | string | null | undefined, width = 1200, quality = 75) {
  if (!source) {
    return null
  }

  if (typeof source === 'string') {
    return source
  }

  if ('externalImageUrl' in source && source.externalImageUrl) {
    return source.externalImageUrl
  }

  if ('image' in source) {
    return sanityImageUrl(source.image, width, quality)
  }

  return sanityImageUrl(source as SanityImage, width, quality)
}

// Neutrale, statische blur-placeholder (geen extra netwerkcall of LQIP-query
// nodig) voor next/image `placeholder="blur"` op afbeeldingen zonder eigen
// LQIP-data. Zorgt voor een rustiger laadovergang zonder harde flits.
export const NEUTRAL_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlN2UzZGEiLz48L3N2Zz4='

export function cleanString(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : ''
}
