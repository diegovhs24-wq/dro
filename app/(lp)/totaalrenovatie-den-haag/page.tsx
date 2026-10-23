import {BUSINESS} from "@/lib/seo/business";
import type {Metadata} from 'next'
import CookieSettingsLink from '@/components/analytics/CookieSettingsLink'
import SmartIntakeWizard from '@/components/SmartIntakeWizard'
import VideoTestimonials, {type VideoTestimonial} from '@/components/landing/VideoTestimonials'
import {getProjects, getVerifiedClaims} from '@/lib/cms'
import {cmsImageUrl, fetchSanity, type CmsImageSource} from '@/lib/sanity'
import type {ProjectItem} from '@/lib/types'

// Advertentie-landingspagina voor de campagne "Totaalrenovatie Den Haag e.o.".
// Eén pagina, geen menu, één actie. De kop past zich aan de advertentiegroep
// aan via ?v=aannemer | woning | kosten (message match met de advertentie).
// Niet in Google indexeren: dit is een advertentiepagina, geen SEO-pagina.

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Totaalrenovatie in Den Haag en omgeving | DRO Renovaties',
  description:
    `Totaalrenovatie van uw woning door een Haags familiebedrijf met vaste vakteams. ${BUSINESS.reviews.ratingValue.toLocaleString('nl-NL')} uit ${BUSINESS.reviews.reviewCount}+ Google-reviews. Vraag vrijblijvend een bezichtiging aan.`,
  robots: {index: false, follow: true},
  alternates: {canonical: '/totaalrenovatie-den-haag'},
}

// Prijsindicatie inclusief btw (vuistregel € 1.000 tot € 1.250 per m² excl. btw).
// LET OP: pas live zetten na akkoord van Therab op deze bedragen.
const PRICE_MIN_INCL = 1210
const PRICE_MAX_INCL = 1510

const PHONE_LABEL = '085 087 1814'
const PHONE_HREF = 'tel:+31850871814'
const REVIEW_SCORE = BUSINESS.reviews.ratingValue.toLocaleString('nl-NL')
const REVIEW_COUNT = `${BUSINESS.reviews.reviewCount}+`
// Trustoo-cijfer en reactietijd komen uit Sanity (Site Settings > Geverifieerde
// claims) en verschijnen alleen als ze daar zijn bevestigd. Zonder bevestiging
// tonen we de Google-score en 'zo snel mogelijk'.

type Variant = 'aannemer' | 'woning' | 'kosten'

const HERO: Record<Variant, {title: string; intro: string}> = {
  aannemer: {
    title: 'Uw renovatie-aannemer in Den Haag',
    intro:
      'Totaalrenovaties van € 50.000 tot € 150.000, uitgevoerd door een Haags familiebedrijf met vaste vakteams. Van sloop tot oplevering, met één vast aanspreekpunt.',
  },
  woning: {
    title: 'Totaalrenovatie van uw woning in Den Haag',
    intro:
      'Net een woning gekocht of al jaren eigenaar: wij renoveren uw hele woning in één traject. Jaren-30-woning, herenhuis of appartement, van sloop en installaties tot afwerking.',
  },
  kosten: {
    title: 'Wat kost een totaalrenovatie in Den Haag?',
    intro: `Indicatief € ${PRICE_MIN_INCL.toLocaleString('nl-NL')} tot € ${PRICE_MAX_INCL.toLocaleString('nl-NL')} per m², inclusief btw. De exacte prijs hangt af van uw woning: na een bezichtiging krijgt u een offerte op maat.`,
  },
}

const PROOF_REST = [
  'Vaste vakteams en één vast aanspreekpunt voor de afstemming',
  'Elke week een vast meetmoment, vragen binnen 24 uur opgepakt',
  'VCA-gecertificeerd en CAR-verzekerd',
]

const STEPS = [
  {title: 'Kennismaking', text: 'Een verbouwadviseur belt u om uw plannen door te nemen en plant een bezichtiging.'},
  {title: 'Bezichtiging en offerte', text: 'Een verbouwadviseur komt langs, bespreekt uw wensen en maakt een offerte op maat.'},
  {title: 'Planning en betaalschema', text: 'Bij akkoord krijgt u een planning en een betaalschema per fase, vooraf op papier.'},
  {title: 'Uitvoering', text: 'Onze vaste ploegen voeren het werk uit. Elke week een vast meetmoment met u.'},
  {title: 'Oplevering', text: 'We lopen het werk samen met u na voordat we opleveren.'},
]

