import {defineArrayMember, defineField, defineType} from 'sanity'
import {blockPreview} from './helpers/blockPreviews'
import {
  HomeIcon,
  DocumentTextIcon,
  ComposeIcon,
  BlockquoteIcon,
  ThLargeIcon,
  TagIcon,
  RocketIcon,
  EnvelopeIcon,
  UsersIcon,
  PresentationIcon,
  OlistIcon,
  CheckmarkIcon,
  LockIcon,
  HelpCircleIcon,
  InlineIcon,
  CaseIcon,
  StarIcon,
  PlayIcon,
} from '@sanity/icons'

const iconOptions = [
  'bathroom',
  'renovation',
  'extension',
  'newbuild',
  'kitchen',
  'tiles',
  'floorHeating',
  'heatPump',
  'solar',
  'electric',
  'paint',
  'maintenance',
  'planning',
  'document',
  'budget',
  'payment',
  'warranty',
  'ruler',
  'calendar',
  'clock',
  'phone',
  'mail',
  'truck',
  'box',
  'key',
  'safety',
  'support',
  'spark',
  'checklist',
  'team',
  'quality',
  'shield',
  'handshake',
  'materials',
  'tools',
  'location',
  'finish',
  'contact',
  'idea',
  'talk',
  'delivery',
]

export const cmsImage = defineType({
  name: 'cmsImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Sanity Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alternative Text', type: 'string'}],
    }),
    defineField({
      name: 'externalImageUrl',
      title: 'External Image URL',
      type: 'url',
      description: 'Use only when the image should stay hosted outside Sanity.',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      externalImageUrl: 'externalImageUrl',
    },
    prepare({media, externalImageUrl}) {
      return {
        title: externalImageUrl || 'Image',
        media,
      }
    },
  },
})

export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', title: 'Meta Title', type: 'string'}),
    defineField({name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3}),
    defineField({name: 'openGraphImage', title: 'Open Graph Image', type: 'cmsImage'}),
    defineField({name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false}),
  ],
})

export const organizationSeo = defineType({
  name: 'organizationSeo',
  title: 'Organization SEO',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Brand Name', type: 'string', description: 'Short public-facing name, e.g. "DRO Renovaties".'}),
    defineField({name: 'legalName', title: 'Legal Name', type: 'string'}),
    defineField({name: 'slogan', title: 'Slogan', type: 'string'}),
    defineField({name: 'siteUrl', title: 'Site URL Override', type: 'url'}),
    defineField({name: 'logo', title: 'Logo', type: 'cmsImage'}),
    defineField({name: 'telephone', title: 'Telephone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'kvkNumber', title: 'KvK Number', type: 'string', description: 'Dutch Chamber of Commerce registration number.'}),
    defineField({name: 'streetAddress', title: 'Street Address', type: 'string'}),
    defineField({name: 'addressLocality', title: 'City', type: 'string'}),
    defineField({name: 'postalCode', title: 'Postal Code', type: 'string'}),
    defineField({name: 'addressRegion', title: 'Region', type: 'string'}),
    defineField({name: 'addressCountry', title: 'Country Code', type: 'string', initialValue: 'NL'}),
    defineField({name: 'latitude', title: 'Latitude', type: 'number'}),
    defineField({name: 'longitude', title: 'Longitude', type: 'number'}),
    defineField({
      name: 'areaServed',
      title: 'Area Served',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'sameAs',
      title: 'Social / Profile URLs',
      type: 'array',
      of: [defineArrayMember({type: 'url'})],
    }),
    defineField({
      name: 'knowsAbout',
      title: 'Knows About (topics/services)',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Topical/service expertise for entity and knowledge-graph optimization.',
    }),
    defineField({name: 'priceRange', title: 'Price Range', type: 'string', initialValue: '$$'}),
    defineField({
      name: 'aggregateRatingValue',
      title: 'Google Rating (average, 1-5)',
      type: 'number',
      description:
        'Real current average rating from Google Business Profile, e.g. 4.8. Leave empty to omit rating markup — do not enter an estimate.',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'aggregateRatingCount',
      title: 'Google Review Count',
      type: 'number',
      description:
        'Real current number of Google reviews behind the rating above. Both fields must be filled in for rating markup to appear.',
      validation: (Rule) => Rule.min(1),
    }),
  ],
})

export const linkItem = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'href', title: 'URL / Path', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})

export const smartLink = defineType({
  name: 'smartLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal — select a page, service, project or blog post', value: 'internal'},
          {title: 'External — enter a URL', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalRef',
      title: 'Page / Service / Project',
      type: 'reference',
      to: [
        {type: 'page'},
        {type: 'servicesIndex'},
        {type: 'projectsIndex'},
        {type: 'blogsIndex'},
        {type: 'service'},
        {type: 'project'},
        {type: 'blogPost'},
        {type: 'blogCategory'},
      ],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL',
      type: 'string',
      description: 'Full URL (https://example.com) or a site path (/contact)',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {linkType: 'linkType', externalUrl: 'externalUrl'},
    prepare({linkType, externalUrl}: {linkType?: string; externalUrl?: string}) {
      return {
        title: linkType === 'internal' ? 'Internal link' : (externalUrl || 'No URL set'),
        subtitle: linkType === 'internal' ? 'Internal' : 'External',
      }
    },
  },
})

export const megaMenuLink = defineType({
  name: 'megaMenuLink',
  title: 'Mega Menu Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'link', title: 'Link', type: 'smartLink'}),
  ],
  preview: {
    select: {title: 'label'},
  },
})

