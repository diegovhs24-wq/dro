import {defineArrayMember, defineField, defineType} from 'sanity'

const iconOptions = [
  'bathroom',
  'renovation',
  'extension',
  'newbuild',
  'floorHeating',
  'heatPump',
  'solar',
  'paint',
  'maintenance',
  'planning',
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
    defineField({name: 'legalName', title: 'Legal Name', type: 'string'}),
    defineField({name: 'siteUrl', title: 'Site URL Override', type: 'url'}),
    defineField({name: 'logo', title: 'Logo', type: 'cmsImage'}),
    defineField({name: 'telephone', title: 'Telephone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
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
    defineField({name: 'priceRange', title: 'Price Range', type: 'string', initialValue: '$$'}),
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

export const serviceMenuGroup = defineType({
  name: 'serviceMenuGroup',
  title: 'Service Menu Group',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slugs',
      title: 'Service Slugs',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Use service slugs to control which services appear in this group.',
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const iconText = defineType({
  name: 'iconText',
  title: 'Icon Text',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
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
    defineField({name: 'primaryLabel', title: 'Primary Button Label', type: 'string'}),
    defineField({name: 'primaryHref', title: 'Primary Button URL', type: 'string'}),
    defineField({name: 'secondaryLabel', title: 'Secondary Button Label', type: 'string'}),
    defineField({name: 'secondaryHref', title: 'Secondary Button URL', type: 'string'}),
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
    defineField({name: 'primaryHref', title: 'Primary Button URL', type: 'string'}),
    defineField({name: 'secondaryLabel', title: 'Secondary Button Label', type: 'string'}),
    defineField({name: 'secondaryHref', title: 'Secondary Button URL', type: 'string'}),
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
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 3}),
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
      title: 'Answer Paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
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
        defineField({name: 'formTitle', title: 'Form Title', type: 'string'}),
        defineField({name: 'formTimeLabel', title: 'Form Time Label', type: 'string'}),
        defineField({name: 'formText', title: 'Form Text', type: 'text', rows: 2}),
        defineField({name: 'formPrivacyText', title: 'Form Privacy Text', type: 'text', rows: 2}),
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
    defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [defineArrayMember({type: 'faqRichItem'})]}),
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
    defineField({name: 'sections', title: 'Approach Blocks', type: 'array', of: [defineArrayMember({type: 'listBlock'})]}),
    defineField({name: 'processTitle', title: 'Process Title', type: 'string'}),
    defineField({name: 'processText', title: 'Process Text', type: 'text', rows: 3}),
    defineField({name: 'situations', title: 'Situation Blocks', type: 'array', of: [defineArrayMember({type: 'listBlock'})]}),
    defineField({name: 'examples', title: 'Examples', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [defineArrayMember({type: 'faqItem'})]}),
  ],
})

export const homeHeroBlock = defineType({
  name: 'homeHeroBlock',
  title: 'Home Hero Block',
  type: 'object',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Content',
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
        defineField({name: 'formTitle', title: 'Form Title', type: 'string'}),
        defineField({name: 'formTimeLabel', title: 'Form Time Label', type: 'string'}),
        defineField({name: 'formText', title: 'Form Text', type: 'text', rows: 2}),
        defineField({name: 'formPrivacyText', title: 'Form Privacy Text', type: 'text', rows: 2}),
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
      return {title: title || 'Home Hero Block'}
    },
  },
})

export const pageHeroBlock = defineType({
  name: 'pageHeroBlock',
  title: 'Page Hero Block',
  type: 'object',
  fields: [defineField({name: 'hero', title: 'Hero Content', type: 'pageHeroContent'})],
  preview: {
    select: {title: 'hero.title'},
    prepare({title}) {
      return {title: title || 'Page Hero Block'}
    },
  },
})

export const problemSolutionBlock = defineType({
  name: 'problemSolutionBlock',
  title: 'Problem / Solution Block',
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
  preview: {
    select: {title: 'problemTitle'},
    prepare({title}) {
      return {title: title || 'Problem / Solution Block'}
    },
  },
})

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 5}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Text Block'}
    },
  },
})

export const servicesListingBlock = defineType({
  name: 'servicesListingBlock',
  title: 'Services Listing Block',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'linkLabel', title: 'Link Label', type: 'string'}),
    defineField({name: 'linkHref', title: 'Link URL', type: 'string'}),
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
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Services Listing Block'}
    },
  },
})

export const projectsListingBlock = defineType({
  name: 'projectsListingBlock',
  title: 'Projects Listing Block',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'limit', title: 'Number of Projects', type: 'number'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Projects Listing Block'}
    },
  },
})

export const iconCardsBlock = defineType({
  name: 'iconCardsBlock',
  title: 'Icon Cards Block',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
    defineField({name: 'buttonHref', title: 'Button URL', type: 'string'}),
    defineField({name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({type: 'iconText'})]}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Icon Cards Block'}
    },
  },
})

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA Banner Block',
  type: 'object',
  fields: [defineField({name: 'cta', title: 'CTA Content', type: 'ctaContent'})],
  preview: {
    prepare() {
      return {title: 'CTA Banner Block'}
    },
  },
})

export const contactFormBlock = defineType({
  name: 'contactFormBlock',
  title: 'Contact Form Block',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 3}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Contact Form Block'}
    },
  },
})

