import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";

export const metadata: Metadata = {
  title: "Over DRO Renovaties | Team en werkwijze",
  description:
    "Maak kennis met Therab, Jarek, Scott en het vaste team achter DRO Renovaties."
};

const coreTeam = [
  {
    name: "Therab",
    role: "Eerste aanspreekpunt",
    image: "/therab-eerste-aanspreekpunt.jpg",
    text: "Kijkt met u mee vanaf het eerste contact en zorgt dat alles duidelijk blijft."
  },
  {
    name: "Jarek",
    role: "Hoofd uitvoering",
    image: "/jarek-hoofd-uitvoering.jpg",
    text: "Stuurt de uitvoering aan en zorgt dat alles loopt zoals afgesproken."
  },
  {
    name: "Scott",
    role: "Klantcontact & kantoor",
    image: "/scott-klantcontact.png",
    text:
      "Is dagelijks op kantoor, houdt klanten duidelijk op de hoogte van updates en neemt zijn oog voor interieur en afwerking mee in elk gesprek."
  }
];

const introItems: Array<{ icon: SketchIconName; text: string }> = [
  {
    icon: "finish",
    text:
      "DRO Bouwgroep is een multidisciplinair bouwbedrijf dat complete renovatie- en bouwtrajecten verzorgt voor zowel particuliere als zakelijke opdrachtgevers."
  },
  {
    icon: "checklist",
    text:
      "Wij combineren vakmanschap met strakke projectsturing, waardoor kwaliteit, planning en communicatie altijd onder controle blijven."
  },
  {
    icon: "team",
    text:
      "Van een badkamerrenovatie tot een volledige verbouwing: elk project wordt uitgevoerd vanuit één duidelijke aanpak met vaste teams en heldere afspraken."
  },
  {
    icon: "contact",
    text:
      "Wij werken niet vanuit losse klussen, maar vanuit complete oplossingen. Van voorbereiding en sloop tot afwerking en oplevering: één aanspreekpunt, één team, één resultaat."
  },
  {
    icon: "materials",
    text:
      "Duurzaamheid en efficiëntie zijn vanzelfsprekend. Wij gebruiken materialen en technieken die voldoen aan actuele eisen op het gebied van energie, isolatie en levensduur."
  },
  {
    icon: "shield",
    text:
      "Met DRO Bouwgroep kiest u voor duidelijkheid, structuur en een uitvoering die klopt."
  }
];