export const megaMenuColumn = defineType({
  name: 'megaMenuColumn',
  title: 'Menu Column',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Column Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'megaMenuLink'})],
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const headerMenuItem = defineType({
  name: 'headerMenuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Link', value: 'link'},
          {title: 'Mega Menu', value: 'megaMenu'},
        ],
        layout: 'radio',
      },
      initialValue: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'smartLink',
      hidden: ({parent}) => parent?.type !== 'link',
    }),
    defineField({
      name: 'columns',
      title: 'Menu Columns',
      type: 'array',
      of: [defineArrayMember({type: 'megaMenuColumn'})],
      hidden: ({parent}) => parent?.type !== 'megaMenu',
    }),
    defineField({
      name: 'promo',
      title: 'Promo Card',
      type: 'object',
      hidden: ({parent}) => parent?.type !== 'megaMenu',
      fields: [
        defineField({name: 'image', title: 'Image', type: 'cmsImage'}),
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'footerText', title: 'Footer Text', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'type'},
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {
        title: title || 'Menu Item',
        subtitle: subtitle === 'megaMenu' ? 'Mega Menu' : 'Link',
      }
    },
  },
})

export const headerButton = defineType({
  name: 'headerButton',
  title: 'Header Button',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'link', title: 'Link', type: 'smartLink'}),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Primary — orange filled (default)', value: 'primary'},
          {title: 'Outlined — white with border', value: 'outlined'},
        ],
      },
      initialValue: 'primary',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'variant'},
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {
        title: title || 'Button',
        subtitle: subtitle === 'outlined' ? 'Outlined' : 'Primary',
      }
    },
  },
})

export const iconText = defineType({
  name: 'iconText',
  title: 'Icon Text',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: iconOptions.map((value) => ({title: value, value}))},
    }),
    defineField({name: 'note', title: 'Note', type: 'string'}),
    defineField({name: 'logo', title: 'Logo', type: 'cmsImage'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'icon'},
  },
})

export const ctaContent = defineType({
  name: 'ctaContent',
  title: 'CTA Content',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'headerButton'})],
      description: 'First button is primary, second is outlined (matches header button style).',
    }),
    defineField({
      name: 'ratingScore',
      title: 'Rating Score',
      type: 'number',
      description: 'Number of stars to display (1–5). E.g. 4.8 shows 5 filled stars.',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'ratingLabel',
      title: 'Rating Label',
      type: 'string',
      description: 'Text shown next to the stars. E.g. "4.8 Star Rating".',
    }),
  ],
})

export const pageHeroContent = defineType({
  name: 'pageHeroContent',
  title: 'Page Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({name: 'backgroundImage', title: 'Background Image', type: 'cmsImage'}),
    defineField({name: 'primaryLabel', title: 'Primary Button Label', type: 'string'}),
    defineField({name: 'primaryLink', title: 'Primary Button Link', type: 'smartLink'}),
    defineField({name: 'secondaryLabel', title: 'Secondary Button Label', type: 'string'}),
    defineField({name: 'secondaryLink', title: 'Secondary Button Link', type: 'smartLink'}),
  ],
})

export const listBlock = defineType({
  name: 'listBlock',
  title: 'List Block',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'array', of: [defineArrayMember({type: 'block'})]}),
  ],
  preview: {
    select: {title: 'question'},
  },
})

export const faqRichItem = defineType({
  name: 'faqRichItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
  preview: {
    select: {title: 'question'},
  },
})

export const homePageContent = defineType({
  name: 'homePageContent',
  title: 'Homepage Content',
  type: 'object',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'coverageText', title: 'Coverage Text', type: 'text', rows: 2}),
        defineField({name: 'backgroundImage', title: 'Background Image', type: 'cmsImage'}),
        defineField({name: 'headlineTop', title: 'Headline Top', type: 'string'}),
        defineField({name: 'headlineHighlight', title: 'Headline Highlight', type: 'string'}),
        defineField({name: 'headlineBottom', title: 'Headline Bottom', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'trustItems', title: 'Trust Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
        defineField({name: 'note', title: 'Handwritten Note', type: 'text', rows: 2}),
        defineField({name: 'intakeForm', title: 'Intake Form', type: 'reference', to: [{type: 'intakeForm'}]}),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'value', title: 'Value', type: 'string'}),
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {list: iconOptions.map((value) => ({title: value, value}))},
                }),
                defineField({name: 'rating', title: 'Use Google Rating Badge', type: 'boolean'}),
              ],
            }),
          ],
        }),
        defineField({name: 'processIntro', title: 'Process Intro', type: 'text', rows: 2}),
        defineField({
          name: 'processSteps',
          title: 'Process Steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string'}),
                defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {list: iconOptions.map((value) => ({title: value, value}))},
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'problemSolution',
      title: 'Problem / Solution',
      type: 'object',
      fields: [
        defineField({name: 'problemEyebrow', title: 'Problem Eyebrow', type: 'string'}),
        defineField({name: 'problemTitle', title: 'Problem Title', type: 'string'}),
        defineField({name: 'problems', title: 'Problems', type: 'array', of: [defineArrayMember({type: 'string'})]}),
        defineField({name: 'solutionEyebrow', title: 'Solution Eyebrow', type: 'string'}),
        defineField({name: 'solutionTitle', title: 'Solution Title', type: 'string'}),
        defineField({name: 'solutions', title: 'Solutions', type: 'array', of: [defineArrayMember({type: 'string'})]}),
        defineField({name: 'solutionNote', title: 'Solution Note', type: 'text', rows: 2}),
        defineField({name: 'bannerTitle', title: 'Banner Title', type: 'string'}),
        defineField({name: 'bannerButtonLabel', title: 'Banner Button Label', type: 'string'}),
        defineField({name: 'bannerButtonHref', title: 'Banner Button URL', type: 'string'}),
      ],
    }),
    defineField({
      name: 'servicesSection',
      title: 'Services Section',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'linkLabel', title: 'Link Label', type: 'string'}),
        defineField({name: 'linkHref', title: 'Link URL', type: 'string'}),
        defineField({name: 'limit', title: 'Number of Services', type: 'number'}),
      ],
    }),
    defineField({
      name: 'afbouwSection',
      title: 'Afbouw Section',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
        defineField({name: 'buttonHref', title: 'Button URL', type: 'string'}),
        defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
      ],
    }),
    defineField({
      name: 'projectsSection',
      title: 'Projects Section',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'limit', title: 'Number of Projects', type: 'number'}),
      ],
    }),
    defineField({name: 'cta', title: 'CTA', type: 'ctaContent'}),
  ],
})

