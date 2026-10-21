import type {Metadata} from 'next'
import CookieSettingsLink from '@/components/analytics/CookieSettingsLink'
import SmartIntakeWizard from '@/components/SmartIntakeWizard'
import VideoTestimonials, {type VideoTestimonial} from '@/components/landing/VideoTestimonials'
import {getProjects} from '@/lib/cms'
import {DRAAGMUUR_FULL_FROM_INCL, formatEuro} from '@/lib/draagmuurPrice'
import type {ProjectItem} from '@/lib/types'

// Advertentie-landingspagina voor de campagne "Draagmuur Den Haag e.o.".
// Zelfde opbouw als de totaalrenovatie-pagina. De kop past zich aan de
// advertentiegroep aan via ?v=verwijderen | kosten | balk.
// Niet in Google indexeren: dit is een advertentiepagina, geen SEO-pagina.

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Draagmuur verwijderen in Den Haag, alles geregeld | DRO Renovaties',
  description:
    'Draagmuur eruit of een deuropening in een dragende muur: constructieberekening, vergunning, stalen balk en afwerking geregeld door een Haags familiebedrijf. Bereken direct uw prijsindicatie.',
  robots: {index: false, follow: false},
  alternates: {canonical: '/draagmuur-verwijderen-den-haag'},
}

const PHONE_LABEL = '085 087 1814'
const PHONE_HREF = 'tel:+31850871814'
const REVIEW_SCORE = '4,8'
const REVIEW_COUNT = '273+'
const TRUSTOO_SCORE = '9,8'
const TRUSTOO_COUNT = '557'
const RESPONSE_PROMISE = 'Binnen 1 werkuur teruggebeld'
const FULL_FROM = formatEuro(DRAAGMUUR_FULL_FROM_INCL)

type Variant = 'verwijderen' | 'kosten' | 'balk'

const HERO: Record<Variant, {title: string; intro: string}> = {
  verwijderen: {
    title: 'Draagmuur eruit, alles geregeld',
    intro:
      'Van deuropening tot een hele muur weg voor uw open keuken. Wij regelen constructeur, vergunning, stalen balk en, als u wilt, de afwerking. Eén aanspreekpunt, één vaste prijs.',
  },
  kosten: {
    title: 'Wat kost een draagmuur verwijderen?',
    intro:
      'Bereken hiernaast direct uw prijsindicatie. Inclusief constructieberekening, vergunningsaanvraag, stempelen, stalen balk, container en afvoer. Na de opname krijgt u een vaste prijs.',
  },
  balk: {
    title: 'Draagmuur weg, stalen balk erin',
    intro:
      'Constructeur, berekening, vergunning, stempelen en het plaatsen van de balk: wij doen het hele traject. Uitvoering in 1 tot 3 dagen door onze eigen ploeg.',
  },
}

const PROOF = [
  `${TRUSTOO_SCORE} op Trustoo uit ${TRUSTOO_COUNT} reviews, Top Pro 2026`,
  'Vergunning en constructeur door ons geregeld',
  'Uitvoering in 1 tot 3 dagen, met eigen vaste ploeg',
  'VCA-gecertificeerd en CAR-verzekerd',
]

// Wat er in de prijs zit. Volgorde = volgorde van het werk.
const INCLUDED = [
  {title: 'Constructieberekening', text: 'Een constructeur berekent welke balk of latei er nodig is en hoe die wordt opgelegd.', icon: 'calc'},
  {title: 'Tekening en vergunning', text: 'Wij maken de tekeningen en dienen de omgevingsvergunning voor u in.', icon: 'doc'},
  {title: 'Stempelen', text: 'Het huis wordt veilig ondersteund voordat er ook maar één steen uit gaat.', icon: 'stamp'},
  {title: 'Sloop, container en afvoer', text: 'Wij slopen de muur, voeren het puin af en laten het bezemschoon achter.', icon: 'truck'},
  {title: 'Stalen balk of latei', text: 'Geleverd, geplaatst, ondersabeld en ingemetseld volgens de berekening.', icon: 'beam'},
  {title: 'Brandveilig inpakken', text: 'Bij slijp- en laswerk pakken we de ruimte brandveilig in. Standaard, tenzij u dat niet wilt.', icon: 'shield'},
  {title: 'Stofwanden en afdekken', text: 'Vloeren afgedekt, stofschotten geplaatst, zodat de rest van het huis schoon blijft.', icon: 'house'},
  {title: 'Afwerking, als u wilt', text: 'Stucwerk schilderklaar, of meteen door met vloer, keuken en elektra.', icon: 'brush'},
] as const

// Soorten klussen. Alleen voor de volledige vervanging staat een vanaf-prijs
// (op aangeven van Therab); de rest via de rekenmodule.
const JOBS = [
  {
    title: 'Deuropening in een draagmuur',
    text: 'Een nieuwe doorgang tussen twee kamers of naar de gang, met een latei of balk erboven.',
    note: 'Bereken uw indicatie in het formulier',
  },
  {
    title: 'Draagmuur deels weghalen',
    text: 'Een bredere doorgang of een opening van 1,5 tot 2,5 meter, bijvoorbeeld tussen keuken en eetkamer.',
    note: 'Bereken uw indicatie in het formulier',
  },
  {
    title: 'Draagmuur helemaal verwijderen',
    text: 'De hele muur eruit voor een open keuken of één grote woonkamer, met een stalen balk en zo nodig kolommen.',
    note: `Vanaf ${FULL_FROM} inclusief btw`,
  },
] as const

