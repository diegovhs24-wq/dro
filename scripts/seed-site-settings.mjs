import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] ??= rest.join('=').trim()
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lxi5ttc2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function main() {
  const existing = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
  const docId = existing?._id?.replace(/^drafts\./, '') || 'siteSettings'

  const patch = client.patch(docId).setIfMissing({
    _type: 'siteSettings',
    title: 'DRO Renovaties',
    footer: {},
    footerCta: {},
  }).set({
    title: 'DRO Renovaties',
    headerMenu: [
      {
        _type: 'headerMenuItem', _key: 'menu-services',
        label: 'Services',
        type: 'megaMenu',
        columns: [
          {
            _type: 'megaMenuColumn', _key: 'col-residential',
            title: 'Residential',
            links: [
              {_type: 'megaMenuLink', _key: 'lnk-bathroom', label: 'Bathroom renovation', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/badkamer-renovatie'}},
              {_type: 'megaMenuLink', _key: 'lnk-total', label: 'Total renovation', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/totaalrenovatie'}},
              {_type: 'megaMenuLink', _key: 'lnk-extension', label: 'Extension / addition', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/uitbouw-aanbouw'}},
              {_type: 'megaMenuLink', _key: 'lnk-newbuild', label: 'Finishing new build', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/afbouw-nieuwbouw'}},
            ],
          },
          {
            _type: 'megaMenuColumn', _key: 'col-installations',
            title: 'Installations',
            links: [
              {_type: 'megaMenuLink', _key: 'lnk-floor', label: 'Underfloor heating', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/vloerverwarming'}},
              {_type: 'megaMenuLink', _key: 'lnk-heatpump', label: 'Heat pump', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/warmtepomp'}},
              {_type: 'megaMenuLink', _key: 'lnk-solar', label: 'Solar panels', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/zonnepanelen'}},
            ],
          },
          {
            _type: 'megaMenuColumn', _key: 'col-finishing',
            title: 'Finishing',
            links: [
              {_type: 'megaMenuLink', _key: 'lnk-plaster', label: 'Plastering and painting', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/stuc-schilderwerk'}},
              {_type: 'megaMenuLink', _key: 'lnk-maintenance', label: 'Maintenance', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/diensten/onderhoud'}},
            ],
          },
        ],
        promo: {},
      },
      {_type: 'headerMenuItem', _key: 'menu-projects', label: 'Projects', type: 'link', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/projecten'}},
      {_type: 'headerMenuItem', _key: 'menu-about', label: 'About us', type: 'link', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/over-ons'}},
      {_type: 'headerMenuItem', _key: 'menu-process', label: 'Process', type: 'link', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/werkwijze'}},
      {_type: 'headerMenuItem', _key: 'menu-business', label: 'Commercial', type: 'link', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/zakelijk'}},
      {_type: 'headerMenuItem', _key: 'menu-contact', label: 'Contact', type: 'link', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/contact'}},
    ],
    headerButtons: [
      {_type: 'headerButton', _key: 'hbtn-intake', label: 'Start intake', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/contact'}, variant: 'primary'},
      {_type: 'headerButton', _key: 'hbtn-call', label: 'Call immediately', link: {_type: 'smartLink', linkType: 'external', externalUrl: 'tel:+31850871814'}, variant: 'outlined'},
    ],
    floatingActions: {
      whatsappLabel: 'WhatsApp',
      whatsappHref: 'https://wa.me/31850871814',
      intakeLabel: 'Start intake',
      intakeHref: '/contact',
    },
    footer: {
      brand: {
        brandTitle: 'DRO Renovations',
        description:
          'Your partner for complete renovation and finishing projects. We combine craftsmanship with structure for private and commercial clients.',
      },
      contact: {
        contactTitle: 'Contact',
        contactAddress: 'The Hague and surroundings · Randstad',
        contactPhone: '+31 85 087 1814',
        contactPhoneHref: 'tel:+31850871814',
        contactPhoneNote: '(also via WhatsApp)',
        contactEmail: 'info@drobouwgroep.nl',
        contactEmailHref: 'mailto:info@drobouwgroep.nl',
      },
      services: {
        servicesTitle: 'Services',
      },
      commercial: {
        businessTitle: 'Commercial',
        businessText:
          'For real estate parties, developers, and contractors, we provide:',
        businessItems: [
          'Project-based renovations',
          'Serial finishing',
          'Renovation homes',
          'Execution to scale',
        ],
        businessClosing:
          'Implementation partner with capacity and continuity.\n\nOne party. Full execution. Full control.',
      },
      bottom: {
        statement: 'DRO Construction and Contracting Company',
        copyright: '© DRO Renovations',
        legalLinks: [
          {_type: 'linkItem', _key: 'privacy', label: 'Privacy Statement', href: '/privacy'},
          {_type: 'linkItem', _key: 'terms', label: 'General Terms and Conditions', href: '/algemene-voorwaarden'},
        ],
      },
    },
    notFound: {
      title: 'Page not found',
      text: 'The page no longer exists, has been moved or the address is incorrect. Go back to the homepage or start an intake directly.',
      buttons: [
        {_type: 'headerButton', _key: 'btn-home', label: 'Go to homepage', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/'}, variant: 'primary'},
        {_type: 'headerButton', _key: 'btn-intake', label: 'Start intake', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/contact'}, variant: 'outlined'},
      ],
    },
    footerCta: {
      eyebrow: 'Start today',
      title: 'Would you like a renovation with the same clarity?',
      text: 'Start the intake. We will contact you within 24 hours.',
      buttons: [
        {_type: 'headerButton', _key: 'btn-intake', label: 'Start intake', link: {_type: 'smartLink', linkType: 'external', externalUrl: '/contact'}, variant: 'primary'},
        {_type: 'headerButton', _key: 'btn-call', label: 'Call immediately', link: {_type: 'smartLink', linkType: 'external', externalUrl: 'tel:+31850871814'}, variant: 'outlined'},
      ],
      ratingScore: 4.8,
      ratingLabel: '4.8 Star Rating',
    },
  })

  const result = await patch.commit({returnDocuments: true})
  console.log('✅ Site settings seeded:', result._id)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