export const listingPageContent = defineType({
  name: 'listingPageContent',
  title: 'Listing Page Content',
  type: 'object',
  fields: [
    defineField({name: 'hero', title: 'Hero', type: 'pageHeroContent'}),
    defineField({name: 'cta', title: 'CTA', type: 'ctaContent'}),
  ],
})

export const aboutPageContent = defineType({
  name: 'aboutPageContent',
  title: 'About Page Content',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({name: 'sketchLabels', title: 'Sketch Labels', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (Rule) => Rule.max(3)}),
    defineField({name: 'sketchClosing', title: 'Sketch Closing', type: 'text', rows: 2}),
    defineField({name: 'introItems', title: 'Intro Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
    defineField({name: 'teamEyebrow', title: 'Team Eyebrow', type: 'string'}),
    defineField({name: 'teamTitle', title: 'Team Title', type: 'string'}),
    defineField({
      name: 'coreTeam',
      title: 'Core Team',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({name: 'image', title: 'Image', type: 'cmsImage'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
          ],
        }),
      ],
    }),
    defineField({name: 'teamBanner', title: 'Team Banner', type: 'string'}),
    defineField({name: 'teamImageEyebrow', title: 'Team Image Eyebrow', type: 'string'}),
    defineField({name: 'teamImageTitle', title: 'Team Image Title', type: 'string'}),
    defineField({name: 'teamImage', title: 'Team Image', type: 'cmsImage'}),
  ],
})

export const processPageContent = defineType({
  name: 'processPageContent',
  title: 'Process Page Content',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'titlePrefix', title: 'Title Prefix', type: 'string'}),
    defineField({name: 'titleHighlight', title: 'Title Highlight', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 2}),
    defineField({name: 'note', title: 'Note Card', type: 'text', rows: 3}),
    defineField({name: 'sideNote', title: 'Side Note', type: 'text', rows: 2}),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
            defineField({name: 'note', title: 'Note', type: 'string'}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: iconOptions.map((value) => ({title: value, value}))},
            }),
          ],
        }),
      ],
    }),
    defineField({name: 'benefits', title: 'Benefits', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
    defineField({name: 'trustPoints', title: 'Trust Points', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
    defineField({name: 'faqEyebrow', title: 'FAQ Eyebrow', type: 'string'}),
    defineField({name: 'faqTitle', title: 'FAQ Title', type: 'string'}),
    defineField({name: 'faqIntro', title: 'FAQ Intro', type: 'text', rows: 3}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      description: 'Select FAQs from the FAQ collection.',
    }),
    defineField({name: 'intakeBannerTitle', title: 'Intake Banner Title', type: 'string'}),
    defineField({name: 'intakeBannerText', title: 'Intake Banner Text', type: 'text', rows: 2}),
    defineField({name: 'cta', title: 'CTA', type: 'ctaContent'}),
  ],
})

export const businessPageContent = defineType({
  name: 'businessPageContent',
  title: 'Business Page Content',
  type: 'object',
  fields: [
    defineField({name: 'hero', title: 'Hero', type: 'pageHeroContent'}),
    defineField({name: 'positionEyebrow', title: 'Position Eyebrow', type: 'string'}),
    defineField({name: 'positionTitle', title: 'Position Title', type: 'string'}),
    defineField({name: 'positionText', title: 'Position Text', type: 'text', rows: 3}),
    defineField({name: 'positionBanner', title: 'Position Banner', type: 'string'}),
    defineField({name: 'capacity', title: 'Capacity Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
          ],
        }),
      ],
    }),
    defineField({name: 'cta', title: 'CTA', type: 'ctaContent'}),
  ],
})

export const contactPageContent = defineType({
  name: 'contactPageContent',
  title: 'Contact Page Content',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 2}),
    defineField({name: 'intakeForm', title: 'Intake Form', type: 'reference', to: [{type: 'intakeForm'}]}),
  ],
})

export const servicePageContent = defineType({
  name: 'servicePageContent',
  title: 'Service Page Content',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({name: 'backgroundImage', title: 'Hero Background Image', type: 'cmsImage'}),
    defineField({name: 'primaryLabel', title: 'Primary Button Label', type: 'string'}),
    defineField({name: 'primaryLink', title: 'Primary Button Link', type: 'smartLink'}),
    defineField({name: 'secondaryLabel', title: 'Secondary Button Label', type: 'string'}),
    defineField({name: 'secondaryLink', title: 'Secondary Button Link', type: 'smartLink'}),
    defineField({name: 'sections', title: 'Approach Blocks', type: 'array', of: [defineArrayMember({type: 'listBlock'})]}),
    defineField({name: 'processTitle', title: 'Process Title', type: 'string'}),
    defineField({name: 'processText', title: 'Process Text', type: 'text', rows: 3}),
    defineField({name: 'situations', title: 'Situation Blocks', type: 'array', of: [defineArrayMember({type: 'listBlock'})]}),
    defineField({name: 'examples', title: 'Examples', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      description: 'Select FAQs from the FAQ collection.',
    }),
  ],
})