const STEPS = [
  {title: 'Aanvraag en indicatie', text: 'U vult het formulier in en ziet direct een prijsindicatie. Wij bellen u binnen 1 werkuur terug.'},
  {title: 'Opname op locatie', text: 'Een verbouwadviseur komt langs, meet alles in en bekijkt leidingen, vloer en plafond.'},
  {title: 'Berekening en tekening', text: 'De constructeur rekent de balk door. Geen tekeningen? Wij vragen ze op bij het gemeentearchief.'},
  {title: 'Vergunning', text: 'Wij dienen de aanvraag in. De gemeente beslist meestal binnen 8 weken. Intussen plannen we de uitvoering.'},
  {title: 'Uitvoering in 1 tot 3 dagen', text: 'Inpakken, stempelen, slopen, balk plaatsen en inmetselen. Daarna gaan de stempels eruit.'},
  {title: 'Afwerking en oplevering', text: 'Stucwerk schilderklaar of casco, net wat u kiest. We lopen het samen na.'},
]

const LIVING = [
  {title: 'Meestal blijft u gewoon thuis wonen', text: 'Alleen de ruimte waar we werken is 1 tot 3 dagen niet te gebruiken. De rest van het huis blijft bereikbaar.'},
  {title: 'Stof blijft waar het hoort', text: 'We plaatsen stofschotten, dekken vloeren en trap af en zuigen dagelijks af. U krijgt de ruimte bezemschoon terug.'},
  {title: 'Brandveilig gewerkt', text: 'Bij het slijpen en lassen van de stalen balk vliegen vonken. Wij pakken de ruimte brandveilig in en houden toezicht tot na het laswerk.'},
  {title: 'Buren op de hoogte', text: 'Bij een rijwoning of appartement laten we de buren vooraf weten wanneer er geluid is.'},
]

// Kenmerken van een dragende muur (algemeen, geen garantie; de constructeur beslist).
const LOAD_BEARING_SIGNS = [
  'De muur is 17,5 cm of dikker. Een lichte binnenmuur is meestal rond 10 cm.',
  'De muur klinkt massief als u erop klopt, niet hol.',
  'De muur loopt door tot het plafond en staat vaak recht onder een muur op de verdieping.',
  'De muur staat haaks op de balken van de vloer erboven.',
  'De muur scheidt woonkamer en keuken in een rijwoning of jaren-30-woning. Die zijn vaak dragend.',
]

