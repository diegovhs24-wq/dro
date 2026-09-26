import type {StructureBuilder, StructureResolver, StructureResolverContext} from 'sanity/structure'
import type {ComponentType} from 'react'
import {
  CogIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentsIcon,
  EarthGlobeIcon,
  EnvelopeIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InlineIcon,
  LinkIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
} from '@sanity/icons'

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

export const singletonSchemaTypes = ['siteSettings', 'servicesIndex', 'projectsIndex', 'blogsIndex'] as const
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

// ---------------------------------------------------------------------------
// Document counts
// ---------------------------------------------------------------------------

async function getStructureCounts(context: StructureResolverContext) {
  const normalize = (ids: string[] | undefined) =>
    new Set((ids || []).map((id) => id.replace(/^drafts\./, ''))).size

  try {
    const client = context.getClient({apiVersion: '2024-01-01'})
    const data = await client.fetch<{
      otherPageIds: string[]
      projectIds: string[]
      serviceIds: string[]
      reviewIds: string[]
      faqIds: string[]
      partnerIds: string[]
      intakeFormIds: string[]
      submissionIds: string[]
      iamexpatSubmissionIds: string[]
      blogPostIds: string[]
      blogAuthorIds: string[]
      blogCategoryIds: string[]
    }>(
      `{
        "otherPageIds":    *[_type == "page" && !(_id in [$homeId, $homeDraftId])]._id,
        "projectIds":      *[_type == "project"]._id,
        "serviceIds":      *[_type == "service"]._id,
        "reviewIds":       *[_type == "review"]._id,
        "faqIds":          *[_type == "faq"]._id,
        "partnerIds":      *[_type == "partner"]._id,
        "intakeFormIds":   *[_type == "intakeForm"]._id,
        "submissionIds":   *[_type == "formSubmission"]._id,
        "iamexpatSubmissionIds": *[_type == "iamexpatSubmission"]._id,
        "blogPostIds":     *[_type == "blogPost"]._id,
        "blogAuthorIds":   *[_type == "blogAuthor"]._id,
        "blogCategoryIds": *[_type == "blogCategory"]._id
      }`,
      {homeId: 'home', homeDraftId: 'drafts.home'},
    )

    return {
      otherPages:    normalize(data?.otherPageIds),
      projects:      normalize(data?.projectIds),
      services:      normalize(data?.serviceIds),
      reviews:       normalize(data?.reviewIds),
      faqs:          normalize(data?.faqIds),
      partners:      normalize(data?.partnerIds),
      intakeForms:   normalize(data?.intakeFormIds),
      submissions:   normalize(data?.submissionIds),
      iamexpatSubmissions: normalize(data?.iamexpatSubmissionIds),
      blogPosts:     normalize(data?.blogPostIds),
      blogAuthors:   normalize(data?.blogAuthorIds),
      blogCategories: normalize(data?.blogCategoryIds),
    }
  } catch {
    return {
      otherPages: 0, projects: 0, services: 0, reviews: 0,
      faqs: 0, partners: 0, intakeForms: 0, submissions: 0,
      iamexpatSubmissions: 0,
      blogPosts: 0, blogAuthors: 0, blogCategories: 0,
    }
  }
}

// ---------------------------------------------------------------------------
// Sub-builders
// ---------------------------------------------------------------------------

function pagesSection(S: StructureBuilder, otherPages: number) {
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
            .title('Homepage')
            .icon(HomeIcon)
            .child(S.editor().id('home').schemaType('page').documentId('home')),
          S.divider(),
          S.listItem()
            .id('other-pages')
            .title(`Other Pages (${otherPages})`)
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('page')
                .title(`Other Pages`)
                .filter('_type == "page" && !(_id in [$homeId, $homeDraftId])')
                .params({homeId: 'home', homeDraftId: 'drafts.home'}),
            ),
        ]),
    )
}

function servicesSection(S: StructureBuilder, count: number) {
  return S.listItem()
    .id('services-section')
    .title(`Services (${count})`)
    .icon(TagIcon)
    .child(
      S.list()
        .title('Services')
        .items([
          singletonItem(S, 'servicesIndex', 'Services Index Page', FolderIcon),
          S.divider(),
          S.documentTypeListItem('service')
            .title(`All Services (${count})`)
            .icon(TagIcon),
        ]),
    )
}

function projectsSection(S: StructureBuilder, count: number) {
  return S.listItem()
    .id('projects-section')
    .title(`Projects (${count})`)
    .icon(ImageIcon)
    .child(
      S.list()
        .title('Projects')
        .items([
          singletonItem(S, 'projectsIndex', 'Projects Index Page', FolderIcon),
          S.divider(),
          S.documentTypeListItem('project')
            .title(`All Projects (${count})`)
            .icon(ImageIcon),
        ]),
    )
}

function blogsSection(
  S: StructureBuilder,
  postCount: number,
  authorCount: number,
  categoryCount: number,
) {
  return S.listItem()
    .id('blogs-section')
    .title(`Kennisbank (${postCount})`)
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Kennisbank')
        .items([
          singletonItem(S, 'blogsIndex', 'Kennisbank Index Page', FolderIcon),
          S.divider(),
          S.documentTypeListItem('blogPost')
            .title(`All Blog Posts (${postCount})`)
            .icon(DocumentTextIcon),
          S.documentTypeListItem('blogAuthor')
            .title(`Authors (${authorCount})`)
            .icon(UsersIcon),
          S.documentTypeListItem('blogCategory')
            .title(`Categories (${categoryCount})`)
            .icon(TagIcon),
        ]),
    )
}

// ---------------------------------------------------------------------------
// Root structure
// ---------------------------------------------------------------------------

export const structure: StructureResolver = async (S, context) => {
  const c = await getStructureCounts(context)

  return S.list()
    .title('DRO Renovaties')
    .items([

      // ── Content ──────────────────────────────────────────────
      pagesSection(S, c.otherPages),
      servicesSection(S, c.services),
      projectsSection(S, c.projects),
      blogsSection(S, c.blogPosts, c.blogAuthors, c.blogCategories),

      S.divider(),

      // ── Leads & Forms ─────────────────────────────────────────
      S.documentTypeListItem('intakeForm')
        .title(`Intake Forms (${c.intakeForms})`)
        .icon(InlineIcon),
      S.documentTypeListItem('formSubmission')
        .title(`Submissions (${c.submissions})`)
        .icon(EnvelopeIcon),

      S.divider(),

      // ── Campaigns ────────────────────────────────────────────
      S.documentTypeListItem('iamexpatSubmission')
        .title(`IamExpat Leads (${c.iamexpatSubmissions})`)
        .icon(EarthGlobeIcon),

      S.divider(),

      // ── Social Proof ──────────────────────────────────────────
      S.documentTypeListItem('review')
        .title(`Reviews (${c.reviews})`)
        .icon(StarIcon),
      S.documentTypeListItem('partner')
        .title(`Partners (${c.partners})`)
        .icon(UsersIcon),
      S.documentTypeListItem('faq')
        .title(`FAQs (${c.faqs})`)
        .icon(HelpCircleIcon),

      S.divider(),

      // ── Settings ──────────────────────────────────────────────
      singletonItem(S, 'siteSettings', 'Site Settings', CogIcon),
      S.documentTypeListItem('redirect')
        .title('URL Redirects')
        .icon(LinkIcon),

    ])
}