export const homeHeroBlock = defineType({
  name: 'homeHeroBlock',
  title: 'Home Hero Block',
  type: 'object',
  icon: blockPreview('/block-previews/home-hero.png'),
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Content',
      type: 'object',
      fields: [
        defineField({name: 'coverageText', title: 'Coverage Text', type: 'text', rows: 2}),
        defineField({name: 'backgroundImage', title: 'Background Image (poster / fallback)', type: 'cmsImage'}),
        defineField({
          name: 'backgroundVideo',
          title: 'Background Video (mp4, optioneel, overschrijft de standaardvideo)',
          type: 'file',
          options: {accept: 'video/mp4'},
        }),
        defineField({name: 'backgroundVideoCaption', title: 'Video Caption (bijv. "Totaalrenovatie · opgeleverd 2026")', type: 'string'}),
        defineField({name: 'headlineTop', title: 'Headline Top', type: 'string'}),
        defineField({name: 'headlineHighlight', title: 'Headline Highlight', type: 'string'}),
        defineField({name: 'headlineBottom', title: 'Headline Bottom', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'trustItems', title: 'Trust Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
        defineField({name: 'note', title: 'Handwritten Note', type: 'text', rows: 2}),
        defineField({name: 'intakeForm', title: 'Intake Form', type: 'reference', to: [{type: 'intakeForm'}]}),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'value', title: 'Value', type: 'string'}),
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {list: iconOptions.map((value) => ({title: value, value}))},
                }),
                defineField({name: 'rating', title: 'Use Google Rating Badge', type: 'boolean'}),
              ],
            }),
          ],
        }),
        defineField({name: 'processIntro', title: 'Process Intro', type: 'text', rows: 2}),
        defineField({
          name: 'processSteps',
          title: 'Process Steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string'}),
                defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {list: iconOptions.map((value) => ({title: value, value}))},
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.headlineTop'},
    prepare({title}) {
      return {title: title || 'Home Hero Block', media: blockPreview('/block-previews/home-hero.png')}
    },
  },
})

export const pageHeroBlock = defineType({
  name: 'pageHeroBlock',
  title: 'Page Hero Block',
  type: 'object',
  icon: blockPreview('/block-previews/page-hero.png'),
  fields: [defineField({name: 'hero', title: 'Hero Content', type: 'pageHeroContent'})],
  preview: {
    select: {title: 'hero.title'},
    prepare({title}) {
      return {title: title || 'Page Hero Block', media: blockPreview('/block-previews/page-hero.png')}
    },
  },
})

export const splitMetricItem = defineType({
  name: 'splitMetricItem',
  title: 'Metric Item',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'suffix', title: 'Suffix', type: 'string'}),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {value: 'value', suffix: 'suffix', label: 'label'},
    prepare({value, suffix, label}: {value?: string; suffix?: string; label?: string}) {
      return {
        title: [value, suffix].filter(Boolean).join(' ') || 'Metric Item',
        subtitle: label || '',
      }
    },
  },
})

export const editorialPillarItem = defineType({
  name: 'editorialPillarItem',
  title: 'Editorial Pillar Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'text'},
  },
})

export const teamProfileItem = defineType({
  name: 'teamProfileItem',
  title: 'Team Profile Item',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cmsImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'photoCredit', title: 'Photo Credit', type: 'string'}),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatIDo',
      title: 'What I Do',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'why',
      title: 'Why',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'image.image'},
  },
})

export const timelineMilestoneItem = defineType({
  name: 'timelineMilestoneItem',
  title: 'Timeline Milestone Item',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow'},
  },
})

export const assurancePointItem = defineType({
  name: 'assurancePointItem',
  title: 'Assurance Point Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'text'},
  },
})

export const stackedStepsStepItem = defineType({
  name: 'stackedStepsStepItem',
  title: 'Stacked Steps Step Item',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: iconOptions.map((value) => ({title: value, value}))},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stepLabel',
      title: 'Step Label',
      type: 'string',
      description: 'Example: "STEP 01".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'callout',
      title: 'Optional Callout Card',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Callout Title', type: 'string'}),
        defineField({name: 'text', title: 'Callout Text', type: 'text', rows: 4}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'stepLabel'},
  },
})

export const stackedStepsMediaItem = defineType({
  name: 'stackedStepsMediaItem',
  title: 'Stacked Steps Media Item',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cmsImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'caption', media: 'image.image'},
    prepare({title, media}: {title?: string; media?: any}) {
      return {
        title: title || 'Media Row',
        subtitle: 'Full-width image',
        media,
      }
    },
  },
})

export const featureHighlightItem = defineType({
  name: 'featureHighlightItem',
  title: 'Feature Highlight Item',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: iconOptions.map((value) => ({title: value, value}))},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'icon'},
  },
})

export const splitIntroBlock = defineType({
  name: 'splitIntroBlock',
  title: 'Split Intro Block',
  type: 'object',
  icon: blockPreview('/block-previews/split-intro-block.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'titlePrefix',
      title: 'Title Prefix',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'titleHighlight', title: 'Title Highlight', type: 'string'}),
    defineField({name: 'titleSuffix', title: 'Title Suffix', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'primaryButtonLabel', title: 'Primary Button Label', type: 'string'}),
    defineField({name: 'primaryButtonLink', title: 'Primary Button Link', type: 'smartLink'}),
    defineField({name: 'secondaryNotePrefix', title: 'Secondary Note Prefix', type: 'string'}),
    defineField({name: 'secondaryNoteLinkLabel', title: 'Secondary Note Link Label', type: 'string'}),
    defineField({name: 'secondaryNoteLink', title: 'Secondary Note Link', type: 'smartLink'}),
    defineField({name: 'secondaryNoteSuffix', title: 'Secondary Note Suffix', type: 'string'}),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'cmsImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'imageCaption', title: 'Image Caption', type: 'string'}),
    
  ],
  preview: {
    select: {title: 'titlePrefix'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Split Intro Block',
        media: blockPreview('/block-previews/split-intro-block.png'),
      }
    },
  },
})

export const editorialPrinciplesBlock = defineType({
  name: 'editorialPrinciplesBlock',
  title: 'Editorial Principles Block',
  type: 'object',
  icon: blockPreview('/block-previews/editorial-pillar-item.png'),
  fields: [
    defineField({name: 'sectionNumber', title: 'Section Number', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sideIntro',
      title: 'Side Intro',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Lead', value: 'lead'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [defineArrayMember({type: 'editorialPillarItem'})],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
    
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Editorial Principles Block',
        media: blockPreview('/block-previews/editorial-pillar-item.png'),
      }
    },
  },
})