const FAQ = [
  {
    q: 'Wat kost een draagmuur verwijderen?',
    a: `Dat hangt af van de breedte van de opening, de dikte van de muur, of het op de begane grond of verdieping is en of u het afgewerkt wilt. Een volledige draagmuur vervangen door een stalen balk doen we vanaf ${FULL_FROM} inclusief btw. Een deuropening of gedeeltelijke doorbraak kost minder. In het formulier bovenaan berekent u direct uw indicatie. Daarin zit de constructieberekening, de vergunningsaanvraag, stempelen, de balk of latei, sloop, container en afvoer. Alleen de leges van de gemeente betaalt u apart.`,
  },
  {
    q: 'Hoe weet ik of mijn muur dragend is?',
    a: 'Een dragende muur is vaak 17,5 cm of dikker, klinkt massief en loopt door tot het plafond, vaak recht onder een muur op de verdieping. Zeker weten doet u het pas met de bouwtekeningen of een constructeur. Twijfelt u? Kies in het formulier "Weet ik niet", dan kijken we het bij de opname voor u na.',
  },
  {
    q: 'Heb ik een vergunning nodig?',
    a: 'Ja. Omdat de draagconstructie van uw huis verandert, is een omgevingsvergunning verplicht. Wij regelen dat voor u: tekeningen, constructieberekening en de aanvraag bij de gemeente. In Den Haag beslist de gemeente meestal binnen 8 weken. De leges betaalt u aan de gemeente.',
  },
  {
    q: 'Hoe lang duurt het?',
    a: 'De uitvoering zelf duurt 1 tot 3 dagen. De voorbereiding duurt langer: opname, berekening, tekening en vooral de vergunning. Reken vanaf uw aanvraag op ongeveer 2 tot 3 maanden tot de uitvoering, afhankelijk van de gemeente.',
  },
  {
    q: 'Kan ik tijdens het werk thuis blijven wonen?',
    a: 'Meestal wel. Alleen de ruimte waar we werken is 1 tot 3 dagen niet bruikbaar. We plaatsen stofschotten en dekken vloeren af, zodat de rest van het huis schoon en bereikbaar blijft.',
  },
  {
    q: 'Wat is brandveilig inpakken, en waarom is het belangrijk?',
    a: 'Bij het slijpen en lassen van een stalen balk ontstaan vonken. Brandveilig inpakken betekent dat we vloeren, plafond en spullen in de buurt afdekken met brandwerend materiaal en toezicht houden tot na het laswerk. Wij doen dit standaard. Wilt u het bewust niet, dan neemt DRO geen verantwoordelijkheid voor brand- of rookschade die daardoor ontstaat. Laat het ook bij een andere aannemer altijd doen, ook voor uw garantie en verzekering.',
  },
  {
    q: 'Doen jullie ook kleine klussen, zoals alleen een deuropening?',
    a: 'Ja. Een deuropening in een draagmuur of een gedeeltelijke doorbraak doen we net zo zorgvuldig, met dezelfde berekening, vergunning en verzekering.',
  },
  {
    q: 'Kunnen jullie het ook afwerken?',
    a: 'Ja. U kiest zelf: casco (alleen de constructieve doorbraak) of afgewerkt (stucwerk schilderklaar). Wilt u daarna door met een nieuwe vloer, keuken of elektra, dan doen we dat ook, met hetzelfde aanspreekpunt.',
  },
  {
    q: 'Wat als ik geen bouwtekeningen heb?',
    a: 'Geen probleem. Wij vragen de archieftekeningen op bij de gemeente. Zijn die er niet, dan meten we de situatie zelf in voor de constructeur en de vergunning.',
  },
  {
    q: 'Ik woon in een appartement. Kan dat ook?',
    a: 'Ja, maar dan is toestemming van de VvE nodig, omdat dragende muren vaak bij de gemeenschappelijke constructie horen. Wij leveren de berekening en tekeningen die de VvE wil zien.',
  },
  {
    q: 'Wanneer kan ik mijn nieuwe keuken bestellen?',
    a: 'Bestel de keuken pas definitief als de berekening rond is en de vergunning is aangevraagd. Dan weet u zeker waar de balk en eventuele kolommen komen. Wij plannen keuken en doorbraak graag samen met u.',
  },
  {
    q: 'Wat als er asbest in of bij de muur zit?',
    a: 'Bij woningen van vóór 1994 kan dat. Vermoeden we asbest, dan laten we eerst een asbestinventarisatie doen. Zonder die toets slopen we niet.',
  },
  {
    q: 'In welke plaatsen werken jullie?',
    a: 'In Den Haag en tot zo\'n 50 km daaromheen: onder meer Rijswijk, Delft, Leidschendam-Voorburg, Wassenaar, Zoetermeer, Westland, Leiden, Rotterdam, Gouda en Alphen aan den Rijn.',
  },
]

const ICON_PATHS: Record<string, string[]> = {
  calc: ['M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M8 7h8', 'M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2'],
  doc: ['M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M14 3v5h5', 'M9 13h6M9 17h6'],
  stamp: ['M4 4h16', 'M7 4v16M17 4v16', 'M4 20h16'],
  truck: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7', 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  beam: ['M3 8h18v3H3z', 'M6 11v9M18 11v9', 'M3 4h18'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  house: ['M3 21h18', 'M5 21V10l7-5 7 5v11', 'M9 21v-6h6v6'],
  brush: ['M18 3l3 3-9 9-3-3z', 'M9 12l-3 3c-1.5 1.5-1 4-3 5 3 1 6 0 7-2l2-3'],
}

const LOGOS = [
  {name: 'Goudse Verzekeringen', src: '/landing/logos/logo-goudse.png', text: 'Onze verzekeraar. Schade tijdens de bouw is gedekt.'},
  {name: 'VCA', src: '/landing/logos/logo-vca.png', text: 'Gecertificeerd voor veilig werken op de bouw.'},
  {name: 'VLOK', src: '/landing/logos/logo-vlok.png', text: 'Erkend voor werk aan airco- en warmtepompsystemen.'},
  {name: 'SBB', src: '/landing/logos/logo-sbb.png', text: 'Erkend leerbedrijf: wij leiden zelf vakmensen op.'},
]

const TESTIMONIALS: VideoTestimonial[] = [
  {
    name: 'Rory de Wit',
    project: 'Totaalrenovatie met badkamers, toiletten, stucwerk en vloeren',
    duration: '0:59',
    quote: '"De communicatie was supergoed. Ook al ging soms niet alles soepel, dat werd heel goed opgepakt."',
    poster: '/landing/video/rory-poster.jpg',
    src: '/landing/video/rory.mp4',
  },
  {
    name: 'Stefano',
    project: 'Renovatie appartement uit 1998, offerte binnen twee dagen',
    duration: '0:59',
    quote: '"De prijs is eerlijk en scherp. Niet de duurste, niet de goedkoopste, maar je krijgt echt waar voor je geld."',
    poster: '/landing/video/stefano-poster.jpg',
    src: '/landing/video/stefano.mp4',
  },
  {
    name: 'Kelly',
    project: 'Badkamer verbouwd',
    duration: '0:53',
    quote: '"De samenwerking was echt fantastisch, want de jongens werkten super hard, super netjes."',
    poster: '/landing/video/kelly-poster.jpg',
    src: '/landing/video/kelly.mp4',
  },
]