const FAQ = [
  {
    q: 'Wat kost een totaalrenovatie?',
    a: `Als indicatie rekenen we € ${PRICE_MIN_INCL.toLocaleString('nl-NL')} tot € ${PRICE_MAX_INCL.toLocaleString('nl-NL')} per m², inclusief btw. Voor een woning van 100 m² is dat dus ongeveer € ${(PRICE_MIN_INCL * 100).toLocaleString('nl-NL')} tot € ${(PRICE_MAX_INCL * 100).toLocaleString('nl-NL')}. De staat van de woning, installaties en uw afwerkingswensen bepalen waar u uitkomt.`,
  },
  {
    q: 'Hoe werkt de betaling?',
    a: 'Voor aanvang van de werkzaamheden leggen wij het betalingsschema vast in de offerte. Betalingen worden gekoppeld aan de afgesproken projectfasen. Eventuele startbetalingen en afwijkende afspraken worden vooraf schriftelijk vastgelegd. U kent de fases en bedragen dus voordat u tekent.',
  },
  {
    q: 'Heb ik een vergunning nodig?',
    a: 'Voor een renovatie binnen de bestaande woning meestal niet. Bij wijzigingen aan de constructie, de gevel of bij een monument soms wel. We werken met vaste constructeurs en architecten en zoeken dit voor u uit.',
  },
  {
    q: 'Kan ik tijdens de renovatie in de woning blijven?',
    a: 'Bij een totaalrenovatie is dat meestal niet praktisch. We bespreken het bij de bezichtiging en stemmen de planning af op uw situatie, bijvoorbeeld op de datum waarop u de sleutel krijgt.',
  },
  {
    q: 'Net een woning gekocht?',
    a: 'Dan is een bouwkundige keuring een goede eerste stap. Het rapport kost € 399 en is gratis als wij daarna de renovatie uitvoeren.',
  },
  {
    q: 'In welke plaatsen werken jullie?',
    a: 'Den Haag, Rijswijk, Leidschendam-Voorburg, Wassenaar, Delft, Zoetermeer en omgeving.',
  },
]