export const metricsBandBlock = defineType({
  name: 'metricsBandBlock',
  title: 'Metrics Band Block',
  type: 'object',
  icon: blockPreview('/block-previews/metrics-band-block.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      validation: (Rule) => Rule.required().min(1).max(4),
      of: [defineArrayMember({type: 'splitMetricItem'})],
    }),
    
  ],
  preview: {
    select: {title: 'eyebrow'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Metrics Band Block',
        media: blockPreview('/block-previews/metrics-band-block.png'),
      }
    },
  },
})

export const problemSolutionBlock = defineType({
  name: 'problemSolutionBlock',
  title: 'Problem / Solution Block',
  type: 'object',
  icon: blockPreview('/block-previews/problem-solution.png'),
  fields: [
    defineField({name: 'problemEyebrow', title: 'Problem Eyebrow', type: 'string'}),
    defineField({name: 'problemTitle', title: 'Problem Title', type: 'string'}),
    defineField({name: 'problems', title: 'Problems', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'solutionEyebrow', title: 'Solution Eyebrow', type: 'string'}),
    defineField({name: 'solutionTitle', title: 'Solution Title', type: 'string'}),
    defineField({name: 'solutions', title: 'Solutions', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'solutionNote', title: 'Solution Note', type: 'text', rows: 2}),
    defineField({name: 'bannerTitle', title: 'Banner Title', type: 'string'}),
    defineField({name: 'bannerButtonLabel', title: 'Banner Button Label', type: 'string'}),
    defineField({name: 'bannerButtonLink', title: 'Banner Button Link', type: 'smartLink'}),
  ],
  preview: {
    select: {title: 'problemTitle'},
    prepare({title}) {
      return {title: title || 'Problem / Solution Block', media: blockPreview('/block-previews/problem-solution.png')}
    },
  },
})

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  icon: blockPreview('/block-previews/text-block.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Text Block', media: blockPreview('/block-previews/text-block.png')}
    },
  },
})

export const servicesListingBlock = defineType({
  name: 'servicesListingBlock',
  title: 'Services Listing Block',
  type: 'object',
  icon: blockPreview('/block-previews/services-listing.png'),
  fields: [
    defineField({name: 'limit', title: 'Number of Services', type: 'number'}),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Default (white background)', value: 'default'},
          {title: 'Full grid (soft background)', value: 'fullGrid'},
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Services Listing Block', media: blockPreview('/block-previews/services-listing.png')}
    },
  },
})

export const projectsListingBlock = defineType({
  name: 'projectsListingBlock',
  title: 'Projects Listing Block',
  type: 'object',
  icon: blockPreview('/block-previews/projects-listing.png'),
  fields: [
    defineField({name: 'limit', title: 'Number of Projects', type: 'number'}),
  ],
  preview: {
    prepare() {
      return {title: 'Projects Listing Block', media: blockPreview('/block-previews/projects-listing.png')}
    },
  },
})

export const featuredServicesBlock = defineType({
  name: 'featuredServicesBlock',
  title: 'Featured Services Block',
  type: 'object',
  icon: blockPreview('/block-previews/featured-services.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Diensten'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'viewAllLabel', title: 'View All Button Label', type: 'string', initialValue: 'Alle diensten'}),
    defineField({name: 'viewAllLink', title: 'View All Button Link', type: 'smartLink'}),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      description: 'Pick the services to display in this block.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Featured Services Block', media: blockPreview('/block-previews/featured-services.png')}
    },
  },
})

export const featuredProjectsBlock = defineType({
  name: 'featuredProjectsBlock',
  title: 'Featured Projects Block',
  type: 'object',
  icon: blockPreview('/block-previews/featured-projects.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Projecten'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'viewAllLabel', title: 'View All Button Label', type: 'string', initialValue: 'Alle projecten'}),
    defineField({name: 'viewAllLink', title: 'View All Button Link', type: 'smartLink'}),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      description: 'Pick the projects to display in this block.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Featured Projects Block', media: blockPreview('/block-previews/featured-projects.png')}
    },
  },
})

export const iconCardsBlock = defineType({
  name: 'iconCardsBlock',
  title: 'Icon Cards Block',
  type: 'object',
  icon: blockPreview('/block-previews/icon-cards.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
    defineField({name: 'buttonLink', title: 'Button Link', type: 'smartLink'}),
    defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Icon Cards Block', media: blockPreview('/block-previews/icon-cards.png')}
    },
  },
})

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA Banner Block',
  type: 'object',
  icon: blockPreview('/block-previews/cta-banner-block.png'),
  fields: [defineField({name: 'cta', title: 'CTA Content', type: 'ctaContent'})],
  preview: {
    prepare() {
      return {title: 'CTA Banner Block', media: blockPreview('/block-previews/cta-banner-block.png')}
    },
  },
})

export const contactFormBlock = defineType({
  name: 'contactFormBlock',
  title: 'Contact Form Block',
  type: 'object',
  icon: blockPreview('/block-previews/contact-form.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 3}),
    defineField({name: 'intakeForm', title: 'Intake Form', type: 'reference', to: [{type: 'intakeForm'}]}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Contact Form Block', media: blockPreview('/block-previews/contact-form.png')}
    },
  },
})

export const partnersBlock = defineType({
  name: 'partnersBlock',
  title: 'Partners Block',
  type: 'object',
  icon: blockPreview('/block-previews/partners.png'),
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Partners',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Vaste partners voor materiaal, sanitair en keukens.',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      initialValue:
        'Wij werken met herkenbare leveranciers zodat keuzes, levertijden en kwaliteit beter te controleren zijn.',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Partners Block',
        subtitle: 'Partner logos from Website Content → Partners',
        media: blockPreview('/block-previews/partners.png'),
      }
    },
  },
})

