import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Partners from "@/components/Partners";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";

export const metadata: Metadata = {
  title: "Onze werkwijze | DRO Renovaties",
  description:
    "Zo werkt DRO Renovaties: van eerste idee tot oplevering met één aanspreekpunt, duidelijke planning en vaste teams."
};

const steps = [
  {
    title: "Idee",
    text: "U heeft een idee of wens. Wij denken direct met u mee.",
    note: "Alles begint met uw idee",
    icon: "idea"
  },
  {
    title: "Gesprek",
    text: "We bespreken uw situatie en geven eerlijk advies.",
    note: "Open en eerlijk advies",
    icon: "talk"
  },
  {
    title: "Plan",
    text: "U ontvangt een duidelijk plan en een transparante offerte.",
    note: "Duidelijk plan, geen verrassingen",
    icon: "checklist"
  },
  {
    title: "Uitvoering",
    text: "Ons team voert het werk uit volgens planning en afspraak.",
    note: "Vaste teams, strakke uitvoering",
    icon: "tools"
  },
  {
    title: "Oplevering",
    text: "We leveren netjes op. Alles gecontroleerd en afgerond.",
    note: "Oplevering met aandacht",
    icon: "delivery"
  }
] satisfies Array<{
  title: string;
  text: string;
  note: string;
  icon: SketchIconName;
}>;

const benefits = [
  { title: "Eén aanspreekpunt", icon: "contact" },
  { title: "Duidelijke planning", icon: "planning" },
  { title: "Korte communicatie", icon: "handshake" },
  { title: "Geen verrassingen", icon: "shield" },
  { title: "Strak resultaat", icon: "tools" }
] satisfies Array<{ title: string; icon: SketchIconName }>;

const trustPoints = [
  {
    title: "VCA gecertificeerd",
    text: "Onze monteurs zijn VCA gecertificeerd.",
    icon: "checklist",
    logo: "/vca-logo.svg"
  },
  {
    title: "Goed verzekerd",
    text: "Ons bedrijf beschikt over een CAR- en aansprakelijkheidsverzekering.",
    icon: "shield",
    logo: "/de-goudse-logo.svg"
  },
  {
    title: "Verantwoord uitgevoerd",
    text: "Zo weet u dat wij altijd kwalitatief en verantwoord werk leveren.",
    icon: "quality"
  }
] satisfies Array<{ title: string; text: string; icon: SketchIconName; logo?: string }>;

