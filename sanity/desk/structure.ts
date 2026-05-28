import type {StructureBuilder, StructureResolver, StructureResolverContext} from 'sanity/structure'
import type {ComponentType} from 'react'
import {
  CogIcon,
  DocumentTextIcon,
  DocumentsIcon,
  HomeIcon,
  ImageIcon,
  LinkIcon,
  StarIcon,
  TagIcon,
} from '@sanity/icons'

export const singletonSchemaTypes = ['siteSettings'] as const
const singletonSchemaTypeSet = new Set<string>(singletonSchemaTypes)

export function isSingletonSchemaType(schemaType: string) {
  return singletonSchemaTypeSet.has(schemaType)
}

function singletonItem(
  S: StructureBuilder,
  schemaType: string,
  title: string,
  icon?: ComponentType<Record<string, unknown>>,
) {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .icon(icon)
    .child(S.editor().id(schemaType).schemaType(schemaType).documentId(schemaType))
}

async function getStructureCounts(context: StructureResolverContext) {
  const normalizeDocumentIds = (ids: string[] | undefined) =>
    new Set((ids || []).map((id) => id.replace(/^drafts\./, ''))).size

  try {
    const client = context.getClient({apiVersion: '2024-01-01'})
    const data = await client.fetch<{
      otherPageIds: string[]
      projectIds: string[]
      serviceIds: string[]
      reviewIds: string[]
    }>(
      `{
        "otherPageIds": *[_type == "page" && !(_id in [$homeId, $homeDraftId])]._id,
        "projectIds": *[_type == "project"]._id,
        "serviceIds": *[_type == "service"]._id,
        "reviewIds": *[_type == "review"]._id
      }`,
      {homeId: 'home', homeDraftId: 'drafts.home'},
    )

    return {
      allOtherPages: normalizeDocumentIds(data?.otherPageIds),
      projects: normalizeDocumentIds(data?.projectIds),
      services: normalizeDocumentIds(data?.serviceIds),
      reviews: normalizeDocumentIds(data?.reviewIds),
    }
  } catch {
    return {
      allOtherPages: 0,
      projects: 0,
      services: 0,
      reviews: 0,
    }
  }
}

function pagesItem(S: StructureBuilder, allOtherPagesCount: number) {
  const otherPagesTitle = `All Other Pages (${allOtherPagesCount})`

  return S.listItem()
    .id('pages')
    .title('Pages')
    .icon(DocumentsIcon)
    .child(
      S.list()
        .title('Pages')
        .items([
          S.listItem()
            .id('homepage')
            .title('Homepage (slug: home)')
            .icon(HomeIcon)
            .child(S.editor().id('home').schemaType('page').documentId('home')),
          S.listItem()
            .id('other-pages')
            .title(otherPagesTitle)
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('page')
                .title(otherPagesTitle)
                .filter('_type == "page" && !(_id in [$homeId, $homeDraftId])')
                .params({homeId: 'home', homeDraftId: 'drafts.home'}),
            ),
        ]),
    )
}


export const structure: StructureResolver = async (S, context) => {
  const counts = await getStructureCounts(context)

  return S.list()
    .title('DRO CMS')
    .items([
      singletonItem(S, 'siteSettings', 'Site Settings', CogIcon),
      pagesItem(S, counts.allOtherPages),
      S.documentTypeListItem('service').title(`Services (${counts.services})`).icon(TagIcon),
      S.documentTypeListItem('project').title(`Projects (${counts.projects})`).icon(ImageIcon),
      S.documentTypeListItem('review').title(`Reviews (${counts.reviews})`).icon(StarIcon),
      S.documentTypeListItem('partner').title('Partners').icon(ImageIcon),
      S.documentTypeListItem('redirect').title('URL Redirects').icon(LinkIcon),
    ])
}
