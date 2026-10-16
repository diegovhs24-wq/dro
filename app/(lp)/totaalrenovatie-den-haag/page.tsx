import type {Metadata} from 'next'
import LandingForm from '@/components/landing/LandingForm'
import {getProjects, getReviews} from '@/lib/cms'
import type {ProjectItem, ReviewItem} from '@/lib/types'

// Advertentie-landingspagina voor de campagne "Totaalrenovatie Den Haag e.o.".
// Eén pagina, geen menu, één actie. De kop past zich aan de advertentiegroep
// aan via ?v=aannemer | woning | kosten (message match met de advertentie).
// Niet in Google indexeren: dit is een advertentiepagina, geen SEO-pagina.

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Totaalrenovatie in Den Haag en omgeving | DRO Renovaties',
  description:
    'Totaalrenovatie van uw woning door een Haags familiebedrijf met vaste eigen ploegen. 4,8 uit 273+ Google reviews. Vraag vrijblijvend een bezichtiging aan.',
  robots: {index: false, follow: false},
  alternates: {canonical: '/totaalrenovatie-den-haag'},
}

// Prijsindicatie inclusief btw (vuistregel € 1.000 tot € 1.250 per m² excl. btw).
// LET OP: pas live zetten na akkoord van Therab op deze bedragen.
const PRICE_MIN_INCL = 1210
const PRICE_MAX_INCL = 1510

const PHONE_LABEL = '085 087 1814'
const PHONE_HREF = 'tel:+31850871814'
const REVIEW_SCORE = '4,8'
const REVIEW_COUNT = '273+'

type Variant = 'aannemer' | 'woning' | 'kosten'