const faqItems = [
  {
    question: "Wat gebeurt er nadat ik mijn aanvraag heb gedaan?",
    answer: [
      "We nemen binnen 24 uur contact met u op. Soms dezelfde dag, soms de volgende werkdag.",
      "We kijken direct of uw project bij ons past. Zo ja, dan plannen we een gesprek in en gaan we inhoudelijk met u mee.",
      "Past het niet? Dan zeggen we dat ook gewoon eerlijk."
    ]
  },
  {
    question: "Hoe snel weet ik waar ik aan toe ben?",
    answer: [
      "Vrij snel. Na het eerste gesprek kunnen we al veel richting geven.",
      "Daarna ontvangt u een duidelijke offerte waarin staat wat we doen, hoe we het doen en wat het kost.",
      "Geen vage aannames. Gewoon concreet."
    ]
  },
  {
    question: "Wat als ik zelf nog geen compleet plan heb?",
    answer: [
      "Dat is normaal. De meeste projecten starten met een idee, niet met een uitgewerkt ontwerp.",
      "Wij helpen u dat idee technisch en praktisch kloppend te maken.",
      "Van 'ik wil iets' naar 'zo gaan we het doen'."
    ]
  },
  {
    question: "Doen jullie echt alles zelf of werken jullie met losse partijen?",
    answer: [
      "Wij werken met vaste teams en vaste specialisten.",
      "Denk aan sloopwerk, constructieve aanpassingen, elektra, installaties, wanden, vloeren, tegelwerk, stucwerk, schilderwerk, timmerwerk en afbouw.",
      "Alles wordt vanuit één centrale aansturing geregeld."
    ]
  },
  {
    question: "Kunnen jullie ook constructieve dingen oppakken?",
    answer: [
      "Ja. Bijvoorbeeld dragende muren aanpassen, staalconstructies plaatsen, indelingen veranderen en volledige renovaties.",
      "Waar nodig werken we samen met constructeurs en zorgen wij dat de uitvoering klopt.",
      "U hoeft dat niet zelf te regelen."
    ]
  },
  {
    question: "Hoe zorgen jullie dat een project niet uitloopt?",
    answer: [
      "Door vooraf strak te plannen en tijdens het werk kort te schakelen.",
      "Duidelijke voorbereiding, vaste teams en directe communicatie zorgen voor overzicht.",
      "Geen losse schakels, maar één lijn."
    ]
  },
  {
    question: "Heb ik één aanspreekpunt tijdens het project?",
    answer: [
      "Ja. U heeft één vast aanspreekpunt die alles overziet.",
      "Van planning tot uitvoering.",
      "Geen gedoe met vijf verschillende nummers."
    ]
  },
  {
    question: "Wat gebeurt er als er iets verandert tijdens de verbouwing?",
    answer: [
      "Dat gebeurt soms en dat is geen probleem.",
      "We bespreken direct wat er verandert, wat dat betekent en wat het eventueel kost.",
      "Altijd vooraf duidelijk. Nooit achteraf verrassingen."
    ]
  },
  {
    question: "Werken jullie met vaste mensen?",
    answer: [
      "Ja. Wij werken met vaste vakmensen die gewend zijn om samen te werken.",
      "Geen wisselende ploegen per week.",
      "Daardoor blijven kwaliteit en tempo stabiel."
    ]
  },
  {
    question: "Kan ik zien hoe jullie werken voordat ik beslis?",
    answer: [
      "Ja. Tijdens het traject nemen we u indien mogelijk mee naar een lopend project.",
      "Zo ziet u precies wat u kunt verwachten.",
      "Dat geeft vaak meteen vertrouwen."
    ]
  },
  {
    question: "Voor wat voor projecten zijn jullie de juiste partij?",
    answer: [
      "Voor mensen die het goed geregeld willen hebben.",
      "Badkamers, totaalrenovaties, verbouwingen en grotere projecten passen goed bij onze aanpak.",
      "Zolang kwaliteit en duidelijkheid belangrijk zijn, zitten we goed."
    ]
  },
  {
    question: "En als mijn project niet bij jullie past?",
    answer: [
      "Dan zeggen we dat eerlijk.",
      "We nemen alleen projecten aan waar we volledig achter staan en capaciteit voor hebben.",
      "Liever nee zeggen, dan half werk leveren."
    ]
  },
  {
    question: "Zijn jullie meer een groot bedrijf of een familiebedrijf?",
    answer: [
      "Beide.",
      "We hebben de structuur en capaciteit om projecten strak te draaien, maar werken nog steeds met persoonlijk contact en verantwoordelijkheid.",
      "U merkt dat verschil direct."
    ]
  },
  {
    question: "Hoe zit het met kwaliteit en zekerheid?",
    answer: [
      "Dat is goed geregeld.",
      "Onze monteurs zijn VCA gecertificeerd en het bedrijf beschikt over een CAR- en aansprakelijkheidsverzekering.",
      "We werken veilig, gestructureerd en professioneel."
    ]
  },
  {
    question: "Waarom kiezen mensen uiteindelijk voor jullie?",
    answer: [
      "Omdat het klopt.",
      "Duidelijke communicatie, strakke uitvoering, geen verrassingen en één aanspreekpunt.",
      "En misschien nog belangrijker: het voelt betrouwbaar."
    ]
  }
];

function HandUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute -bottom-1 left-0 h-3 w-full text-brand-orange ${className}`}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 160 14"
    >
      <path
        d="M3 9c35-7 83-6 154-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

function FlowLine() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-7 hidden h-[72%] w-[72px] text-brand-orange/70 lg:block"
      fill="none"
      viewBox="0 0 90 640"
    >
      <path
        d="M57 4C8 59 69 94 26 153C-3 194 68 236 34 290C5 337 67 370 27 429C-6 478 59 518 34 592"
        stroke="currentColor"
        strokeDasharray="8 12"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path d="M30 151l-12 2 7 10M33 291l-12 4 8 9M31 592l-12 2 7 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function SideArrow() {
  return (
    <svg aria-hidden="true" className="hidden h-8 w-20 text-brand-ink lg:block" fill="none" viewBox="0 0 110 46">
      <path d="M5 29c23-13 50-16 86-10" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      <path d="M82 9l20 12-22 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

function NoteCard() {
  return (
    <div className="relative mt-5 max-w-[390px] rotate-[-1deg] border-2 border-brand-ink/70 bg-[#fffaf0] px-6 py-5 shadow-[8px_10px_0_rgba(17,17,17,0.06)]">
      <div className="absolute -top-4 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-2deg] border border-black/20 bg-[#f4ead6]" />
      <div className="grid grid-cols-[48px_1fr] gap-4">
        <div className="grid h-11 w-11 place-items-center text-brand-ink">
          <SketchIcon name="quality" className="h-9 w-9" />
        </div>
        <p className="m-0 font-hand text-xl leading-snug text-brand-ink">
          Tijdens het traject nemen wij u indien mogelijk mee naar een lopend project, zodat u precies weet wat u kunt verwachten.
        </p>
      </div>
      <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-brand-orange" />
    </div>
  );
}

export default function WerkwijzePage() {
  return (
    <main className="bg-white">
      <Header />
      <section className="relative overflow-hidden bg-white py-6 lg:py-7">
        <div className="section-shell relative grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="pt-2">
            <p className="eyebrow">Werkwijze</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-brand-ink sm:text-6xl lg:text-[64px]">
              Zo werkt het als u met ons{" "}
              <span className="relative inline-block">
                samenwerkt.
                <HandUnderline />
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base font-bold leading-7 text-neutral-600">
              U hoeft niks uit te zoeken.
              <br />
              Wij regelen het van begin tot eind.
            </p>

            <NoteCard />

            <div className="mt-5 flex max-w-xl items-end gap-4">
              <div className="grid h-20 w-24 shrink-0 place-items-center text-brand-ink">
                <SketchIcon name="team" className="h-20 w-20" />
              </div>
              <SideArrow />
              <p className="mb-1 max-w-xs font-hand text-xl leading-snug text-brand-ink">
                U spreekt met de mensen die uw project ook echt uitvoeren.
              </p>
            </div>
          </div>

          <div className="relative">
            <FlowLine />
            <div className="grid gap-0">
              {steps.map((step, index) => (
                <div
                  className="grid items-center gap-3 rounded-none border-b border-black/5 py-1 sm:grid-cols-[100px_1fr] lg:grid-cols-[110px_1.05fr_86px_185px]"
                  key={step.title}
                >
                  <div className="hidden justify-center text-brand-ink sm:flex">
                    <div className="grid h-[86px] w-[86px] place-items-center">
                      <SketchIcon name={step.icon} className="h-20 w-20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-brand-orange font-hand text-2xl leading-none text-brand-orange">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="relative inline-block font-hand text-[32px] font-normal leading-none text-brand-ink">
                        {step.title}
                        <HandUnderline />
                      </h2>
                      <p className="mt-2 max-w-sm font-hand text-lg leading-snug text-brand-ink">
                        {step.text}
                      </p>
                    </div>
                  </div>

                  <SideArrow />

                  <p className="hidden max-w-[185px] font-hand text-lg leading-snug text-brand-ink lg:block">
                    {step.note}
                    <span className="mt-1 block h-1 w-24 rounded-full bg-brand-orange" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-shell mt-4">
          <div className="mx-auto grid max-w-6xl gap-0 border-2 border-brand-ink/70 bg-white shadow-[8px_10px_0_rgba(17,17,17,0.05)] sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit, index) => (
              <div
                className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? "border-t border-brand-ink/20 sm:border-l sm:border-t-0" : ""}`}
                key={benefit.title}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center text-brand-ink">
                  <SketchIcon name={benefit.icon} className="h-8 w-8" />
                </span>
                <p className="m-0 font-hand text-lg leading-tight text-brand-ink">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-4">
        <div className="section-shell">
          <div className="grid gap-5 rounded-lg bg-brand-soft px-6 py-5 sm:grid-cols-3 lg:px-8">
            {trustPoints.map((point) => (
              <div className="flex gap-4" key={point.title}>
                {point.logo ? (
                  <span className="mt-1 flex h-10 w-20 shrink-0 items-center">
                    <img
                      alt={`${point.title} logo`}
                      className="max-h-10 w-auto max-w-full object-contain"
                      src={point.logo}
                    />
                  </span>
                ) : (
                  <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center text-brand-ink">
                    <SketchIcon name={point.icon} className="h-8 w-8" />
                  </span>
                )}
                <div>
                  <h2 className="text-base font-bold text-brand-ink">{point.title}</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-neutral-600">
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Partners />
      <section className="bg-brand-soft py-10 sm:py-12">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                U heeft nog vragen. Dat begrijpen we.
              </h2>
              <p className="mt-4 text-base font-semibold leading-7 text-neutral-600">
                Een verbouwing is geen kleine beslissing. Daarom beantwoorden we hieronder de vragen die wij bijna altijd krijgen, kort en eerlijk.
              </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {faqItems.map((item) => (
                <details
                  className="group rounded-lg bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium"
                  key={item.question}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold leading-6 text-brand-ink">
                    <span>{item.question}</span>
                    <span className="text-brand-orange transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-4 grid gap-3 text-sm font-medium leading-7 text-neutral-600">
                    {item.answer.map((line) => (
                      <p className="m-0" key={line}>
                        {line}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
          </div>

          <div className="mt-8 rounded-lg bg-neutral-950 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-2xl font-bold">Twijfelt u nog? Plan gewoon een intake.</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-white/65">
                Na één gesprek weet u direct of wij bij u passen.
              </p>
            </div>
            <a className="btn-primary mt-5 sm:mt-0" href="/contact">
              Start intake
            </a>
          </div>
        </div>
      </section>
      <CTASection
        title="Klaar om uw project goed te starten?"
        text="Start met een korte intake. Wij beoordelen uw aanvraag persoonlijk."
      />
      <Footer />
    </main>
  );
}
