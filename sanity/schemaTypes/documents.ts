import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {contentBlocksField} from './helpers/contentBlocksField'

function normalizeDocId(documentId: string | undefined) {
  return documentId?.replace(/^drafts\./, '')
}

function isHomeDocument(documentId: string | undefined) {
  return normalizeDocId(documentId) === 'home'
}

const pageTypeOptions = [
  {title: 'Homepage', value: 'home'},
  {title: 'Listing Page', value: 'listing'},
  {title: 'About Page', value: 'about'},
  {title: 'Process Page', value: 'process'},
  {title: 'Business Page', value: 'business'},
  {title: 'Contact Page', value: 'contact'},
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
    {name: 'notFound', title: '404 Page'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Site Title', type: 'string', validation: (Rule) => Rule.required(), group: 'general'}),
    defineField({name: 'description', title: 'Site Description', type: 'text', rows: 3, group: 'general'}),
    defineField({name: 'favicon', title: 'Favicon', type: 'cmsImage', group: 'general', description: 'Recommended: 32×32 or 64×64 PNG/SVG'}),
    defineField({name: 'headerLogo', title: 'Logo', type: 'cmsImage', group: 'header'}),
    defineField({
      name: 'headerMenu',
      title: 'Navigation Menu',
      type: 'array',
      of: [defineArrayMember({type: 'headerMenuItem'})],
      group: 'header',
    }),
    defineField({
      name: 'headerButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'headerButton'})],
      group: 'header',
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'brand',
          title: 'Brand',
          type: 'object',
          options: {collapsible: true, collapsed: false},
          fields: [
            defineField({name: 'logo', title: 'Logo', type: 'cmsImage'}),
            defineField({name: 'logoAlt', title: 'Logo Alt Text', type: 'string'}),
            defineField({name: 'brandTitle', title: 'Brand Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
        }),
        defineField({
          name: 'contact',
          title: 'Contact',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'contactTitle', title: 'Section Title', type: 'string'}),
            defineField({name: 'contactAddress', title: 'Address', type: 'string'}),
            defineField({name: 'contactPhone', title: 'Phone Label', type: 'string'}),
            defineField({name: 'contactPhoneHref', title: 'Phone URL', type: 'string'}),
            defineField({name: 'contactPhoneNote', title: 'Phone Note', type: 'string'}),
            defineField({name: 'contactEmail', title: 'Email Label', type: 'string'}),
            defineField({name: 'contactEmailHref', title: 'Email URL', type: 'string'}),
          ],
        }),
        defineField({
          name: 'services',
          title: 'Services',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'servicesTitle', title: 'Section Title', type: 'string'}),
          ],
        }),
        defineField({
          name: 'commercial',
          title: 'Commercial',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'businessTitle', title: 'Section Title', type: 'string'}),
            defineField({name: 'businessText', title: 'Intro Text', type: 'text', rows: 2}),
            defineField({name: 'businessItems', title: 'Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
            defineField({name: 'businessClosing', title: 'Closing Text', type: 'text', rows: 2}),
          ],
        }),
        defineField({
          name: 'bottom',
          title: 'Bottom Bar',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'statement', title: 'Footer Statement', type: 'string'}),
            defineField({name: 'copyright', title: 'Copyright', type: 'string'}),
            defineField({name: 'legalLinks', title: 'Legal Links', type: 'array', of: [defineArrayMember({type: 'linkItem'})]}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'footerCta',
      title: 'CTA Banner',
      type: 'ctaContent',
      group: 'footer',
      description: 'Appears above the footer on every page.',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'floatingActions',
      title: 'Floating Actions',
      type: 'object',
      group: 'general',
      fields: [
        defineField({name: 'whatsappLabel', title: 'WhatsApp Label', type: 'string'}),
        defineField({name: 'whatsappHref', title: 'WhatsApp URL', type: 'string'}),
        defineField({name: 'intakeLabel', title: 'Intake Label', type: 'string'}),
        defineField({name: 'intakeHref', title: 'Intake URL', type: 'string'}),
      ],
    }),
    defineField({
      name: 'notFound',
      title: '404 Page',
      type: 'object',
      group: 'notFound',
      fields: [
        defineField({name: 'title', title: 'Heading', type: 'string'}),
        defineField({name: 'text', title: 'Body Text', type: 'text', rows: 3}),
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          of: [defineArrayMember({type: 'headerButton'})],
        }),
      ],
    }),
    defineField({name: 'globalSeo', title: 'Global SEO', type: 'seoSettings', group: 'seo'}),
    defineField({name: 'organizationSeo', title: 'Organization / Local Business SEO', type: 'organizationSeo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  initialValue: (_params, context) => {
    const documentId = (context as {documentId?: string}).documentId
    if (isHomeDocument(documentId)) {
      return {
        slug: {
          _type: 'slug',
          current: 'home',
        },
      }
    }

    return {}
  },
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'legacy', title: 'Legacy Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required(), group: 'content'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description: 'Homepage slug is always "home".',
      initialValue: (_params, context) => {
        const ctx = context as {documentId?: string; document?: {_id?: string}}
        const documentId = ctx.documentId
        const fallbackId = ctx.document?._id
        if (isHomeDocument(documentId || fallbackId)) {
          return {
            _type: 'slug',
            current: 'home',
          }
        }
        return {}
      },
      readOnly: (context) => {
        if (!isHomeDocument(context.document?._id)) {
          return false
        }

        const currentSlug = (context.document?.slug as {current?: string} | undefined)?.current
        return currentSlug === 'home'
      },
      validation: (Rule) =>
        Rule.custom((slug, context) => {
          const documentId = context.document?._id
          const currentSlug = slug?.current

          if (isHomeDocument(documentId)) {
            if (currentSlug !== 'home') {
              return 'Homepage slug must be "home".'
            }
            return true
          }

          if (!currentSlug) {
            return 'Slug is required.'
          }

          if (currentSlug === 'home') {
            return 'Slug "home" is reserved for the Homepage.'
          }

          return true
        }),
      group: 'content',
    }),
    {...contentBlocksField, group: 'content'},
    defineField({
      name: 'pageType',
      title: 'Legacy Page Type',
      type: 'string',
      options: {list: pageTypeOptions},
      description: 'Deprecated. Use Page Builder blocks instead.',
      hidden: true,
      group: 'legacy',
    }),
    defineField({name: 'home', title: 'Homepage Sections (Legacy)', type: 'homePageContent', hidden: true, group: 'legacy'}),
    defineField({name: 'listing', title: 'Listing Page Sections (Legacy)', type: 'listingPageContent', hidden: true, group: 'legacy'}),
    defineField({name: 'about', title: 'About Page Sections (Legacy)', type: 'aboutPageContent', hidden: true, group: 'legacy'}),
    defineField({name: 'process', title: 'Process Page Sections (Legacy)', type: 'processPageContent', hidden: true, group: 'legacy'}),
    defineField({name: 'business', title: 'Business Page Sections (Legacy)', type: 'businessPageContent', hidden: true, group: 'legacy'}),
    defineField({name: 'contact', title: 'Contact Page Sections (Legacy)', type: 'contactPageContent', hidden: true, group: 'legacy'}),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoSettings',
      description: 'Leave empty to fallback to global SEO settings.',
      options: {collapsible: true, collapsed: true},
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare({title, slug}) {
      return {
        title,
        subtitle: slug === 'home' ? '/' : `/${slug || ''}`,
      }
    },
  },
})

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    {name: 'card', title: 'Card', default: true},
    {name: 'page', title: 'Page'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required(), group: 'card'}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required(), group: 'card'}),
    defineField({name: 'sortOrder', title: 'Sort Order', type: 'number', group: 'card'}),
    defineField({name: 'icon', title: 'Icon Name', type: 'string', group: 'card'}),
    defineField({name: 'label', title: 'Label', type: 'string', group: 'card'}),
    defineField({name: 'cardImage', title: 'Card Image', type: 'cmsImage', group: 'card'}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'card'}),
    defineField({name: 'pageContent', title: 'Page Content', type: 'servicePageContent', group: 'page'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoSettings', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current', media: 'cardImage.image'},
  },
})

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {name: 'summary', title: 'Summary', default: true},
    {name: 'detail', title: 'Detail'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required(), group: 'summary'}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required(), group: 'summary'}),
    defineField({name: 'sortOrder', title: 'Sort Order', type: 'number', group: 'summary'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'summary'}),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'summary'}),
    defineField({name: 'type', title: 'Project Type', type: 'string', group: 'summary'}),
    defineField({name: 'duration', title: 'Duration', type: 'string', group: 'summary'}),
    defineField({name: 'before', title: 'Before Label', type: 'string', group: 'summary'}),
    defineField({name: 'after', title: 'After Label', type: 'string', group: 'summary'}),
    defineField({name: 'beforeImage', title: 'Card Before Image', type: 'cmsImage', group: 'summary'}),
    defineField({name: 'afterImage', title: 'Card After Image', type: 'cmsImage', group: 'summary'}),
    defineField({name: 'story', title: 'Project Story', type: 'text', rows: 5, group: 'detail'}),
    defineField({name: 'images', title: 'Detail Images', type: 'array', of: [defineArrayMember({type: 'cmsImage'})], group: 'detail'}),
    defineField({name: 'work_items', title: 'Work Items', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'detail'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoSettings', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'location', media: 'images.0.image'},
  },
})

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'image', title: 'Image', type: 'cmsImage'}),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3}),
    defineField({name: 'sortOrder', title: 'Sort Order', type: 'number'}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'location', media: 'image.image'},
  },
})

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Logo', type: 'cmsImage'}),
    defineField({name: 'accent', title: 'Fallback Accent Classes', type: 'string'}),
    defineField({name: 'sortOrder', title: 'Sort Order', type: 'number'}),
  ],
  preview: {
    select: {title: 'name', media: 'image.image'},
  },
})

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({name: 'source', title: 'Source Path', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'destination', title: 'Destination URL / Path', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'permanent', title: 'Permanent Redirect', type: 'boolean', initialValue: true}),
    defineField({name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {title: 'source', subtitle: 'destination'},
  },
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Each item is a separate paragraph.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'category', title: 'Category', type: 'string', description: 'Optional — used for grouping (e.g. "General", "Process", "Pricing").'}),
    defineField({name: 'sortOrder', title: 'Sort Order', type: 'number'}),
  ],
  preview: {
    select: {title: 'question', subtitle: 'category'},
    prepare({title, subtitle}) {
      return {title: title || 'FAQ', subtitle: subtitle || ''}
    },
  },
  orderings: [
    {title: 'Sort Order', name: 'sortOrderAsc', by: [{field: 'sortOrder', direction: 'asc'}]},
    {title: 'Question A–Z', name: 'questionAsc', by: [{field: 'question', direction: 'asc'}]},
  ],
})