function sizedImage(url: string, width: number): string {
  if (!url.includes('cdn.sanity.io') || /[?&]w=/.test(url)) return url
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}&auto=format&q=70`
}

// Vaste keuze: totaalrenovaties uit de regio met een sterke voor-en-nafoto.
// Ontbreekt er een, dan vult de score aan: eerst totaalrenovaties, dan grote
// verbouwingen, regio Den Haag e.o. voorrang.
const FEATURED_PROJECTS = ['jan-muschlaan-den-haag', 'essehout-zoetermeer', 'fuutlaan-leidschendam']
const PROJECT_TYPE_PRIORITY = [/totaal/i, /dakopbouw|aanbouw|uitbouw/i]
const REGION = /den haag|rijswijk|leidschendam|voorburg|wassenaar|delft|zoetermeer/i

function projectScore(p: ProjectItem): number {
  const type = p.type || ''
  const typeIdx = PROJECT_TYPE_PRIORITY.findIndex((re) => re.test(type))
  const typeScore = typeIdx === -1 ? 0 : (PROJECT_TYPE_PRIORITY.length - typeIdx) * 10
  return typeScore + (REGION.test(`${p.location || ''} ${p.title}`) ? 5 : 0)
}

function pickProjects(projects: ProjectItem[]): ProjectItem[] {
  const usable = projects.filter((p) => (p.beforeImage && p.afterImage) || p.images?.[0])
  return usable
    .map((p, i) => {
      const featured = FEATURED_PROJECTS.indexOf(p.slug)
      const score = featured === -1 ? projectScore(p) + (p.beforeImage && p.afterImage ? 2 : 0) : 1000 - featured
      return {p, i, score}
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 3)
    .map(({p}) => p)
}

const COMPARE = [
  {
    topic: 'Aanspreekpunt',
    self: 'Per vak een andere partij die u zelf op elkaar afstemt',
    dro: 'Eén vast aanspreekpunt van bezichtiging tot oplevering',
  },
  {
    topic: 'Planning',
    self: 'Wachten op elkaar, gaten tussen de vakken',
    dro: 'Eén planning, vooraf op papier, met vaste ploegen die op elkaar aansluiten',
  },
  {
    topic: 'Prijs',
    self: 'Losse offertes die moeilijk te vergelijken zijn',
    dro: 'Eén offerte op maat met een betaalschema per fase',
  },
  {
    topic: 'Tijdens het werk',
    self: 'Zelf achter vragen en problemen aan',
    dro: 'Elke week een vast meetmoment, vragen binnen 24 uur opgepakt',
  },
  {
    topic: 'Na afloop',
    self: 'Bij een gebrek wijzen partijen naar elkaar',
    dro: 'Eén partij die verantwoordelijk is voor het geheel',
  },
]

// Teamfoto van de vaste ploegen (Dropbox, Landingspagina totaalrenovatie).
const TEAM_PHOTO = {url: '/landing/team-dro.jpg', title: 'Het team van DRO Renovaties', caption: 'Onze vaste ploegen'}

type TeamPhoto = {image?: CmsImageSource | null; title?: string | null}

// Teamfoto uit de CMS (blok "aboutTeamImageBlock" op een pagina). Faalt stil:
// zonder foto verschijnt de sectie zonder beeld.
async function getTeamPhoto(): Promise<{url: string; title: string} | null> {
  try {
    const data = await fetchSanity<TeamPhoto | null>(
      `*[_type == "page" && count(blocks[_type == "aboutTeamImageBlock"]) > 0][0].blocks[_type == "aboutTeamImageBlock"][0]{"image": teamImage{image, externalImageUrl}, "title": teamImageTitle}`,
      {},
      {revalidate: 3600}
    )
    const url = cmsImageUrl(data?.image ?? null, 1200)
    return url ? {url, title: data?.title || 'Het team van DRO Renovaties'} : null
  } catch {
    return null
  }
}

function pickVariant(value: string | string[] | undefined): Variant {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'woning' || v === 'kosten' ? v : 'aannemer'
}

// Typografie: koppen breed (font-stretch) en stevig, tekst normaal.
// Rekenvoorbeeld van een betalingsschema per fase bij een gemiddelde
// totaalrenovatie. Alleen een voorbeeld: het echte schema verschilt per project
// en staat vooraf in de offerte (besluit 22-10-2026, keuze B; AV art. 8.1).
const EXAMPLE_TOTAL = 120000
const EXAMPLE_WEEKS = 13
const EXAMPLE_PHASES = [
  {step: 'Start', weeks: 'Dag 1', pct: 20, work: 'Woning afgeschermd, materialen besteld'},
  {step: 'Sloop en casco', weeks: 'Week 1 tot 3', pct: 20, work: 'Slopen, muur eruit met stalen balk, afvoer'},
  {step: 'Installaties', weeks: 'Week 4 tot 7', pct: 25, work: 'Elektra en groepenkast, water, afvoer, verwarming'},
  {step: 'Afbouw', weeks: 'Week 8 tot 12', pct: 25, work: 'Stucwerk, tegels, sanitair, deuren, vloeren, keuken'},
  {step: 'Oplevering', weeks: 'Week 13', pct: 10, work: 'Samen elke ruimte nalopen, puntjes af'},
]

const GRIP = [
  {title: 'Eén vast aanspreekpunt', text: 'Voor de afstemming, met vaste rollen voor techniek en betalingen.', icon: 'person'},
  {title: 'Elke week een vast meetmoment', text: 'U ziet de voortgang en stelt uw vragen op een vast moment.', icon: 'calendar'},
  {title: 'Vragen binnen 24 uur opgepakt', text: 'Via de app, ook tussen de meetmomenten door.', icon: 'chat'},
  {title: 'Vaste vakteams', text: 'Vakmensen die op elkaar ingespeeld zijn, met één planning.', icon: 'house'},
  {title: 'Verzekerd', text: 'DRO heeft een CAR- en een bedrijfsaansprakelijkheidsverzekering.', icon: 'shield'},
] as const

const ICON_PATHS: Record<string, string[]> = {
  person: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6'],
  calendar: ['M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M3 10h18', 'M8 3v4', 'M16 3v4'],
  chat: ['M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z'],
  house: ['M3 21h18', 'M5 21V10l7-5 7 5v11', 'M9 21v-6h6v6'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
}

// Keurmerken en verzekeraar. Logo's in /public/landing/logos/; zolang een
// bestand ontbreekt (src leeg), toont de pagina alleen de naam.
const LOGOS = [
  {name: 'Goudse Verzekeringen', src: '/landing/logos/logo-goudse.png', text: 'Onze verzekeraar voor de CAR- en aansprakelijkheidsverzekering.'},
  {name: 'VCA', src: '/landing/logos/logo-vca.png', text: 'Gecertificeerd voor veilig werken op de bouw.'},
  {name: 'VLOK', src: '/landing/logos/logo-vlok.png', text: 'Erkend voor werk aan airco- en warmtepompsystemen.'},
  {name: 'SBB', src: '/landing/logos/logo-sbb.png', text: 'Erkend leerbedrijf: wij leiden zelf vakmensen op.'},
]

// Klantvideo's (alleen tonen met schriftelijke toestemming van de klant).
// Bestanden in /public/landing/video/ of op een video-CDN. Leeg = sectie verborgen.
// Ondertiteling zit in het beeld gebrand, dus geen apart .vtt-bestand nodig.
// Citaten letterlijk uit de video's overgenomen.
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

// Verplichte toelichting bij reviews (Omnibus/ACM). Vul de controle-zin aan
// zodra vaststaat hoe DRO controleert of reviews van echte klanten komen.
const REVIEW_POLICY = 'Wij tonen reviews zoals ze op Google en Trustoo staan, zonder ze aan te passen.'
const GOOGLE_REVIEWS_URL = ''

const SCENARIO_M2 = [80, 100, 120]

// Echte Google-reviews, letterlijk overgenomen (naam, datum en project zoals op Google).
type StaticReview = {name: string; date: string; project: string; quote: string}
const GOOGLE_REVIEWS: StaticReview[] = [
  {name: 'Allama', date: '13 mei 2026', project: 'Totaalrenovatie', quote: 'We zijn erg tevreden. Het team was professioneel, kwam alle afspraken na en startte het werk steeds op tijd.'},
  {name: 'Kaylee', date: '1 apr 2026', project: 'Badkamer en toilet', quote: 'Onze badkamer en toilet laten renoveren door DRO. Super hard werkende mensen, goede communicatie en alles is netjes afgewerkt.'},
  {name: 'Anil', date: '14 mei 2026', project: 'Badkamer en wc renovatie', quote: 'Ik ben ontzettend tevreden over het werk van DRO Renovaties. Mijn badkamer en wc zijn volledig gerenoveerd en werkelijk prachtig geworden. Alles verliep professioneel en duidelijk.'},
]
const TRUSTOO_SOURCES = 'Trustoo, Google, Werkspot en Facebook'
const TRUSTOO_BADGES = [
  {src: '/landing/logos/trustoo-toppro.png', alt: 'Trustoo Top Pro 2026'},
  {src: '/landing/logos/trustoo-topscore.png', alt: 'Trustoo Top Score 2026'},
]
const STAR = 'text-[#F5B301]'

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

function PullQuote({review, wide}: {review: StaticReview; wide?: boolean}) {
  return (
    <figure className={`m-0 border-l-[3px] border-lp-orange pl-4 ${wide ? 'mt-10 max-w-3xl' : 'mt-6'}`}>
      <blockquote className={wide ? 'text-[20px] font-semibold leading-[1.45] text-lp-ink' : 'text-[17px] font-medium leading-[1.5] text-lp-ink'}>
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-2 text-[13px] text-lp-muted">
        <span aria-label="5 van 5 sterren" className={`${STAR} mr-1.5 tracking-[1px]`}>★★★★★</span>
        {review.name}, Den Haag, {review.project.toLowerCase()}, Google-review
      </figcaption>
    </figure>
  )
}

function Icon({name}: {name: string}) {
  return (
    <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-lp-plaster text-lp-ink">
      <svg fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" width="15">
        {(ICON_PATHS[name] || []).map((d) => (
          <path d={d} key={d} />
        ))}
      </svg>
    </span>
  )
}

const euro = (n: number) => `€ ${n.toLocaleString('nl-NL')}`

const H1 = 'font-bold tracking-[-0.035em] leading-[1.06] text-lp-ink'
const H2 =
  'text-[26px] sm:text-[32px] font-bold tracking-[-0.01em] leading-[1.1] after:mt-3 after:block after:h-[3px] after:w-12 after:rounded-full after:bg-lp-orange'

// Snelmenu bovenin: springt naar de onderdelen van deze pagina.
const NAV = [
  {href: '#grip', label: 'Zo houdt u grip'},
  {href: '#prijs', label: 'Prijs'},
  {href: '#projecten', label: 'Projecten'},
  {href: '#ervaringen', label: 'Ervaringen'},
  {href: '#werkwijze', label: 'Werkwijze'},
  {href: '#vragen', label: 'Vragen'},
]
const BODY = 'text-[16px] leading-[1.65] text-lp-muted'

// Achtergrond van de kop: een opgeleverde totaalrenovatie (woonkamer Fuutlaan),
// anders de eerste uitgelichte totaalrenovatie, anders het eerste project met foto.
const HERO_PROJECTS = ['fuutlaan-leidschendam', 'essehout-zoetermeer']

function heroImageOf(projects: ProjectItem[]): string | null {
  const project =
    HERO_PROJECTS.map((slug) => projects.find((p) => p.slug === slug && p.afterImage)).find(Boolean) ||
    projects.find((p) => p.afterImage) ||
    projects.find((p) => p.images?.[0])
  const url = project?.afterImage || project?.images?.[0]
  return url ? sizedImage(url, 1800) : null
}

export default async function TotaalrenovatieLandingPage(
  props: {
    searchParams: Promise<{[key: string]: string | string[] | undefined}>
  }
) {
  const searchParams = await props.searchParams;
  const variant = pickVariant(searchParams.v)
  const hero = HERO[variant]
  const [projects, teamPhoto, claims] = await Promise.all([getProjects(), getTeamPhoto(), getVerifiedClaims()])
  const trustoo = claims.trustoo
  const responseSlot = claims.responseTime?.text || 'zo snel mogelijk'
  const responseLine = claims.responseTime ? `We nemen ${claims.responseTime.text} contact op` : 'We nemen zo snel mogelijk contact op'
  const PROOF = [
    trustoo ? `${trustoo.score} op Trustoo uit ${trustoo.count} reviews` : `${REVIEW_SCORE} uit ${BUSINESS.reviews.reviewCount} Google-reviews`,
    ...PROOF_REST,
  ]
  const shownProjects = pickProjects(projects)
  const heroImage = heroImageOf(projects)

  const proofItems = PROOF.map((item) => (
    <li className="flex items-start gap-3 text-[15px]" key={item}>
      <span aria-hidden="true" className="mt-[9px] h-[2px] w-4 shrink-0 bg-lp-orange" />
      {item}
    </li>
  ))

  let paidSoFar = 0
  const examplePhases = EXAMPLE_PHASES.map((phase) => {
    paidSoFar += phase.pct
    return {...phase, amount: (EXAMPLE_TOTAL * phase.pct) / 100, cumulative: paidSoFar}
  })

  const gripSection = (
    <section className="scroll-mt-28 border-t border-lp-line" id="grip">
      <div className="section-shell py-14">
        <h2 className={`${H2} max-w-[24ch]`}>Zo houdt u grip op uw renovatie</h2>
        <p className={`mt-3 max-w-[62ch] ${BODY}`}>
          Bij een project van deze omvang wilt u weten waar uw geld naartoe gaat en wie u kunt bellen. Dit staat vooraf vast,
          op papier.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-lp-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-lp-line px-5 py-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-lp-orange">Rekenvoorbeeld</p>
              <h3 className="mt-0.5 text-[18px] font-bold">Totaalrenovatie jaren 30-woning, 100 m²</h3>
              <p className="text-sm text-lp-muted">
                {euro(EXAMPLE_TOTAL)} inclusief btw &middot; {EXAMPLE_WEEKS} weken werk
              </p>
            </div>
            <p className="max-w-[44ch] text-[15px] leading-snug">
              <span className="font-bold">Het betalingsschema staat vooraf in uw offerte.</span> Betalingen zijn gekoppeld aan de
              projectfasen. Een eventuele startbetaling staat er ook in, schriftelijk en voordat u tekent.
            </p>
          </div>

          <ol
            aria-label="Betaalmomenten in het rekenvoorbeeld"
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-5 md:overflow-visible"
          >
            {examplePhases.map((phase, i) => {
              const first = i === 0
              return (
                <li
                  className={`flex min-w-[168px] snap-start flex-col border-lp-line px-4 py-4 md:min-w-0 ${i > 0 ? 'border-l' : ''} ${first ? 'bg-lp-orange/[0.06]' : ''}`}
                  key={phase.step}
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[12px] font-bold tabular-nums ${first ? 'bg-lp-orange text-white' : 'border-2 border-lp-orange text-lp-orange'}`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.06em] text-lp-muted">{phase.weeks}</span>
                  </div>
                  <p className="mt-2 font-semibold leading-tight">{phase.step}</p>
                  <p className={`mt-1 text-[24px] font-bold leading-none tabular-nums ${first ? 'text-lp-orange' : ''}`}>
                    {euro(phase.amount)}
                  </p>
                  <p className="mt-1 text-[12px] text-lp-muted">{`${phase.pct}% van het totaal`}</p>
                  <p className="mt-3 text-[13px] leading-[1.45] text-lp-muted">{phase.work}</p>
                  <div className="mt-auto pt-4">
                    <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-lp-line">
                      <div className="h-full rounded-full bg-lp-orange" style={{width: `${phase.cumulative}%`}} />
                    </div>
                    <p className="mt-1.5 text-[12px] tabular-nums text-lp-muted">Totaal betaald {phase.cumulative}%</p>
                  </div>
                </li>
              )
            })}
          </ol>

          <p className="border-t border-lp-line px-5 py-3 text-[13px] text-lp-muted">
            Voorbeeld. Uw eigen fases, bedragen en planning staan in uw offerte, voordat u tekent.
            <span className="md:hidden"> Veeg opzij voor alle fases.</span>
          </p>
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
          {GRIP.map((item) => (
            <li className="grid grid-cols-[28px_minmax(0,1fr)] gap-3" key={item.title}>
              <Icon name={item.icon} />
              <div>
                <span className="block font-semibold leading-snug">{item.title}</span>
                <span className="text-sm text-lp-muted">{item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )

  const priceSection = (
    <section className="scroll-mt-28 border-t border-lp-line bg-lp-plaster" id="prijs">
      <div className="section-shell py-14">
        <h2 className={H2}>Wat kost een totaalrenovatie?</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.15fr] md:items-start">
          <div>
            <p className="text-sm text-lp-muted">Indicatie per m², inclusief btw</p>
            <p className="mt-2 text-[40px] font-bold leading-none tabular-nums sm:text-[52px]">
              {euro(PRICE_MIN_INCL)}
              <span className="px-2 text-[0.5em] font-semibold text-lp-muted">tot</span>
              {PRICE_MAX_INCL.toLocaleString('nl-NL')}
            </p>
            <table className="mt-5 w-full border-collapse text-[15px] tabular-nums">
              <caption className="pb-1 text-left text-[13px] text-lp-muted">Rekenvoorbeelden, geen offerte</caption>
              <thead>
                <tr className="border-b border-lp-line text-left">
                  <th className="py-2.5 pr-3 font-semibold" scope="col">Woning</th>
                  <th className="py-2.5 text-right font-semibold" scope="col">Indicatie incl. btw</th>
                </tr>
              </thead>
              <tbody>
                {SCENARIO_M2.map((m2) => (
                  <tr className="border-b border-lp-line" key={m2}>
                    <td className="py-2.5 pr-3">{m2} m²</td>
                    <td className="py-2.5 text-right">
                      {euro(PRICE_MIN_INCL * m2)} tot {euro(PRICE_MAX_INCL * m2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={BODY}>
            <p className="text-lp-ink">Waar u binnen die bandbreedte uitkomt, hangt vooral af van:</p>
            <ul className="mt-3 space-y-2 border-l-2 border-lp-orange pl-4">
              <li>de staat van de woning en de installaties: leidingen, elektra, verwarming</li>
              <li>of er constructief iets verandert, zoals een muur die eruit gaat</li>
              <li>uw keuzes in afwerking, keuken en badkamer</li>
            </ul>
            <p className="mt-4">Na de bezichtiging krijgt u een offerte op maat, met de fases en termijnen van het betaalschema erin.</p>
            <PullQuote review={GOOGLE_REVIEWS[1]} />
            <a className="mt-5 inline-flex min-h-[48px] items-center rounded-btn bg-lp-orange px-6 font-semibold text-white transition-colors hover:bg-lp-orange-hover shadow-cta" href="#aanvraag">
              Bezichtiging aanvragen
            </a>
          </div>
        </div>
      </div>
    </section>
  )

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
            <a
              className="hidden min-h-[40px] items-center rounded-md px-3 text-[14px] font-semibold text-lp-orange underline-offset-2 hover:underline sm:inline-flex"
              href="/"
            >
              Bezoek onze website
            </a>
            <a
              className="inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-lp-orange px-4 text-[15px] font-semibold text-white transition-colors hover:bg-lp-orange-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-orange shadow-cta"
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

      <section className="bg-lp-plaster text-lp-ink" id="aanvraag">
        <div className="section-shell grid gap-10 py-10 md:grid-cols-[1.05fr_1fr] md:items-center md:py-16">
          <div>
            <h1 className={`${H1} text-[34px] sm:text-[46px] lg:text-[50px]`}>{hero.title.replace('Den Haag', 'Den\u00a0Haag')}</h1>
            <p className="mt-5 max-w-[34em] text-[17px] leading-[1.6] text-lp-muted">{hero.intro}</p>
            <ul className="mt-7 hidden gap-3 text-lp-ink md:grid">{proofItems}</ul>
            {heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Opgeleverd project van DRO Renovaties" className="mt-8 hidden aspect-[16/9] w-full rounded-img object-cover shadow-img md:block" fetchPriority="high" src={heroImage} />
            )}
          </div>
          <div className="text-lp-ink">
            <SmartIntakeWizard
              largeBudget={[50000, 100000]}
              responsePromise={responseSlot}
              serviceOrder={['Totaalrenovatie', 'Aanbouw of opbouw', 'Badkamer', 'Keuken', 'Dakkapel']}
              servicesSub="Kies één of meer onderdelen. Daarna stellen we alleen de vragen die bij uw verbouwing horen."
              servicesTitle="Wat wilt u verbouwen?"
              skipIds={['found']}
              source="lp-totaalrenovatie"
              thanksLinks={[
                {href: '/over-ons', label: 'Over DRO Renovaties'},
                {href: '/projecten', label: 'Bekijk onze projecten'},
                {href: '/werkwijze', label: 'Onze werkwijze'},
              ]}
              variant={variant}
            />
            <p className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-lp-muted">
              {trustoo && <span className="font-semibold text-lp-ink"><span aria-hidden="true" className={STAR}>★</span> {trustoo.score} Trustoo</span>}
              <span className="font-semibold text-lp-ink"><span aria-hidden="true" className={STAR}>★</span> {REVIEW_SCORE} Google</span>
              <span>VCA-gecertificeerd</span>
              <span>{responseLine}</span>
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Beoordelingen en beloften" className="bg-lp-plaster">
        <dl className="section-shell grid grid-cols-2 items-start gap-x-6 gap-y-5 py-6 lg:grid-cols-5">
          {trustoo && (
          <div>
            <dt className="text-[13px] text-lp-muted">Trustoo</dt>
            <dd className="mt-0.5 text-[20px] font-bold tabular-nums">
              {trustoo.score}/10{' '}
              <span className="text-[14px] font-normal text-lp-muted">{trustoo.count} reviews</span>
            </dd>
          </div>
          )}
          <div>
            <dt className="text-[13px] text-lp-muted">Google</dt>
            <dd className="mt-0.5 text-[20px] font-bold tabular-nums">
              {REVIEW_SCORE}<span className="text-lp-orange"> ★</span>{' '}
              <span className="text-[14px] font-normal text-lp-muted">{REVIEW_COUNT} reviews</span>
            </dd>
          </div>
          {trustoo && (
          <div>
            <dt className="text-[13px] text-lp-muted">Onderscheiden in 2026</dt>
            <dd className="mt-1 flex min-h-[44px] items-center gap-2">
              {TRUSTOO_BADGES.map((badge) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={badge.alt} className="h-11 w-auto" key={badge.src} src={badge.src} />
              ))}
            </dd>
          </div>
          )}
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
            <dd className="mt-0.5 text-[17px] font-semibold">{responseLine}</dd>
          </div>
        </dl>
      </section>

      <section className="section-shell py-8 md:hidden">
        <ul className="grid gap-3">{proofItems}</ul>
      </section>

      {variant === 'kosten' ? (
        <>
          {priceSection}
          {gripSection}
        </>
      ) : (
        <>
          {gripSection}
          {priceSection}
        </>
      )}

      {shownProjects.length > 0 && (
        <section className="scroll-mt-28 border-t border-lp-line" id="projecten">
          <div className="section-shell py-14">
            <h2 className={H2}>Voor en na: projecten in de regio</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {shownProjects.map((project) => {
                const hasBeforeAfter = Boolean(project.beforeImage && project.afterImage)
                const facts = [
                  ['Plaats', project.location?.trim()],
                  ['Type', project.type?.trim()],
                  ['Doorlooptijd', project.duration?.trim()],
                ].filter(([, v]) => Boolean(v))
                return (
                  <article key={project.slug}>
                    {hasBeforeAfter ? (
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
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={project.title} className="aspect-[4/3] w-full rounded-lg bg-lp-plaster object-cover" decoding="async" loading="lazy" src={sizedImage(project.images[0], 900)} />
                    )}
                    <h3 className="mt-3 text-[17px] font-semibold">{project.title}</h3>
                    {facts.length > 0 && (
                      <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5 text-sm">
                        {facts.map(([k, v]) => (
                          <div className="contents" key={k}>
                            <dt className="text-lp-muted">{k}</dt>
                            <dd className="m-0">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <a
                      className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-lp-orange px-4 text-[15px] font-semibold text-lp-orange transition-colors hover:bg-lp-orange hover:text-white shadow-cta"
                      href={`/projecten/${project.slug}`}
                    >
                      Bekijk project
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {TESTIMONIALS.length > 0 && (
        <section className="scroll-mt-28 border-t border-lp-line bg-lp-plaster" id="ervaringen">
          <div className="section-shell py-14 md:text-center">
            <h2 className={`${H2} md:after:mx-auto`}>Klanten vertellen het zelf</h2>
            <p className="mt-3 max-w-2xl text-lp-muted md:mx-auto">
              Geen acteurs, geen script. Klanten in hun eigen huis, na de oplevering. Met ondertiteling, dus ook zonder geluid te volgen.
            </p>
            <VideoTestimonials items={TESTIMONIALS} />
          </div>
        </section>
      )}

      <section className="scroll-mt-28 border-t border-lp-line" id="reviews">
        <div className="section-shell py-14">
          <h2 className={H2}>Wat klanten over ons zeggen</h2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[300px_1fr]">
            {trustoo ? (
            <aside aria-label="Trustoo-score" className="rounded-lg border border-lp-line bg-white p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Trustoo" className="h-7 w-auto" src="/landing/logos/trustoo-logo.png" />
              <p className="mt-3.5 text-[56px] font-extrabold leading-none tabular-nums">
                {trustoo.score}
                <span className="text-[20px] font-medium text-lp-muted">/10</span>
              </p>
              <span className="mt-1.5 inline-block rounded-full bg-[#1F1A4A] px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-[0.06em] text-white">
                Uitstekend
              </span>
              <p className="mt-3 text-[14px] text-lp-muted">
                {trustoo.count} reviews (stand {trustoo.asOf}).
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
            ) : (
            <aside aria-label="Google-score" className="rounded-lg border border-lp-line bg-white p-6">
              <p className="text-[56px] font-extrabold leading-none tabular-nums">
                {REVIEW_SCORE}
                <span className="text-[20px] font-medium text-lp-muted"> ★</span>
              </p>
              <p className="mt-3 text-[14px] text-lp-muted">Op Google, {REVIEW_COUNT} reviews.</p>
            </aside>
            )}
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
                  <p aria-label="5 van 5 sterren" className={`mt-3 tracking-[2px] ${STAR}`}>★★★★★</p>
                  <blockquote className="mt-2 flex-1 text-[15px] leading-[1.6]">&ldquo;{review.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3.5 border-t border-lp-line pt-2.5 text-[13px] text-lp-muted">Project: {review.project}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          {GOOGLE_REVIEWS_URL && (
            <a className="mt-6 inline-block font-semibold underline underline-offset-2" href={GOOGLE_REVIEWS_URL} rel="noopener" target="_blank">
              Lees alle reviews op Google
            </a>
          )}
          <p className="mt-6 max-w-[70ch] text-[13px] text-lp-muted">
            <span className="font-semibold">Over deze reviews.</span> {REVIEW_POLICY}
          </p>
        </div>
      </section>

      <section className="scroll-mt-28 border-t border-lp-line bg-lp-plaster" id="werkwijze">
        <div className="section-shell py-14">
          <h2 className={H2}>Zo werken we</h2>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-5 md:gap-6">
            <span aria-hidden="true" className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-[2px] bg-lp-orange/30 md:left-0 md:top-[15px] md:h-[2px] md:w-full" />
            {STEPS.map((step, i) => (
              <li className="relative pl-12 md:pl-0 md:pt-12" key={step.title}>
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-lp-orange text-sm font-bold text-white tabular-nums">
                  {i + 1}
                </span>
                <h3 className="text-[17px] font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-lp-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <PullQuote review={GOOGLE_REVIEWS[0]} wide />
        </div>
      </section>

      <section className="border-t border-lp-line">
        <div className="section-shell py-14">
          <figure className="relative mb-10 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={teamPhoto?.title || TEAM_PHOTO.title}
              className="aspect-[4/3] w-full bg-lp-plaster object-cover object-[center_65%] sm:aspect-[16/8]"
              decoding="async"
              loading="lazy"
              src={TEAM_PHOTO.url}
            />
            <figcaption className="absolute bottom-3 left-3 rounded bg-lp-ink/80 px-2.5 py-1 text-[13px] font-semibold text-white">
              {TEAM_PHOTO.caption}
            </figcaption>
          </figure>
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className={H2}>Een Haags familiebedrijf</h2>
              <p className={`mt-4 max-w-[60ch] ${BODY}`}>
                DRO Renovaties is gegroeid uit een familiebouwbedrijf. We werken met vaste
                vakteams, eigen opslag en vaste leveranciers, en met een vast netwerk van constructeurs en architecten. U heeft
                één aanspreekpunt van de eerste bezichtiging tot de oplevering.
              </p>
            </div>
            <ul className="grid content-start gap-3 text-[15px] md:border-l md:border-lp-line md:pl-8">
              <li>Kantoor aan de Orionstraat 235 in Den Haag</li>
              <li>Vaste vakteams en eigen opslag</li>
              <li>Vast netwerk van constructeurs en architecten</li>
            </ul>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
            {LOGOS.map((logo) => (
              <li key={logo.name}>
                <div className="flex h-[104px] items-center justify-center rounded-lg border border-lp-line bg-white px-5 py-2.5">
                  {logo.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={logo.name} className="max-h-full max-w-full object-contain" loading="lazy" src={logo.src} />
                  ) : (
                    <span className="text-center text-[17px] font-bold">{logo.name}</span>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-[1.45] text-lp-muted">{logo.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-lp-line">
        <div className="section-shell py-14">
          <h2 className={`${H2} max-w-[22ch]`}>Zelf partijen regelen, of alles bij één aannemer?</h2>
          <p className={`mt-3 max-w-[60ch] ${BODY}`}>
            Bij een totaalrenovatie werken vaak vijf of meer vakgebieden in uw woning. Het verschil zit in wie dat regelt.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-lp-ink text-[14px]">
                  <th className="w-[20%] py-3 pr-4 font-semibold" scope="col"><span className="sr-only">Onderwerp</span></th>
                  <th className="py-3 pr-6 font-semibold text-lp-muted" scope="col">Zelf partijen regelen</th>
                  <th className="bg-lp-plaster px-4 py-3 font-semibold" scope="col">Met DRO Renovaties</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr className="border-b border-lp-line" key={row.topic}>
                    <th className="py-4 pr-4 align-top font-semibold" scope="row">{row.topic}</th>
                    <td className="py-4 pr-6 align-top text-lp-muted">{row.self}</td>
                    <td className="bg-lp-plaster px-4 py-4 align-top font-medium">{row.dro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  <span aria-hidden="true" className="text-2xl font-normal text-lp-orange transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className={`pb-5 ${BODY}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lp-slate text-white">
        <div className="section-shell flex flex-col items-start gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={H2}>Plannen voor een totaalrenovatie?</h2>
            <p className="mt-2 text-white/75">Vraag vrijblijvend een bezichtiging aan, of bel ons direct.</p>
            <p className="mt-2 text-[14px] text-white/85">
              <span aria-hidden="true" className={STAR}>★</span> {REVIEW_SCORE} op Google
              {trustoo && (
                <>
                  <span aria-hidden="true" className="mx-2 opacity-40">|</span>
                  {trustoo.score} op Trustoo uit {trustoo.count} reviews
                </>
              )}
              <span aria-hidden="true" className="mx-2 opacity-40">|</span>
              VCA-gecertificeerd
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap">
            <a className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-btn bg-lp-orange px-6 font-semibold transition-colors hover:bg-lp-orange-hover lg:flex-none" href="#aanvraag">
              Aanvraag starten
            </a>
            <a className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-btn border border-white/60 px-6 font-semibold transition-colors hover:bg-white hover:text-lp-ink lg:flex-none" href={PHONE_HREF}>
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
        <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-btn bg-lp-orange font-semibold text-white" href="#aanvraag">
          Aanvraag starten
        </a>
      </div>
    </main>
  )
}
