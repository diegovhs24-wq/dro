import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import IntakeWizard from "@/components/IntakeWizard";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";

const coverageText =
  "Dekking in Zuid-Holland, Noord-Holland, Utrecht en een deel van Zeeland dankzij meerdere opstartlocaties";

const trustItems: Array<{ title: string; icon: SketchIconName }> = [
  { title: "Eén aanspreekpunt", icon: "contact" },
  { title: "Strakke planning", icon: "planning" },
  { title: "Geen verrassingen", icon: "shield" }
];

const processSteps: Array<{
  title: string;
  text: string;
  icon: SketchIconName;
}> = [
  {
    title: "1. Idee",
    text: "U heeft een idee of wens. Wij denken direct met u mee.",
    icon: "idea"
  },
  {
    title: "2. Gesprek",
    text: "We bespreken uw situatie en geven eerlijk advies.",
    icon: "talk"
  },
  {
    title: "3. Plan",
    text: "U ontvangt een helder plan en een transparante offerte.",
    icon: "checklist"
  },
  {
    title: "4. Uitvoering",
    text: "Ons team voert het werk uit volgens planning en afspraak.",
    icon: "tools"
  },
  {
    title: "5. Oplevering",
    text: "We leveren netjes op. Alles gecontroleerd en afgerond.",
    icon: "delivery"
  }
];

export default function Hero() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85')"
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_38%,rgba(255,255,255,0.10),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.72)_46%,rgba(0,0,0,0.55))]" />

        <div className="section-shell grid min-h-[680px] gap-10 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="animate-float-in">
            <p className="font-hand max-w-2xl text-base leading-7 text-brand-orange sm:text-lg">
              {coverageText}
            </p>
            <div className="mt-2 h-1 w-56 rounded-full bg-brand-orange" />

            <h1 className="mt-7 max-w-4xl text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[3.55rem] lg:text-[4.45rem]">
              Wij regelen uw
              <span className="block text-brand-orange">verbouwing.</span>
              <span className="relative inline-block">
                Van A tot Z.
                <span className="absolute -bottom-2 left-[52%] h-1.5 w-28 -translate-x-1/2 rotate-[-3deg] rounded-full bg-white" />
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/80 sm:text-[17px]">
              Eén aanspreekpunt. Strakke planning. Vaste teams.
              <br className="hidden sm:block" /> Geen verrassingen achteraf.
            </p>

            <div className="mt-7 grid max-w-2xl gap-5 sm:grid-cols-3">
              {trustItems.map((item) => (
                <div className="flex items-center gap-3" key={item.title}>
                  <SketchIcon
                    name={item.icon}
                    className="h-8 w-8 shrink-0 text-brand-orange"
                  />
                  <span className="text-sm font-medium leading-5 text-white/80">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-hand mt-7 max-w-2xl text-[17px] leading-8 text-white/80">
              Past uw project bij ons? Dan gaan we all-in.
              <br /> Past het niet? Dan zeggen we dat eerlijk.
            </p>
          </div>

          <div className="rounded-2xl bg-[#fbf8f2] p-5 text-brand-ink shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6 lg:max-w-[500px] lg:justify-self-end">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-extrabold tracking-[-0.03em]">
                Start uw project
              </h2>
              <span className="font-hand text-lg text-brand-orange">
                (1 minuut)
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-neutral-500">
              Beantwoord stap voor stap en ontvang binnen 24 uur duidelijkheid.
            </p>

            <div className="mt-5">
              <IntakeWizard compact embedded />
            </div>

            <p className="mt-5 flex gap-3 text-sm font-semibold leading-6 text-neutral-500">
              <SketchIcon
                name="shield"
                className="mt-0.5 h-6 w-6 shrink-0 text-neutral-500"
              />
              Wij nemen altijd contact op. Ook als uw project niet bij ons past.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/35 backdrop-blur-md">
          <div className="section-shell grid gap-5 py-5 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <GoogleRatingBadge compact variant="dark" />
              <div>
                <p className="font-black text-white">
                  273+ reviews
                </p>
                <p className="text-white/60">Klanten beoordelen ons met 4.8/5</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-white/10 sm:border-l sm:pl-9">
              <SketchIcon
                name="team"
                className="h-10 w-10 shrink-0 text-brand-orange"
              />
              <div>
                <p className="font-black text-white">100+</p>
                <p className="text-white/60">Projecten succesvol opgeleverd</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-white/10 sm:border-l sm:pl-9">
              <SketchIcon
                name="planning"
                className="h-10 w-10 shrink-0 text-brand-orange"
              />
              <div>
                <p className="font-black text-white">Binnen 24 uur</p>
                <p className="text-white/60">Duidelijkheid over uw project</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f2ea] py-7">
        <div className="section-shell grid gap-5 lg:grid-cols-[1.1fr_repeat(5,1fr)] lg:items-center">
          <div>
            <p className="font-hand text-xl leading-7 text-brand-ink">
              Duidelijk. Gestructureerd.
              <br />
              Zo werken wij.
            </p>
            <div className="mt-2 h-1 w-44 rounded-full bg-brand-orange" />
          </div>
          {processSteps.map((step, index) => (
            <div className="relative" key={step.title}>
              {index > 0 ? (
                <span className="font-hand absolute -left-6 top-8 hidden text-3xl text-brand-orange lg:block">
                  →
                </span>
              ) : null}
              <SketchIcon
                name={step.icon}
                className="h-12 w-12 text-brand-ink"
              />
              <h3 className="font-hand mt-2 text-lg font-normal text-brand-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-neutral-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
