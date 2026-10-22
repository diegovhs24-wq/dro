import {createClient} from '@sanity/client'
import {draftMode} from 'next/headers'
import {sanitizeOutdatedClaimsDeep} from '@/lib/seo/business'

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

// Next 15: draftMode() is asynchroon. Buiten een request-context (bv. bij
// generateStaticParams of sitemap tijdens de build) gooit het; dan geen preview.
async function isPreviewMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: SanityFetchOptions = {},
) {
  if (previewClient && (await isPreviewMode())) {
    return previewClient.fetch<T>(query, params, {
      next: {revalidate: 0},
    })
  }

  const result = await client.fetch<T>(query, params, {
    next: {revalidate: process.env.NODE_ENV === 'production' ? (options.revalidate ?? 60) : 0},
  })
  // Vangnet tegen verouderde claims ("geen aanbetaling") in gepubliceerde
  // content; zie lib/seo/business.ts en docs/audit/16-ai-findability-geo.md.
  return sanitizeOutdatedClaimsDeep(result)
}

export function sanityImageUrl(image: SanityImage | null | undefined, width = 1200) {
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

  return `https://cdn.sanity.io/images/${getProjectId()}/${getDataset()}/${id}-${dimensions}.${format}?w=${width}&auto=format`
}

export function cmsImageUrl(source: CmsImageSource | SanityImage | string | null | undefined, width = 1200) {
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
    return sanityImageUrl(source.image, width)
  }

  return sanityImageUrl(source as SanityImage, width)
}

export function cleanString(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : ''
}