function FlowArrow() {
  return (
    <svg aria-hidden="true" className="h-9 w-20 text-brand-ink" fill="none" viewBox="0 0 110 46">
      <path
        d="M5 29c23-13 50-16 86-10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <path
        d="M82 9l20 12-22 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function OrangeUnderline() {
  return (
    <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-brand-orange" />
  );
}

function IdeaSketch() {
  return (
    <svg aria-hidden="true" className="h-32 w-full sm:h-36" fill="none" viewBox="0 0 230 170">
      <path d="M45 132V82l52-38 52 38v50" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M35 86l62-45 62 45" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M78 132V98h34v34M55 132h112" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M88 21c-23-4-40 11-39 29-19 6-22 34 3 43 12 18 43 14 54 0 22 3 39-16 29-36 9-19-6-40-28-39-3-12-10-18-19-20z" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M88 47c9-9 26-2 24 11-1 8-6 11-10 15v9H88v-9c-4-4-9-8-10-15-1-5 2-9 10-11z" stroke="#ff6a00" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
      <path d="M90 88h13M91 95h11M95 36v-9M74 48l-8-6M116 48l8-6" stroke="#ff6a00" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}

function MeetingSketch() {
  return (
    <svg aria-hidden="true" className="h-32 w-full sm:h-36" fill="none" viewBox="0 0 250 170">
      <path d="M70 135h110M82 105h86l13 30H68z" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M82 87c15-18 38-18 50 0M52 132c4-35 18-52 40-52M198 132c-4-35-18-52-40-52" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <circle cx="88" cy="62" r="16" stroke="#111" strokeWidth="2" />
      <circle cx="162" cy="62" r="16" stroke="#111" strokeWidth="2" />
      <path d="M104 74c12 13 28 13 42 0M100 111l25 12 25-12" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M132 25h56c11 0 18 7 18 17v18c0 10-7 17-18 17h-21l-18 18v-18h-17c-11 0-18-7-18-17V42c0-10 7-17 18-17z" stroke="#111" strokeWidth="2" />
      <path d="M145 51h2M162 51h2M179 51h2" stroke="#ff6a00" strokeLinecap="round" strokeWidth="5" />
    </svg>
  );
}

function RealitySketch() {
  return (
    <svg aria-hidden="true" className="h-32 w-full sm:h-36" fill="none" viewBox="0 0 260 170">
      <path d="M36 130h190M55 129V69l70-38 78 38v60" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M55 70h148M85 129V88h42v41M144 129V88h34v41" stroke="#111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M73 74h38v14H73zM137 74h38v14h-38z" stroke="#111" strokeLinejoin="round" strokeWidth="2" />
      <path d="M29 130c25-18 53-16 86 0M153 130c20-17 47-16 75 0" stroke="#111" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M210 30l9-16M225 44l18-8M208 55l18 6" stroke="#ff6a00" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export default function OverOnsPage() {
  return (
    <main>
      <Header />

      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="section-shell grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-4xl">
            <p className="eyebrow">Over ons</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[0.98] text-brand-ink sm:text-6xl lg:text-[64px]">
              DRO Bouwgroep staat voor duidelijk bouwen.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-neutral-600">
              Complete renovatie- en bouwtrajecten voor particuliere en zakelijke
              opdrachtgevers.
            </p>

            <div className="mt-7 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <div>
                <p className="relative mx-auto w-max font-[cursive] text-2xl text-brand-ink">
                  1. Idee
                  <OrangeUnderline />
                </p>
                <IdeaSketch />
              </div>
              <div className="hidden pb-9 sm:block">
                <FlowArrow />
              </div>
              <div>
                <p className="relative mx-auto w-max font-[cursive] text-2xl text-brand-ink">
                  2. Bespreking
                  <OrangeUnderline />
                </p>
                <MeetingSketch />
              </div>
              <div className="hidden pb-9 sm:block">
                <FlowArrow />
              </div>
              <div>
                <p className="relative mx-auto w-max font-[cursive] text-2xl text-brand-ink">
                  3. Realiteit
                  <OrangeUnderline />
                </p>
                <RealitySketch />
              </div>
            </div>

            <p className="mx-auto mt-2 max-w-2xl text-center font-[cursive] text-xl leading-tight text-brand-ink sm:text-2xl">
              Van eerste idee tot oplevering.
              <br />
              Eén team, één aanspreekpunt,{" "}
              <span className="relative inline-block">
                één resultaat.
                <span className="absolute -inset-x-2 -bottom-1.5 h-7 rounded-[50%] border-2 border-brand-orange" />
              </span>
            </p>
          </div>

          <div className="pt-2 lg:pt-8">
            {introItems.map((item) => (
              <div
                className="grid grid-cols-[56px_1fr] gap-5 border-b border-black/10 py-4 last:border-b-0"
                key={item.text}
              >
                <div className="grid h-12 w-12 place-items-center text-brand-ink">
                  <SketchIcon name={item.icon} className="h-10 w-10" />
                </div>
                <p className="text-sm font-bold leading-6 text-neutral-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-12 sm:py-16">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Kernteam</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              De mensen die u spreekt.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {coreTeam.map((member) => (
              <article className="rounded-lg bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-premium" key={member.name}>
                <div
                  className="min-h-[360px] rounded-md bg-cover bg-center sm:min-h-[430px]"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="p-3 pt-5">
                  <h3 className="text-2xl font-bold text-brand-ink">{member.name}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">
                    {member.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-lg bg-neutral-950 p-5 text-white shadow-premium">
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">
              U heeft contact met ons, wij regelen de rest.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Ons team</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              Vaste vakmensen, dagelijks samen aan het werk.
            </h2>
          </div>
          <div className="mt-8 min-h-[360px] rounded-lg bg-[url('/dro-renovaties-team.jpg')] bg-cover bg-center shadow-premium sm:min-h-[520px]" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