const REVIEW_POLICY = 'Wij tonen reviews zoals ze op Google en Trustoo staan, zonder ze aan te passen.'

type StaticReview = {name: string; date: string; project: string; quote: string}
const GOOGLE_REVIEWS: StaticReview[] = [
  {name: 'Allama', date: '13 mei 2026', project: 'Totaalrenovatie', quote: 'We zijn erg tevreden. Het team was professioneel, kwam alle afspraken na en startte het werk steeds op tijd.'},
  {name: 'Youri', date: '15 apr 2026', project: 'Renovatie', quote: 'Therab laat duidelijk zien wat eerlijk verbouwen is. Ook als dingen niet gaan zoals ze moeten zijn ze responsief en lossen ze het netjes op.'},
  {name: 'Kaylee', date: '1 apr 2026', project: 'Badkamer en toilet', quote: 'Onze badkamer en toilet laten renoveren door DRO. Super hard werkende mensen, goede communicatie en alles is netjes afgewerkt.'},
  {name: 'Anil', date: '14 mei 2026', project: 'Badkamer en wc renovatie', quote: 'Ik ben ontzettend tevreden over het werk van DRO Renovaties. Mijn badkamer en wc zijn volledig gerenoveerd en werkelijk prachtig geworden. Alles verliep professioneel en duidelijk.'},
]
const TRUSTOO_SOURCES = 'Trustoo, Google, Werkspot en Facebook'
const TRUSTOO_BADGES = [
  {src: '/landing/logos/trustoo-toppro.png', alt: 'Trustoo Top Pro 2026'},
  {src: '/landing/logos/trustoo-topscore.png', alt: 'Trustoo Top Score 2026'},
]
const STAR = 'text-[#F5B301]'

const TEAM_PHOTO = {url: '/landing/team-dro.jpg', title: 'Het team van DRO Renovaties', caption: 'Onze vaste ploegen'}

// Verbouwingen met open ruimtes en constructieve aanpassingen.
const FEATURED_PROJECTS = ['essehout-zoetermeer', 'jan-muschlaan-den-haag', 'fuutlaan-leidschendam']
const HERO_PROJECTS = ['essehout-zoetermeer', 'fuutlaan-leidschendam']

const NAV = [
  {href: '#inbegrepen', label: 'Wat zit erin'},
  {href: '#prijs', label: 'Prijs'},
  {href: '#werkwijze', label: 'Werkwijze'},
  {href: '#wonen', label: 'Thuis blijven'},
  {href: '#ervaringen', label: 'Ervaringen'},
  {href: '#vragen', label: 'Vragen'},
]

const H1 = 'font-bold [font-stretch:115%] tracking-[-0.015em] leading-[1.04]'
const H2 =
  'text-[26px] sm:text-[32px] font-bold [font-stretch:112%] tracking-[-0.01em] leading-[1.1] after:mt-3 after:block after:h-[3px] after:w-12 after:rounded-full after:bg-lp-orange'
const BODY = 'text-[16px] leading-[1.65] text-lp-muted'
const CTA =
  'inline-flex min-h-[48px] items-center rounded-md bg-lp-orange px-6 font-semibold text-white transition-colors hover:bg-lp-orange-hover'

