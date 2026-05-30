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

// Internal link — resolves via the document's own slug at runtime
function internal(id) {
  return {_type: 'smartLink', linkType: 'internal', internalRef: {_type: 'reference', _ref: id}}
}

// External link — used for tel:, mailto:, and pages without a document (e.g. /diensten, /projecten)
function external(url) {
  return {_type: 'smartLink', linkType: 'external', externalUrl: url}
}

function btn(key, label, link, variant = 'primary') {
  return {_type: 'headerButton', _key: key, label, link, variant}
}

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
        _type: 'headerMenuItem',
        _key: 'menu-services',
        label: 'Diensten',
        type: 'megaMenu',
        columns: [
          {
            _type: 'megaMenuColumn',
            _key: 'col-wonen',
            title: 'Wonen',
            links: [
              {_type: 'megaMenuLink', _key: 'lnk-badkamer',   label: 'Badkamer renovatie', link: internal('service-badkamer-renovatie')},
              {_type: 'megaMenuLink', _key: 'lnk-totaal',     label: 'Totaalrenovatie',    link: internal('service-totaalrenovatie')},
              {_type: 'megaMenuLink', _key: 'lnk-uitbouw',    label: 'Uitbouw / aanbouw',  link: internal('service-uitbouw-aanbouw')},
              {_type: 'megaMenuLink', _key: 'lnk-afbouw',     label: 'Afbouw nieuwbouw',   link: internal('service-afbouw-nieuwbouw')},
            ],
          },
          {
            _type: 'megaMenuColumn',
            _key: 'col-installaties',
            title: 'Installaties',
            links: [
              {_type: 'megaMenuLink', _key: 'lnk-vloer',      label: 'Vloerverwarming', link: internal('service-vloerverwarming')},
              {_type: 'megaMenuLink', _key: 'lnk-warmtepomp', label: 'Warmtepomp',      link: internal('service-warmtepomp')},
              {_type: 'megaMenuLink', _key: 'lnk-solar',      label: 'Zonnepanelen',    link: internal('service-zonnepanelen')},
            ],
          },
          {
            _type: 'megaMenuColumn',
            _key: 'col-afwerking',
            title: 'Afwerking',
            links: [
              {_type: 'megaMenuLink', _key: 'lnk-stuc',       label: 'Stuc- en schilderwerk', link: internal('service-stuc-schilderwerk')},
              {_type: 'megaMenuLink', _key: 'lnk-onderhoud',  label: 'Onderhoud',             link: internal('service-onderhoud')},
            ],
          },
        ],
        promo: {},
      },
      // /projecten and /diensten are index pages (servicesIndex / projectsIndex) — not referenceable via smartLink, kept external
      {_type: 'headerMenuItem', _key: 'menu-projecten', label: 'Projecten', type: 'link', link: external('/projecten')},
      {_type: 'headerMenuItem', _key: 'menu-over-ons',  label: 'Over ons',  type: 'link', link: internal('page-over-ons')},
      {_type: 'headerMenuItem', _key: 'menu-werkwijze', label: 'Werkwijze', type: 'link', link: internal('page-werkwijze')},
      {_type: 'headerMenuItem', _key: 'menu-zakelijk',  label: 'Zakelijk',  type: 'link', link: internal('page-zakelijk')},
      {_type: 'headerMenuItem', _key: 'menu-contact',   label: 'Contact',   type: 'link', link: internal('page-contact')},
    ],
    headerButtons: [
      btn('hbtn-intake', 'Start intake',  internal('page-contact'),           'primary'),
      btn('hbtn-call',   'Bel direct',    external('tel:+31850871814'),        'outlined'),
    ],
    floatingActions: {
      whatsappLabel: 'WhatsApp',
      whatsappHref: 'https://wa.me/31850871814',
      intakeLabel: 'Start intake',
      intakeHref: '/contact',
    },
    footer: {
      brand: {
        brandTitle: 'DRO Renovaties',
        description: 'Uw partner voor complete renovatie- en afbouwprojecten. Wij combineren vakmanschap met structuur voor particuliere en zakelijke opdrachtgevers.',
      },
      contact: {
        contactTitle: 'Contact',
        contactAddress: 'Den Haag en omgeving · Randstad',
        contactPhone: '+31 85 087 1814',
        contactPhoneHref: 'tel:+31850871814',
        contactPhoneNote: '(ook via WhatsApp)',
        contactEmail: 'info@drobouwgroep.nl',
        contactEmailHref: 'mailto:info@drobouwgroep.nl',
      },
      services: {
        servicesTitle: 'Diensten',
      },
      commercial: {
        businessTitle: 'Zakelijk',
        businessText: 'Voor vastgoedpartijen, ontwikkelaars en aannemers leveren wij:',
        businessItems: [
          'Projectmatige renovaties',
          'Seriematige afbouw',
          'Mutatiewoningen',
          'Uitvoering op schaal',
        ],
        businessClosing: 'Uitvoeringspartner met capaciteit en continuïteit.\n\nEén partij. Volledige uitvoering. Volledige controle.',
      },
      bottom: {
        statement: 'DRO Bouw- en Aannemingsbedrijf',
        copyright: '© DRO Renovaties',
        legalLinks: [
          {_type: 'linkItem', _key: 'privacy', label: 'Privacyverklaring',    href: '/privacy'},
          {_type: 'linkItem', _key: 'terms',   label: 'Algemene voorwaarden', href: '/algemene-voorwaarden'},
        ],
      },
    },
    notFound: {
      title: 'Pagina niet gevonden',
      text: 'De pagina bestaat niet meer, is verplaatst of het adres klopt niet. Ga terug naar de homepage of start direct een intake.',
      buttons: [
        btn('btn-home',   'Ga naar homepage', internal('home'),         'primary'),
        btn('btn-intake', 'Start intake',     internal('page-contact'), 'outlined'),
      ],
    },
    footerCta: {
      eyebrow: 'Start vandaag',
      title: 'Wilt u een renovatie met dezelfde duidelijkheid?',
      text: 'Start de intake. Wij nemen binnen 24 uur contact op.',
      buttons: [
        btn('btn-intake', 'Start intake', internal('page-contact'),    'primary'),
        btn('btn-call',   'Bel direct',   external('tel:+31850871814'), 'outlined'),
      ],
      ratingScore: 4.8,
      ratingLabel: '4.8 Sterrenbeoordeling',
    },
  })

  const result = await patch.commit({returnDocuments: true})
  console.log('✅ Site settings seeded:', result._id)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