export const servicesIndex = defineType({
  name: 'servicesIndex',
  title: 'Services Index',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'listing', title: 'Listing'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Page Title', type: 'string', validation: (Rule) => Rule.required(), group: 'content'}),
    {...contentBlocksField, group: 'content'},
    defineField({
      name: 'listingSettings',
      title: 'Listing Settings',
      type: 'object',
      group: 'listing',
      fields: [
        defineField({name: 'limit', title: 'Number of Services to Show', type: 'number', description: 'Leave empty to show all services.'}),
        defineField({
          name: 'layout',
          title: 'Display Layout',
          type: 'string',
          options: {
            list: [
              {title: 'Grid — 3 columns', value: 'grid'},
              {title: 'Full grid — soft background', value: 'fullGrid'},
            ],
          },
          initialValue: 'grid',
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoSettings', options: {collapsible: true, collapsed: true}, group: 'seo'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Services Index', subtitle: '/diensten'}
    },
  },
})

export const projectsIndex = defineType({
  name: 'projectsIndex',
  title: 'Projects Index',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'listing', title: 'Listing'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Page Title', type: 'string', validation: (Rule) => Rule.required(), group: 'content'}),
    {...contentBlocksField, group: 'content'},
    defineField({
      name: 'listingSettings',
      title: 'Listing Settings',
      type: 'object',
      group: 'listing',
      fields: [
        defineField({name: 'limit', title: 'Number of Projects to Show', type: 'number', description: 'Leave empty to show all projects.'}),
        defineField({
          name: 'layout',
          title: 'Display Layout',
          type: 'string',
          options: {
            list: [
              {title: 'Grid — 3 columns', value: 'grid'},
              {title: 'List — 1 column', value: 'list'},
            ],
          },
          initialValue: 'grid',
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoSettings', options: {collapsible: true, collapsed: true}, group: 'seo'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Projects Index', subtitle: '/projecten'}
    },
  },
})

export const documentSchemaTypes = [siteSettings, page, servicesIndex, projectsIndex, faq, service, project, review, partner, redirect]