function sizedImage(url: string, width: number): string {
  if (!url.includes('cdn.sanity.io') || /[?&]w=/.test(url)) return url
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}&auto=format&q=70`
}

function pickProjects(projects: ProjectItem[]): ProjectItem[] {
  const featured = FEATURED_PROJECTS.map((slug) => projects.find((p) => p.slug === slug && p.beforeImage && p.afterImage)).filter(
    (p): p is ProjectItem => Boolean(p),
  )
  return featured.slice(0, 3)
}

function heroImageOf(projects: ProjectItem[]): string | null {
  const project = HERO_PROJECTS.map((slug) => projects.find((p) => p.slug === slug && p.afterImage)).find(Boolean)
  return project?.afterImage ? sizedImage(project.afterImage, 1800) : null
}

function pickVariant(value: string | string[] | undefined): Variant {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'kosten' || v === 'balk' ? v : 'verwijderen'
}

function Icon({name}: {name: string}) {
  return (
    <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-lp-orange/10 text-lp-orange">
      <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
        {(ICON_PATHS[name] || []).map((d) => (
          <path d={d} key={d} />
        ))}
      </svg>
    </span>
  )
}

function GoogleG() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 48 48">
      <path d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.6 17.7 9.5 24 9.5z" fill="#EA4335" />
      <path d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" fill="#4285F4" />
      <path d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6z" fill="#FBBC05" />
      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6C6.6 42.6 14.6 48 24 48z" fill="#34A853" />
    </svg>
  )
}

function PullQuote({review}: {review: StaticReview}) {
  return (
    <figure className="m-0 mt-10 max-w-3xl border-l-[3px] border-lp-orange pl-4">
      <blockquote className="text-[20px] font-semibold leading-[1.45] text-lp-ink">&ldquo;{review.quote}&rdquo;</blockquote>
      <figcaption className="mt-2 text-[13px] text-lp-muted">
        <span aria-label="5 van 5 sterren" className={`${STAR} mr-1.5 tracking-[1px]`}>
          ★★★★★
        </span>
        {review.name}, Den Haag, {review.project.toLowerCase()}, Google-review
      </figcaption>
    </figure>
  )
}

export default async function DraagmuurLandingPage({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
  const variant = pickVariant(searchParams.v)
  const hero = HERO[variant]
  const projects = await getProjects()
  const shownProjects = pickProjects(projects)
  const heroImage = heroImageOf(projects)

  const proofItems = PROOF.map((item) => (
    <li className="flex items-start gap-3 text-[15px]" key={item}>
      <span aria-hidden="true" className="mt-[9px] h-[2px] w-4 shrink-0 bg-lp-orange" />
      {item}
    </li>
  ))

  return (
    <main className="pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-lp-line bg-white/95 backdrop-blur">
        <div className="section-shell flex min-h-[60px] items-center justify-between gap-4">
          <a aria-label="Naar boven" href="#aanvraag">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="DRO Renovaties, bouw- en klusbedrijf" className="h-8 w-auto sm:h-9" height={47} src="/landing/logo-dro.png" width={190} />
          </a>
          <nav aria-label="Op deze pagina" className="hidden items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <a className="text-[14px] font-semibold text-lp-ink/80 transition-colors hover:text-lp-orange" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a className="hidden min-h-[40px] items-center rounded-md px-3 text-[14px] font-semibold text-lp-orange underline-offset-2 hover:underline sm:inline-flex" href="/">
              Bezoek onze website
            </a>
            <a
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-lp-orange px-4 text-[15px] font-semibold text-white transition-colors hover:bg-lp-orange-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-orange"
              href={PHONE_HREF}
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
              </svg>
              <span className="hidden sm:inline">{PHONE_LABEL}</span>
              <span className="sm:hidden">Bel</span>
            </a>
          </div>
        </div>
        <nav aria-label="Op deze pagina" className="border-t border-lp-line lg:hidden">
          <div className="section-shell flex gap-2 overflow-x-auto py-2 [scrollbar-width:none]">
            {NAV.map((item) => (
              <a className="inline-flex min-h-[36px] flex-none items-center rounded-full border border-lp-line px-3 text-[13px] font-semibold text-lp-ink" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
            <a className="inline-flex min-h-[36px] flex-none items-center rounded-full border border-lp-orange px-3 text-[13px] font-semibold text-lp-orange" href="/">
              Bezoek onze website
            </a>
          </div>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden bg-lp-slate text-white" id="aanvraag">
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" src={heroImage} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-lp-slate via-lp-slate/90 to-lp-slate/40" />
          </>
        )}
        <div className="section-shell grid gap-10 py-10 md:grid-cols-[1.05fr_1fr] md:items-center md:py-16">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-lp-orange">Draagmuur verwijderen in Den Haag e.o.</p>
            <h1 className={`${H1} mt-3 text-[34px] sm:text-[46px] lg:text-[50px]`}>{hero.title}</h1>
            <p className="mt-5 max-w-[34em] text-[17px] leading-[1.6] text-white/85">{hero.intro}</p>
            <ul className="mt-7 hidden gap-3 text-white/90 md:grid">{proofItems}</ul>
          </div>
          <div className="text-lp-ink">
            <SmartIntakeWizard
              presetServices={['Draagmuur verwijderen']}
              responsePromise="binnen 1 werkuur"
              skipIds={['found', 'budget']}
              source="lp-draagmuur"
              thanksLinks={[
                {href: '/over-ons', label: 'Over DRO Renovaties'},
                {href: '/projecten', label: 'Bekijk onze projecten'},
                {href: '/werkwijze', label: 'Onze werkwijze'},
              ]}
              variant={variant}
            />
            <p className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/85">
              <span className="font-semibold text-white">
                <span aria-hidden="true" className={STAR}>
                  ★
                </span>{' '}
                {TRUSTOO_SCORE} Trustoo
              </span>
              <span className="font-semibold text-white">
                <span aria-hidden="true" className={STAR}>
                  ★
                </span>{' '}
                {REVIEW_SCORE} Google
              </span>
              <span>Vergunning geregeld</span>
              <span>{RESPONSE_PROMISE}</span>
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Beoordelingen en beloften" className="bg-lp-plaster">
        <dl className="section-shell grid grid-cols-2 items-start gap-x-6 gap-y-5 py-6 lg:grid-cols-5">
          <div>
            <dt className="text-[13px] text-lp-muted">Trustoo</dt>
            <dd className="mt-0.5 text-[20px] font-bold tabular-nums [font-stretch:110%]">
              {TRUSTOO_SCORE}/10 <span className="text-[14px] font-normal text-lp-muted [font-stretch:100%]">{TRUSTOO_COUNT} reviews</span>
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-lp-muted">Google</dt>
            <dd className="mt-0.5 text-[20px] font-bold tabular-nums [font-stretch:110%]">
              {REVIEW_SCORE}
              <span className="text-lp-orange"> ★</span>{' '}
              <span className="text-[14px] font-normal text-lp-muted [font-stretch:100%]">{REVIEW_COUNT} reviews</span>
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-lp-muted">Uitvoering</dt>
            <dd className="mt-0.5 text-[20px] font-bold [font-stretch:110%]">1 tot 3 dagen</dd>
          </div>
          <div>
            <dt className="text-[13px] text-lp-muted">Gecertificeerd en verzekerd</dt>
            <dd className="mt-1 flex min-h-[44px] items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="VCA-gecertificeerd" className="h-[30px] w-auto" src="/landing/logos/logo-vca.png" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Verzekerd bij De Goudse" className="h-[38px] w-auto" src="/landing/logos/logo-goudse.png" />
            </dd>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <dt className="text-[13px] text-lp-muted">Na uw aanvraag</dt>
            <dd className="mt-0.5 text-[17px] font-semibold">{RESPONSE_PROMISE}</dd>
          </div>
        </dl>
      </section>

      <section className="section-shell py-8 md:hidden">
        <ul className="grid gap-3">{proofItems}</ul>
      </section>

      <section className="scroll-mt-28 border-t border-lp-line" id="inbegrepen">
        <div className="section-shell py-14">
          <h2 className={`${H2} max-w-[24ch]`}>Alles geregeld, van berekening tot afwerking</h2>
          <p className={`mt-3 max-w-[62ch] ${BODY}`}>
            Bij de meeste partijen regelt u zelf de constructeur of de vergunning. Bij ons niet: u heeft één aanspreekpunt en één prijs
            voor het hele traject.
          </p>
          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((item) => (
              <li className="grid grid-cols-[36px_minmax(0,1fr)] gap-3" key={item.title}>
                <Icon name={item.icon} />
                <div>
                  <span className="block font-semibold leading-snug">{item.title}</span>
                  <span className="mt-0.5 block text-sm leading-[1.55] text-lp-muted">{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="scroll-mt-28 border-t border-lp-line bg-lp-plaster" id="prijs">
        <div className="section-shell py-14">
          <h2 className={H2}>Groot of klein, wij doen het allebei</h2>
          <p className={`mt-3 max-w-[62ch] ${BODY}`}>
            Van een nieuwe deuropening tot een hele muur eruit. Elke doorbraak krijgt dezelfde zorg: berekend, vergund en verzekerd.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {JOBS.map((job, i) => (
              <article className={`flex flex-col rounded-lg border bg-white p-5 ${i === 2 ? 'border-lp-orange' : 'border-lp-line'}`} key={job.title}>
                <h3 className="text-[18px] font-bold [font-stretch:108%]">{job.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-lp-muted">{job.text}</p>
                <p className={`mt-4 border-t border-lp-line pt-3 text-[15px] font-semibold ${i === 2 ? 'text-lp-orange' : ''}`}>{job.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div className={BODY}>
              <p className="text-lp-ink">Waar uw prijs uitkomt, hangt vooral af van:</p>
              <ul className="mt-3 space-y-2 border-l-2 border-lp-orange pl-4">
                <li>de breedte van de opening, en of er kolommen nodig zijn</li>
                <li>de dikte van de muur en wat erboven staat</li>
                <li>begane grond, verdieping of appartement</li>
                <li>casco of afgewerkt opgeleverd</li>
                <li>leidingen en elektra die in de muur zitten</li>
              </ul>
            </div>
            <div className="rounded-lg border border-lp-line bg-white p-5">
              <p className="font-semibold">Altijd inbegrepen in uw indicatie</p>
              <p className="mt-2 text-[15px] leading-[1.6] text-lp-muted">
                Constructieberekening, tekening en vergunningsaanvraag, stempelen, stalen balk of latei, sloop, container en afvoer, en
                brandveilig inpakken. Leges van de gemeente betaalt u apart.
              </p>
              <a className={`${CTA} mt-4`} href="#aanvraag">
                Bereken uw indicatie
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 border-t border-lp-line" id="werkwijze">
        <div className="section-shell py-14">
          <h2 className={H2}>Zo gaat het</h2>
          <p className={`mt-3 max-w-[62ch] ${BODY}`}>
            De uitvoering duurt 1 tot 3 dagen. De meeste tijd zit in de voorbereiding, vooral de vergunning. Die nemen wij van u over.
          </p>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-6 md:gap-5">
            <span aria-hidden="true" className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-[2px] bg-lp-orange/30 md:left-0 md:top-[15px] md:h-[2px] md:w-full" />
            {STEPS.map((step, i) => (
              <li className="relative pl-12 md:pl-0 md:pt-12" key={step.title}>
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-lp-orange text-sm font-bold tabular-nums text-white">{i + 1}</span>
                <h3 className="text-[16px] font-semibold leading-snug">{step.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.6] text-lp-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <PullQuote review={GOOGLE_REVIEWS[0]} />
        </div>
      </section>

      <section className="scroll-mt-28 border-t border-lp-line bg-lp-slate text-white" id="wonen">
        <div className="section-shell py-14">
          <h2 className={`${H2} max-w-[24ch]`}>Thuis blijven wonen, zonder stof door het hele huis</h2>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.65] text-white/80">
            Een doorbraak is zwaar werk in een bewoond huis. Zo houden we het netjes en veilig.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LIVING.map((item) => (
              <li className="border-t-2 border-lp-orange pt-4" key={item.title}>
                <h3 className="text-[17px] font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-white/75">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-lp-line">
        <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div>
            <h2 className={H2}>Is mijn muur dragend?</h2>
            <p className={`mt-3 max-w-[56ch] ${BODY}`}>
              Zeker weten doet u het pas met de bouwtekeningen of een constructeur. Deze kenmerken geven een eerste idee:
            </p>
            <ul className="mt-5 space-y-3">
              {LOAD_BEARING_SIGNS.map((sign) => (
                <li className="flex gap-3 text-[15px] leading-[1.6]" key={sign}>
                  <span aria-hidden="true" className="mt-[10px] h-[2px] w-4 shrink-0 bg-lp-orange" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-lp-line bg-lp-plaster p-6">
            <p className="text-[17px] font-semibold">Twijfelt u? Wij kijken het na.</p>
            <p className="mt-2 text-[15px] leading-[1.6] text-lp-muted">
              Kies in het formulier &ldquo;Weet ik niet&rdquo;. Bij de opname bekijken we de muur, vragen we de archieftekeningen op en
              laat de constructeur het doorrekenen. Blijkt de muur niet dragend, dan is het werk eenvoudiger en goedkoper.
            </p>
            <a className={`${CTA} mt-5`} href="#aanvraag">
              Start uw aanvraag
            </a>
          </div>
        </div>
      </section>

      {shownProjects.length > 0 && (
        <section className="scroll-mt-28 border-t border-lp-line" id="projecten">
          <div className="section-shell py-14">
            <h2 className={H2}>Ruimte gemaakt: verbouwingen in de regio</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {shownProjects.map((project) => (
                <article key={project.slug}>
                  <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-lg">
                    {[
                      {src: project.beforeImage!, label: 'Voor'},
                      {src: project.afterImage!, label: 'Na'},
                    ].map((img) => (
                      <figure className="relative" key={img.label}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={`${project.title}, ${img.label.toLowerCase()}`} className="aspect-[4/5] w-full bg-lp-plaster object-cover" decoding="async" loading="lazy" src={sizedImage(img.src, 500)} />
                        <figcaption className="absolute bottom-2 left-2 rounded bg-lp-ink/80 px-2 py-0.5 text-xs font-semibold text-white">{img.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <h3 className="mt-3 text-[17px] font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-lp-muted">{[project.location?.trim(), project.type?.trim()].filter(Boolean).join(' · ')}</p>
                  <a
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-md border border-lp-orange px-4 text-[15px] font-semibold text-lp-orange transition-colors hover:bg-lp-orange hover:text-white"
                    href={`/projecten/${project.slug}`}
                  >
                    Bekijk project <span aria-hidden="true">&rarr;</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="scroll-mt-28 border-t border-lp-line bg-lp-plaster" id="ervaringen">
        <div className="section-shell py-14 md:text-center">
          <h2 className={`${H2} md:after:mx-auto`}>Klanten vertellen het zelf</h2>
          <p className="mt-3 max-w-2xl text-lp-muted md:mx-auto">
            Geen acteurs, geen script. Klanten in hun eigen huis, na de oplevering. Met ondertiteling, dus ook zonder geluid te volgen.
          </p>
          <VideoTestimonials items={TESTIMONIALS} />
        </div>
      </section>

      <section className="border-t border-lp-line" id="reviews">
        <div className="section-shell py-14">
          <h2 className={H2}>Wat klanten over ons zeggen</h2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[300px_1fr]">
            <aside aria-label="Trustoo-score" className="rounded-lg border border-lp-line bg-white p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Trustoo" className="h-7 w-auto" src="/landing/logos/trustoo-logo.png" />
              <p className="mt-3.5 text-[56px] font-extrabold leading-none tabular-nums [font-stretch:110%]">
                {TRUSTOO_SCORE}
                <span className="text-[20px] font-medium text-lp-muted">/10</span>
              </p>
              <p className="mt-3 text-[14px] text-lp-muted">
                {TRUSTOO_COUNT} reviews uit 4 bronnen: {TRUSTOO_SOURCES}.
              </p>
              <div className="mt-4 flex items-end gap-3.5">
                {TRUSTOO_BADGES.map((badge) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={badge.alt} className="h-16 w-auto" key={badge.src} loading="lazy" src={badge.src} />
                ))}
              </div>
              <p className="mt-4 border-t border-lp-line pt-3.5 text-[14px]">
                <strong>{REVIEW_SCORE}</strong> <span className={STAR}>★</span> op Google, {REVIEW_COUNT} reviews
              </p>
            </aside>
            <div className="grid gap-4 sm:grid-cols-2">
              {GOOGLE_REVIEWS.map((review) => (
                <figure className="m-0 flex flex-col rounded-lg border border-lp-line bg-white p-5" key={review.name}>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#FBE6D9] font-bold text-lp-orange">
                      {review.name[0]}
                    </span>
                    <div>
                      <div className="text-[15px] font-semibold leading-tight">{review.name}</div>
                      <div className="text-[12px] text-lp-muted">Den Haag, {review.date}</div>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-lp-muted">
                      <GoogleG />
                      Google
                    </span>
                  </div>
                  <p aria-label="5 van 5 sterren" className={`mt-3 tracking-[2px] ${STAR}`}>
                    ★★★★★
                  </p>
                  <blockquote className="mt-2 flex-1 text-[15px] leading-[1.6]">&ldquo;{review.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3.5 border-t border-lp-line pt-2.5 text-[13px] text-lp-muted">Project: {review.project}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <p className="mt-6 max-w-[70ch] text-[13px] text-lp-muted">
            <span className="font-semibold">Over deze reviews.</span> {REVIEW_POLICY}
          </p>
        </div>
      </section>

      <section className="border-t border-lp-line">
        <div className="section-shell py-14">
          <figure className="relative mb-10 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={TEAM_PHOTO.title} className="aspect-[4/3] w-full bg-lp-plaster object-cover object-[center_65%] sm:aspect-[16/8]" decoding="async" loading="lazy" src={TEAM_PHOTO.url} />
            <figcaption className="absolute bottom-3 left-3 rounded bg-lp-ink/80 px-2.5 py-1 text-[13px] font-semibold text-white">{TEAM_PHOTO.caption}</figcaption>
          </figure>
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className={H2}>Een Haags familiebedrijf</h2>
              <p className={`mt-4 max-w-[60ch] ${BODY}`}>
                DRO Renovaties is gegroeid uit het bouwbedrijf van de vader van oprichter Therab Raja. Een doorbraak doen we met onze eigen
                vaste ploeg, met vaste constructeurs en een vaste tekenaar voor de vergunning. U heeft één aanspreekpunt van de eerste
                opname tot de oplevering.
              </p>
            </div>
            <ul className="grid content-start gap-3 text-[15px] md:border-l md:border-lp-line md:pl-8">
              <li>Kantoor aan de Orionstraat 235 in Den Haag</li>
              <li>Eigen vaste ploegen en eigen opslag</li>
              <li>Vaste constructeurs en tekenaar</li>
            </ul>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
            {LOGOS.map((logo) => (
              <li key={logo.name}>
                <div className="flex h-[104px] items-center justify-center rounded-lg border border-lp-line bg-white px-5 py-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={logo.name} className="max-h-full max-w-full object-contain" loading="lazy" src={logo.src} />
                </div>
                <p className="mt-2 text-[13px] leading-[1.45] text-lp-muted">{logo.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="scroll-mt-28 border-t border-lp-line" id="vragen">
        <div className="section-shell max-w-3xl py-14">
          <h2 className={H2}>Veelgestelde vragen</h2>
          <div className="mt-6 border-t border-lp-line">
            {FAQ.map((item) => (
              <details className="group border-b border-lp-line" key={item.q}>
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-lp-orange">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl font-normal text-lp-orange transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className={`pb-5 ${BODY}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lp-slate text-white">
        <div className="section-shell flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className={H2}>Muur eruit? Bereken uw indicatie</h2>
            <p className="mt-2 text-white/75">In twee minuten weet u waar u aan toe bent. Of bel ons direct.</p>
            <p className="mt-2 text-[14px] text-white/85">
              <span aria-hidden="true" className={STAR}>
                ★
              </span>{' '}
              {TRUSTOO_SCORE} op Trustoo uit {TRUSTOO_COUNT} reviews
              <span aria-hidden="true" className="mx-2 opacity-40">
                |
              </span>
              {REVIEW_SCORE} op Google
              <span aria-hidden="true" className="mx-2 opacity-40">
                |
              </span>
              VCA-gecertificeerd
            </p>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <a className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-md bg-lp-orange px-6 font-semibold transition-colors hover:bg-lp-orange-hover md:flex-none" href="#aanvraag">
              Indicatie berekenen
            </a>
            <a className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-md border border-white/60 px-6 font-semibold transition-colors hover:bg-white hover:text-lp-ink md:flex-none" href={PHONE_HREF}>
              Bel {PHONE_LABEL}
            </a>
          </div>
        </div>
      </section>

      <footer className="section-shell flex flex-wrap gap-x-6 gap-y-2 py-6 text-[13px] text-lp-muted">
        <span>DRO Bouw en Aannemingsbedrijf B.V., Orionstraat 235, Den Haag, KvK 94825653</span>
        <a className="underline underline-offset-2" href="/privacypolicy">
          Privacyverklaring
        </a>
        <CookieSettingsLink className="underline underline-offset-2" />
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-lp-line bg-white p-3 md:hidden">
        <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md border border-lp-ink font-semibold" href={PHONE_HREF}>
          Bellen
        </a>
        <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md bg-lp-orange font-semibold text-white" href="#aanvraag">
          Indicatie berekenen
        </a>
      </div>
    </main>
  )
}