export const logoCardGridBlock = defineType({
  name: 'logoCardGridBlock',
  title: 'Logo Card Grid Block',
  type: 'object',
  icon: blockPreview('/block-previews/logo-card-grid-block.png'),
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Partners',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partners',
      title: 'Partner Cards',
      type: 'array',
      description:
        'Select the partner entries to show in this grid, in display order. Add up to 6 for a 3-by-2 layout.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'partner'}]})],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'title', partners: 'partners'},
    prepare({title, partners}: {title?: string; partners?: Array<unknown>}) {
      const count = Array.isArray(partners) ? partners.length : 0
      return {
        title: title || 'Logo Card Grid Block',
        subtitle: count ? `${count} partner card${count === 1 ? '' : 's'}` : 'No partner cards yet',
        media: blockPreview('/block-previews/logo-card-grid-block.png'),
      }
    },
  },
})

export const googleReviewsBlock = defineType({
  name: 'googleReviewsBlock',
  title: 'Google Reviews Block',
  type: 'object',
  icon: blockPreview('/block-previews/google-reviews.png'),
  fields: [
    defineField({name: 'limit', title: 'Number of Reviews', type: 'number', initialValue: 4}),
    defineField({name: 'compact', title: 'Compact Layout', type: 'boolean', initialValue: true}),
  ],
  preview: {
    prepare() {
      return {title: 'Google Reviews Block', media: blockPreview('/block-previews/google-reviews.png')}
    },
  },
})

export const reviewShowcaseBlock = defineType({
  name: 'reviewShowcaseBlock',
  title: 'Review Showcase Block',
  type: 'object',
  icon: blockPreview('/block-previews/review-showcase-content.png'),
  fields: [
    defineField({name: 'sectionNumber', title: 'Section Number', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ratingValue',
      title: 'Rating Value',
      type: 'number',
      initialValue: 4.8,
      validation: (Rule) => Rule.required().min(0).max(5),
    }),
    defineField({
      name: 'reviewsSummary',
      title: 'Reviews Summary',
      type: 'string',
      initialValue: 'average from 273 reviews',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'ctaLabel', title: 'CTA Label', type: 'string'}),
    defineField({name: 'ctaLink', title: 'CTA Link', type: 'smartLink'}),
    defineField({
      name: 'selectedReviews',
      title: 'Selected Reviews',
      type: 'array',
      description: 'Choose the reviews to display in this layout.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'review'}]})],
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'reviewsSummary'},
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {
        title: title || 'Review Showcase Block',
        subtitle,
        media: blockPreview('/block-previews/review-showcase-content.png'),
      }
    },
  },
})

export const aboutIntroBlock = defineType({
  name: 'aboutIntroBlock',
  title: 'About Intro Block',
  type: 'object',
  icon: blockPreview('/block-previews/about-intro.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({name: 'sketchLabels', title: 'Sketch Labels', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (Rule) => Rule.max(3)}),
    defineField({name: 'sketchClosing', title: 'Sketch Closing', type: 'text', rows: 2}),
    defineField({name: 'introItems', title: 'Intro Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'About Intro Block', media: blockPreview('/block-previews/about-intro.png')}
    },
  },
})

export const aboutTeamBlock = defineType({
  name: 'aboutTeamBlock',
  title: 'About Team Block',
  type: 'object',
  icon: blockPreview('/block-previews/about-team.png'),
  fields: [
    defineField({name: 'teamEyebrow', title: 'Team Eyebrow', type: 'string'}),
    defineField({name: 'teamTitle', title: 'Team Title', type: 'string'}),
    defineField({
      name: 'coreTeam',
      title: 'Core Team',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({name: 'image', title: 'Image', type: 'cmsImage'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
          ],
        }),
      ],
    }),
    defineField({name: 'teamBanner', title: 'Team Banner', type: 'string'}),
  ],
  preview: {
    select: {title: 'teamTitle'},
    prepare({title}) {
      return {title: title || 'About Team Block', media: blockPreview('/block-previews/about-team.png')}
    },
  },
})