export const partnersBlock = defineType({
  name: 'partnersBlock',
  title: 'Partners Block',
  type: 'object',
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
      }
    },
  },
})

export const googleReviewsBlock = defineType({
  name: 'googleReviewsBlock',
  title: 'Google Reviews Block',
  type: 'object',
  fields: [
    defineField({name: 'limit', title: 'Number of Reviews', type: 'number', initialValue: 4}),
    defineField({name: 'compact', title: 'Compact Layout', type: 'boolean', initialValue: true}),
  ],
  preview: {
    prepare() {
      return {title: 'Google Reviews Block'}
    },
  },
})

export const aboutIntroBlock = defineType({
  name: 'aboutIntroBlock',
  title: 'About Intro Block',
  type: 'object',
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
      return {title: title || 'About Intro Block'}
    },
  },
})

export const aboutTeamBlock = defineType({
  name: 'aboutTeamBlock',
  title: 'About Team Block',
  type: 'object',
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
      return {title: title || 'About Team Block'}
    },
  },
})

export const aboutTeamImageBlock = defineType({
  name: 'aboutTeamImageBlock',
  title: 'About Team Image Block',
  type: 'object',
  fields: [
    defineField({name: 'teamImageEyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'teamImageTitle', title: 'Title', type: 'string'}),
    defineField({name: 'teamImage', title: 'Team Image', type: 'cmsImage'}),
  ],
  preview: {
    select: {title: 'teamImageTitle'},
    prepare({title}) {
      return {title: title || 'About Team Image Block'}
    },
  },
})

export const processHeaderBlock = defineType({
  name: 'processHeaderBlock',
  title: 'Process Header Block',
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
  ],
  preview: {
    select: {title: 'titlePrefix'},
    prepare({title}) {
      return {title: title || 'Process Header Block'}
    },
  },
})

export const processBenefitsBlock = defineType({
  name: 'processBenefitsBlock',
  title: 'Process Benefits Block',
  type: 'object',
  fields: [defineField({name: 'benefits', title: 'Benefits', type: 'array', of: [defineArrayMember({type: 'iconText'})]})],
  preview: {
    prepare() {
      return {title: 'Process Benefits Block'}
    },
  },
})

export const processTrustBlock = defineType({
  name: 'processTrustBlock',
  title: 'Process Trust Block',
  type: 'object',
  fields: [defineField({name: 'trustPoints', title: 'Trust Points', type: 'array', of: [defineArrayMember({type: 'iconText'})]})],
  preview: {
    prepare() {
      return {title: 'Process Trust Block'}
    },
  },
})

export const processFaqBlock = defineType({
  name: 'processFaqBlock',
  title: 'Process FAQ Block',
  type: 'object',
  fields: [
    defineField({name: 'faqEyebrow', title: 'FAQ Eyebrow', type: 'string'}),
    defineField({name: 'faqTitle', title: 'FAQ Title', type: 'string'}),
    defineField({name: 'faqIntro', title: 'FAQ Intro', type: 'text', rows: 3}),
    defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [defineArrayMember({type: 'faqRichItem'})]}),
  ],
  preview: {
    select: {title: 'faqTitle'},
    prepare({title}) {
      return {title: title || 'Process FAQ Block'}
    },
  },
})

export const processIntakeBannerBlock = defineType({
  name: 'processIntakeBannerBlock',
  title: 'Process Intake Banner Block',
  type: 'object',
  fields: [
    defineField({name: 'intakeBannerTitle', title: 'Banner Title', type: 'string'}),
    defineField({name: 'intakeBannerText', title: 'Banner Text', type: 'text', rows: 2}),
    defineField({name: 'buttonLabel', title: 'Button Label', type: 'string', initialValue: 'Start intake'}),
    defineField({name: 'buttonHref', title: 'Button URL', type: 'string', initialValue: '/contact'}),
  ],
  preview: {
    select: {title: 'intakeBannerTitle'},
    prepare({title}) {
      return {title: title || 'Process Intake Banner Block'}
    },
  },
})

export const businessContentBlock = defineType({
  name: 'businessContentBlock',
  title: 'Business Content Block',
  type: 'object',
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
      return {title: title || 'Business Content Block'}
    },
  },
})

export const objectSchemaTypes = [
  cmsImage,
  seoSettings,
  organizationSeo,
  linkItem,
  serviceMenuGroup,
  iconText,
  ctaContent,
  pageHeroContent,
  listBlock,
  faqItem,
  faqRichItem,
  homePageContent,
  listingPageContent,
  aboutPageContent,
  processPageContent,
  businessPageContent,
  contactPageContent,
  servicePageContent,
  homeHeroBlock,
  pageHeroBlock,
  problemSolutionBlock,
  textBlock,
  servicesListingBlock,
  projectsListingBlock,
  iconCardsBlock,
  ctaBannerBlock,
  contactFormBlock,
  partnersBlock,
  googleReviewsBlock,
  aboutIntroBlock,
  aboutTeamBlock,
  aboutTeamImageBlock,
  processHeaderBlock,
  processBenefitsBlock,
  processTrustBlock,
  processFaqBlock,
  processIntakeBannerBlock,
  businessContentBlock,
]