const HERO: Record<Variant, {title: string; intro: string}> = {
  aannemer: {
    title: 'Uw renovatie-aannemer in Den Haag',
    intro:
      'Totaalrenovaties van € 50.000 tot € 150.000, uitgevoerd door een Haags familiebedrijf met vaste eigen ploegen. Van sloop tot oplevering, met één vast aanspreekpunt.',
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

const PROOF = [
  `${REVIEW_SCORE} sterren uit ${REVIEW_COUNT} Google reviews`,
  'Vaste eigen ploegen en één vast aanspreekpunt',
  'Elke week een vast meetmoment, vragen binnen 24 uur opgepakt',
  'VCA-gecertificeerd en CAR-verzekerd',
]

const STEPS = [
  {title: 'Kennismaking', text: 'Scott Huisman belt u om uw plannen door te nemen en plant een bezichtiging.'},
  {title: 'Bezichtiging en offerte', text: 'Therab Raja komt langs, bespreekt uw wensen en maakt een offerte op maat.'},
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
    a: 'U betaalt in termijnen volgens een betaalschema per fase. Dat schema ontvangt u vooraf, samen met de planning, zodat u precies weet wanneer welk bedrag komt.',
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
  if (!url.includes('cdn.sanity.io')) return url
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}&auto=format&q=70`
}

function pickProjects(projects: ProjectItem[]): ProjectItem[] {
  const withBeforeAfter = projects.filter((p) => p.beforeImage && p.afterImage)
  const withImage = projects.filter((p) => !(p.beforeImage && p.afterImage) && p.images?.[0])
  return [...withBeforeAfter, ...withImage].slice(0, 3)
}

function pickVariant(value: string | string[] | undefined): Variant {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'woning' || v === 'kosten' ? v : 'aannemer'
}

export default async function TotaalrenovatieLandingPage({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined}
}) {
  const variant = pickVariant(searchParams.v)
  const hero = HERO[variant]
  const [projects, reviews] = await Promise.all([getProjects(), getReviews()])
  const shownProjects = pickProjects(projects)
  const shownReviews = (reviews as ReviewItem[]).filter((r) => r.quote).slice(0, 3)

  const proofList = (
    <ul className="mt-5 grid gap-2">
      {PROOF.map((item) => (
        <li className="flex gap-2 text-[15px]" key={item}>
          <span aria-hidden="true" className="font-bold text-brand-orange">✓</span>
          {item}
        </li>
      ))}
    </ul>
  )

  const priceSection = (
    <section className="border-t border-brand-line bg-[#ffffff]" id="prijs">
      <div className="section-shell py-12">
        <h2 className="text-2xl font-semibold">Wat kost een totaalrenovatie?</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg border border-brand-line bg-brand-soft p-5">
            <p className="text-sm text-brand-stone">Indicatie per m², inclusief btw</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              € {PRICE_MIN_INCL.toLocaleString('nl-NL')} tot € {PRICE_MAX_INCL.toLocaleString('nl-NL')}
            </p>
            <p className="mt-3 text-sm text-brand-ink-soft">
              Woning van 100 m²: ongeveer € {(PRICE_MIN_INCL * 100).toLocaleString('nl-NL')} tot €{' '}
              {(PRICE_MAX_INCL * 100).toLocaleString('nl-NL')}.
            </p>
          </div>
          <div className="text-[15px] leading-7 text-brand-ink-soft">
            <p>Waar u binnen die bandbreedte uitkomt, hangt vooral af van:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>de staat van de woning en de installaties (leidingen, elektra, verwarming)</li>
              <li>of er constructief iets verandert, zoals een muur eruit</li>
              <li>uw keuzes in afwerking, keuken en badkamer</li>
            </ul>
            <p className="mt-3">Na de bezichtiging krijgt u een offerte op maat met een betaalschema per fase.</p>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <main className="pb-24 md:pb-0">
      {/* Topbalk: alleen logo-tekst, reviews en bellen. Geen menu. */}
      <header className="border-b border-brand-line bg-white">
        <div className="section-shell flex min-h-[60px] items-center justify-between gap-4">
          <span className="text-lg font-semibold tracking-tight">DRO Renovaties</span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-brand-ink-soft sm:inline">
              <span className="text-brand-orange">★</span> {REVIEW_SCORE} uit {REVIEW_COUNT} Google reviews
            </span>
            <a
              className="inline-flex min-h-[44px] items-center rounded-md border border-brand-ink px-3 text-sm font-semibold hover:bg-brand-ink hover:text-white"
              href={PHONE_HREF}
            >
              {PHONE_LABEL}
            </a>
          </div>
        </div>
      </header>

      {/* Bovenkant: kop, bewijs en het formulier direct zichtbaar. */}
      <section className="section-shell grid gap-8 py-8 md:grid-cols-[1.1fr_1fr] md:py-12" id="aanvraag">
        <div>
          <p className="text-sm font-medium text-brand-orange">Den Haag, Rijswijk, Voorburg, Wassenaar, Delft en Zoetermeer</p>
          <h1 className="mt-2 text-[28px] font-semibold leading-tight sm:text-4xl">{hero.title}</h1>
          <p className="mt-4 text-[16px] leading-7 text-brand-ink-soft">{hero.intro}</p>
          {/* Desktop: bewijs naast het formulier. Mobiel: onder het formulier, zodat het formulier hoger staat. */}
          <div className="hidden md:block">{proofList}</div>
        </div>
        <LandingForm phoneHref={PHONE_HREF} phoneLabel={PHONE_LABEL} variant={variant} />
        <div className="md:hidden">{proofList}</div>
      </section>

      {variant === 'kosten' && priceSection}

      {shownProjects.length > 0 && (
        <section className="border-t border-brand-line bg-[#ffffff]">
          <div className="section-shell py-12">
            <h2 className="text-2xl font-semibold">Recente projecten in de regio</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {shownProjects.map((project) => {
                const hasBeforeAfter = Boolean(project.beforeImage && project.afterImage)
                return (
                  <article className="overflow-hidden rounded-lg border border-brand-line bg-brand-soft" key={project.slug}>
                    {hasBeforeAfter ? (
                      <div className="grid grid-cols-2">
                        <figure className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt={`${project.title} voor`} className="aspect-[4/5] w-full object-cover" decoding="async" loading="lazy" src={sizedImage(project.beforeImage!, 400)} />
                          <figcaption className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-semibold">Voor</figcaption>
                        </figure>
                        <figure className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt={`${project.title} na`} className="aspect-[4/5] w-full object-cover" decoding="async" loading="lazy" src={sizedImage(project.afterImage!, 400)} />
                          <figcaption className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-semibold">Na</figcaption>
                        </figure>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={project.title} className="aspect-[4/3] w-full object-cover" decoding="async" loading="lazy" src={sizedImage(project.images[0], 800)} />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm text-brand-stone">
                        {[project.location, project.type, project.duration].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-brand-line">
        <div className="section-shell py-12">
          <h2 className="text-2xl font-semibold">Zo werken we</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {STEPS.map((step, i) => (
              <li className="rounded-lg border border-brand-line bg-white p-4" key={step.title}>
                <span className="text-sm font-semibold text-brand-orange">{i + 1}</span>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-brand-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {variant !== 'kosten' && priceSection}

      <section className="border-t border-brand-line">
        <div className="section-shell py-12">
          <h2 className="text-2xl font-semibold">
            {REVIEW_SCORE} uit {REVIEW_COUNT} Google reviews
          </h2>
          {shownReviews.length === 0 && (
            <p className="mt-3 text-[15px] leading-7 text-brand-ink-soft">
              Klanten beoordelen ons gemiddeld met {REVIEW_SCORE} sterren op Google, over {REVIEW_COUNT} reviews.
            </p>
          )}
          {shownReviews.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {shownReviews.map((review) => (
                <figure className="rounded-lg border border-brand-line bg-white p-5" key={`${review.name}-${review.quote.slice(0, 20)}`}>
                  <blockquote className="text-[15px] leading-7 text-brand-ink-soft">&ldquo;{review.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold">
                    {review.name}
                    {review.location ? <span className="font-normal text-brand-stone">, {review.location}</span> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-brand-line bg-[#ffffff]">
        <div className="section-shell grid gap-6 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Een Haags familiebedrijf</h2>
            <p className="mt-4 text-[15px] leading-7 text-brand-ink-soft">
              DRO Renovaties is gegroeid uit het bouwbedrijf van de vader van oprichter Therab Raja. We werken met vaste eigen
              ploegen, eigen opslag en vaste leveranciers, en met een vast netwerk van constructeurs en architecten. U heeft
              één aanspreekpunt van de eerste bezichtiging tot de oplevering.
            </p>
          </div>
          <ul className="grid content-start gap-2 text-[15px]">
            <li>VCA-gecertificeerd</li>
            <li>CAR-verzekerd en aansprakelijkheidsverzekerd</li>
            <li>SBB-erkend leerbedrijf</li>
            <li>Kantoor aan de Orionstraat in Den Haag</li>
          </ul>
        </div>
      </section>

      <section className="border-t border-brand-line">
        <div className="section-shell py-12">
          <h2 className="text-2xl font-semibold">Veelgestelde vragen</h2>
          <div className="mt-6 divide-y divide-brand-line rounded-lg border border-brand-line bg-white">
            {FAQ.map((item) => (
              <details className="group p-4" key={item.q}>
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-semibold">
                  {item.q}
                  <span aria-hidden="true" className="ml-4 text-brand-stone group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-7 text-brand-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-line bg-brand-ink text-white">
        <div className="section-shell flex flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Plannen voor een totaalrenovatie?</h2>
            <p className="mt-1 text-white/80">Vraag vrijblijvend een bezichtiging aan, of bel ons direct.</p>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md bg-brand-orange px-5 font-semibold md:flex-none" href="#aanvraag">
              Aanvraag starten
            </a>
            <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md border border-white px-5 font-semibold md:flex-none" href={PHONE_HREF}>
              Bel {PHONE_LABEL}
            </a>
          </div>
        </div>
      </section>

      <footer className="section-shell flex flex-wrap gap-x-6 gap-y-2 py-6 text-xs text-brand-stone">
        <span>DRO Bouw en Aannemingsbedrijf B.V. · Orionstraat 235, Den Haag · KvK 94825653</span>
        <a className="underline underline-offset-2" href="/privacypolicy">
          Privacyverklaring
        </a>
      </footer>

      {/* Vaste balk onderaan op mobiel: bellen of naar het formulier. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-brand-line bg-white p-3 md:hidden">
        <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md border border-brand-ink font-semibold" href={PHONE_HREF}>
          Bellen
        </a>
        <a className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md bg-brand-orange font-semibold text-white" href="#aanvraag">
          Aanvraag starten
        </a>
      </div>
    </main>
  )
}