export const aboutTeamImageBlock = defineType({
  name: 'aboutTeamImageBlock',
  title: 'About Team Image Block',
  type: 'object',
  icon: blockPreview('/block-previews/about-team-image.png'),
  fields: [
    defineField({name: 'teamImageEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'teamImageTitle', title: 'Title', type: 'string'}),
    defineField({name: 'teamImage', title: 'Team Image', type: 'cmsImage'}),
  ],
  preview: {
    select: {title: 'teamImageTitle'},
    prepare({title}) {
      return {title: title || 'About Team Image Block', media: blockPreview('/block-previews/about-team-image.png')}
    },
  },
})

export const teamProfilesShowcaseBlock = defineType({
  name: 'teamProfilesShowcaseBlock',
  title: 'Team Profiles Showcase Block',
  type: 'object',
  icon: blockPreview('/block-previews/team-profiles-showcase-block.png'),
  fields: [
    defineField({name: 'sectionNumber', title: 'Section Number', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profiles',
      title: 'Profiles',
      type: 'array',
      of: [defineArrayMember({type: 'teamProfileItem'})],
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: 'teamImage',
      title: 'Team Image',
      type: 'cmsImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'teamImageCredit', title: 'Team Image Credit', type: 'string'}),
    defineField({
      name: 'closingText',
      title: 'Closing Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Team Profiles Showcase Block',
        media: blockPreview('/block-previews/team-profiles-showcase-block.png'),
      }
    },
  },
})

export const visitInvitationBlock = defineType({
  name: 'visitInvitationBlock',
  title: 'Visit Invitation Block',
  type: 'object',
  icon: blockPreview('/block-previews/visit-invitation-block.png'),
  fields: [
    defineField({name: 'sectionNumber', title: 'Section Number', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'primaryButtonLabel', title: 'Primary Button Label', type: 'string'}),
    defineField({name: 'primaryButtonLink', title: 'Primary Button Link', type: 'smartLink'}),
    defineField({
      name: 'secondaryNote',
      title: 'Secondary Note',
      type: 'string',
      description: 'Inline note shown next to the primary button.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cmsImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'imageCaption', title: 'Image Caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Visit Invitation Block',
        media: blockPreview('/block-previews/visit-invitation-block.png'),
      }
    },
  },
})

export const splitTimelineBlock = defineType({
  name: 'splitTimelineBlock',
  title: 'Split Timeline Block',
  type: 'object',
  icon: blockPreview('/block-previews/split-timeline-block.png'),
  fields: [
    defineField({name: 'sectionNumber', title: 'Section Number', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlightLabel',
      title: 'Highlight Label',
      type: 'string',
      description: 'Short rounded label shown beneath the intro copy.',
    }),
    defineField({
      name: 'milestones',
      title: 'Timeline Milestones',
      type: 'array',
      of: [defineArrayMember({type: 'timelineMilestoneItem'})],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({
      name: 'assurancePoints',
      title: 'Assurance Points',
      type: 'array',
      of: [defineArrayMember({type: 'assurancePointItem'})],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Split Timeline Block',
        media: blockPreview('/block-previews/split-timeline-block.png'),
      }
    },
  },
})

export const faqAnswersGridBlock = defineType({
  name: 'faqAnswersGridBlock',
  title: 'FAQ Answers Grid Block',
  type: 'object',
  icon: blockPreview('/block-previews/faq-answers-grid-block.png'),
  fields: [
    defineField({name: 'sectionNumber', title: 'Section Number', type: 'string'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      description: 'Select FAQ entries from the FAQ collection in the order they should appear.',
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'FAQ Answers Grid Block',
        media: blockPreview('/block-previews/faq-answers-grid-block.png'),
      }
    },
  },
})

export const projectsShowcaseGridBlock = defineType({
  name: 'projectsShowcaseGridBlock',
  title: 'Projects Showcase Grid Block',
  type: 'object',
  icon: blockPreview('/block-previews/featured-projects-block.png'),
  fields: [
    defineField({
      name: 'sectionNumber',
      title: 'Section Number',
      type: 'string',
      description: 'Example: "07".',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Example: "Recent Work".',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Large left-column headline.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'Short right-column supporting copy.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      description: 'Curated project cards shown in the large 3-column showcase grid.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Projects Showcase Grid Block',
        media: blockPreview('/block-previews/featured-projects-block.png'),
      }
    },
  },
})

export const stackedStepsListBlock = defineType({
  name: 'stackedStepsListBlock',
  title: 'Stacked Steps List Block',
  type: 'object',
  icon: blockPreview('/block-previews/stacked-steps-list-block.png'),
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({type: 'stackedStepsStepItem'}),
        defineArrayMember({type: 'stackedStepsMediaItem'}),
      ],
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
    
  ],
  preview: {
    select: {title: 'items.0.title', items: 'items'},
    prepare({title, items}: {title?: string; items?: Array<unknown>}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Stacked Steps List Block',
        subtitle: count ? `${count} item${count === 1 ? '' : 's'}` : 'No items yet',
        media: blockPreview('/block-previews/stacked-steps-list-block.png'),
      }
    },
  },
})

export const splitFeatureListBlock = defineType({
  name: 'splitFeatureListBlock',
  title: 'Split Feature List Block',
  type: 'object',
  icon: blockPreview('/block-previews/split-feature-list-block.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cmsImage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'imageCaption', title: 'Image Caption', type: 'string'}),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({type: 'featureHighlightItem'})],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Split Feature List Block',
        media: blockPreview('/block-previews/split-feature-list-block.png'),
      }
    },
  },
})

export const darkAssuranceGridBlock = defineType({
  name: 'darkAssuranceGridBlock',
  title: 'Dark Assurance Grid Block',
  type: 'object',
  icon: blockPreview('/block-previews/dark-assurance-grid-block.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title (zet *cursief gedeelte* tussen sterretjes voor de italic stijl)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'intro', title: 'Intro (optioneel, naast de titel)', type: 'text', rows: 2}),
    defineField({
      name: 'items',
      title: 'Assurance Items',
      type: 'array',
      of: [defineArrayMember({type: 'assurancePointItem'})],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({name: 'footerNote', title: 'Footer note (optioneel)', type: 'string'}),
    defineField({name: 'footerButtonLabel', title: 'Footer button label (optioneel)', type: 'string'}),
    defineField({name: 'footerButtonLink', title: 'Footer button link (optioneel)', type: 'smartLink'}),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}: {title?: string; items?: Array<unknown>}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Dark Assurance Grid Block',
        subtitle: count ? `${count} item${count === 1 ? '' : 's'}` : 'No items yet',
        media: blockPreview('/block-previews/dark-assurance-grid-block.png'),
      }
    },
  },
})

export const centeredActionBannerBlock = defineType({
  name: 'centeredActionBannerBlock',
  title: 'Centered Action Banner Block',
  type: 'object',
  icon: blockPreview('/block-previews/cta-banner-block.png'),
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonLabel',
      title: 'Primary Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonLink',
      title: 'Primary Button Link',
      type: 'smartLink',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryButtonLabel',
      title: 'Secondary Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link',
      type: 'smartLink',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Centered Action Banner Block',
        media: blockPreview('/block-previews/cta-banner-block.png'),
      }
    },
  },
})

export const processBlock = defineType({
  name: 'processBlock',
  title: 'Process Block',
  type: 'object',
  icon: blockPreview('/block-previews/process-block.png'),
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'titlePrefix', title: 'Title Prefix', type: 'string'}),
    defineField({name: 'titleHighlight', title: 'Title Highlight', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 2}),
    defineField({name: 'note', title: 'Note Card', type: 'text', rows: 3}),
    defineField({name: 'sideNote', title: 'Side Note', type: 'text', rows: 2}),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
            defineField({name: 'note', title: 'Note', type: 'string'}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: iconOptions.map((value) => ({title: value, value}))},
            }),
          ],
        }),
      ],
    }),
    defineField({name: 'benefits', title: 'Benefits Bar', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
    defineField({name: 'trustPoints', title: 'Trust Points', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
  ],
  preview: {
    select: {title: 'titlePrefix'},
    prepare({title}) {
      return {title: title || 'Process Block', media: blockPreview('/block-previews/process-header.png')}
    },
  },
})

export const processFaqBlock = defineType({
  name: 'processFaqBlock',
  title: 'Process FAQ Block',
  type: 'object',
  icon: blockPreview('/block-previews/process-faq.png'),
  fields: [
    defineField({name: 'faqEyebrow', title: 'FAQ Eyebrow', type: 'string'}),
    defineField({name: 'faqTitle', title: 'FAQ Title', type: 'string'}),
    defineField({name: 'faqIntro', title: 'FAQ Intro', type: 'text', rows: 3}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      description: 'Select FAQs from the FAQ collection.',
    }),
  ],
  preview: {
    select: {title: 'faqTitle'},
    prepare({title}) {
      return {title: title || 'Process FAQ Block', media: blockPreview('/block-previews/process-faq.png')}
    },
  },
})

export const processIntakeBannerBlock = defineType({
  name: 'processIntakeBannerBlock',
  title: 'Process Intake Banner Block',
  type: 'object',
  icon: blockPreview('/block-previews/process-intake-banner.png'),
  fields: [
    defineField({name: 'intakeBannerTitle', title: 'Banner Title', type: 'string'}),
    defineField({name: 'intakeBannerText', title: 'Banner Text', type: 'text', rows: 2}),
    defineField({name: 'buttonLabel', title: 'Button Label', type: 'string', initialValue: 'Start intake'}),
    defineField({name: 'buttonLink', title: 'Button Link', type: 'smartLink'}),
  ],
  preview: {
    select: {title: 'intakeBannerTitle'},
    prepare({title}) {
      return {title: title || 'Process Intake Banner Block', media: blockPreview('/block-previews/process-intake-banner.png')}
    },
  },
})

export const businessContentBlock = defineType({
  name: 'businessContentBlock',
  title: 'Business Content Block',
  type: 'object',
  icon: blockPreview('/block-previews/business-content.png'),
  fields: [
    defineField({name: 'positionEyebrow', title: 'Position Eyebrow', type: 'string'}),
    defineField({name: 'positionTitle', title: 'Position Title', type: 'string'}),
    defineField({name: 'positionText', title: 'Position Text', type: 'text', rows: 3}),
    defineField({name: 'positionBanner', title: 'Position Banner', type: 'string'}),
    defineField({name: 'capacity', title: 'Capacity Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'positionTitle'},
    prepare({title}) {
      return {title: title || 'Business Content Block', media: blockPreview('/block-previews/business-content.png')}
    },
  },
})

export const videoChecklistBlock = defineType({
  name: 'videoChecklistBlock',
  title: 'Video Checklist Block',
  type: 'object',
  icon: blockPreview('/block-previews/video-checklist.jpeg'),
  fields: [
    defineField({
      name: 'lists',
      title: 'Checklists',
      type: 'array',
      validation: (Rule) => Rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: iconOptions.map((value) => ({title: value, value}))},
            }),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'icon'},
          },
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description: 'Paste the full YouTube link, e.g. https://www.youtube.com/watch?v=...',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'videoCaption', title: 'Video Caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'videoCaption'},
    prepare({title}) {
      return {title: title || 'Video Checklist Block', media: blockPreview('/block-previews/video-checklist.jpeg')}
    },
  },
})

// Bijlage bij een aanvraag (foto of document), geüpload via de server-side
// /api/upload-attachment route. image/file zijn Sanity's eigen veldtypes,
// zodat de Studio er gratis thumbnails resp. een downloadbare bestandskaart
// voor rendert, zonder dat wij dat zelf hoeven te bouwen.
export const attachmentItem = defineType({
  name: 'attachmentItem',
  title: 'Bijlage',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Soort',
      type: 'string',
      options: {list: ['image', 'file']},
      readOnly: true,
    }),
    defineField({name: 'originalFilename', title: 'Oorspronkelijke bestandsnaam', type: 'string', readOnly: true}),
    defineField({name: 'image', title: 'Afbeelding', type: 'image', readOnly: true}),
    defineField({name: 'file', title: 'Bestand', type: 'file', readOnly: true}),
  ],
  preview: {
    select: {title: 'originalFilename', kind: 'kind', media: 'image'},
    prepare({title, kind, media}) {
      return {title: title || 'Bijlage', subtitle: kind === 'image' ? 'Afbeelding' : 'Document', media}
    },
  },
})

export const objectSchemaTypes = [
  cmsImage,
  seoSettings,
  organizationSeo,
  linkItem,
  attachmentItem,
  smartLink,
  megaMenuLink,
  megaMenuColumn,
  headerMenuItem,
  headerButton,
  iconText,
  ctaContent,
  pageHeroContent,
  listBlock,
  faqItem,
  faqRichItem,
  splitMetricItem,
  editorialPillarItem,
  teamProfileItem,
  timelineMilestoneItem,
  assurancePointItem,
  stackedStepsStepItem,
  stackedStepsMediaItem,
  featureHighlightItem,
  homePageContent,
  listingPageContent,
  aboutPageContent,
  processPageContent,
  businessPageContent,
  contactPageContent,
  servicePageContent,
  homeHeroBlock,
  pageHeroBlock,
  splitIntroBlock,
  editorialPrinciplesBlock,
  metricsBandBlock,
  problemSolutionBlock,
  textBlock,
  servicesListingBlock,
  projectsListingBlock,
  featuredServicesBlock,
  featuredProjectsBlock,
  iconCardsBlock,
  ctaBannerBlock,
  contactFormBlock,
  partnersBlock,
  logoCardGridBlock,
  googleReviewsBlock,
  reviewShowcaseBlock,
  aboutIntroBlock,
  aboutTeamBlock,
  aboutTeamImageBlock,
  teamProfilesShowcaseBlock,
  visitInvitationBlock,
  splitTimelineBlock,
  faqAnswersGridBlock,
  projectsShowcaseGridBlock,
  stackedStepsListBlock,
  splitFeatureListBlock,
  darkAssuranceGridBlock,
  centeredActionBannerBlock,
  processBlock,
  processFaqBlock,
  processIntakeBannerBlock,
  businessContentBlock,
  videoChecklistBlock,
]
