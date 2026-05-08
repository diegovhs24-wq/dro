import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import GoogleReviews from "@/components/GoogleReviews";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";
import { projects } from "@/components/projectData";
import { services } from "@/components/siteContent";

const problems = [
  "Onduidelijke offertes",
  "Slechte communicatie",
  "Te veel partijen",
  "Kosten die oplopen"
];

const solutions = [
  "Duidelijkheid vooraf",
  "Eén aanspreekpunt",
  "Strakke planning",
  "Geen verrassingen achteraf"
];

const afbouwItems: Array<{ title: string; icon: SketchIconName }> = [
  { title: "Metselwerk", icon: "materials" },
  { title: "Tegelwerk", icon: "bathroom" },
  { title: "Wanden en plafonds", icon: "newbuild" },
  { title: "Afwerking", icon: "finish" },
  { title: "Timmerwerk", icon: "tools" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-brand-soft p-7 transition duration-300 hover:-translate-y-1">
            <p className="eyebrow text-neutral-500">Probleem</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Waar loopt u tegenaan?
            </h2>
            <ul className="mt-7 grid gap-4 text-neutral-700">
              {problems.map((item) => (
                <li className="flex items-start gap-4" key={item}>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-sm font-extrabold text-neutral-500">
                    X
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-brand-orange/20 bg-white p-7 shadow-premium transition duration-300 hover:-translate-y-1">
            <p className="eyebrow">Oplossing</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
              Zo hoort het wél
            </h2>
            <ul className="mt-7 grid gap-4 text-neutral-700">
              {solutions.map((item) => (
                <li className="flex items-start gap-4" key={item}>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-extrabold text-white">
                    ✓
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 rounded-lg bg-brand-soft p-5 text-base font-bold leading-7 text-brand-ink">
              Bij DRO Renovaties weet u vooraf waar u aan toe bent.
            </p>
          </div>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-lg bg-neutral-950 p-6 text-white sm:flex-row sm:items-center">
            <h3 className="text-xl font-bold sm:text-2xl">
              Rustig starten met een duidelijke intake.
            </h3>
            <a className="btn-primary shrink-0" href="/contact">
              Start intake
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16" id="diensten">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Diensten</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Complete oplossingen, strak geregeld.
              </h2>
            </div>
            <a className="text-sm font-bold text-brand-orange hover:text-brand-ink" href="/diensten">
              Alle diensten
            </a>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.slug} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Afbouw</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Complete afbouw onder één verantwoordelijkheid.
            </h2>
            <a className="btn-primary mt-7" href="/zakelijk">
              Bekijk zakelijk
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {afbouwItems.map((step) => (
              <div className="rounded-lg bg-white p-6 transition hover:-translate-y-1 hover:shadow-premium" key={step.title}>
                <SketchIcon name={step.icon} className="h-11 w-11 text-brand-ink" />
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Partners />

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <p className="eyebrow">Projecten</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Voor en na met controle.
          </h2>
          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews compact limit={4} />
      <CTASection
        title="Klaar om uw project goed te starten?"
        text="Start met een korte intake. Wij beoordelen uw aanvraag persoonlijk."
      />
      <Footer />
      <a
        aria-label="WhatsApp DRO Renovaties"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-base font-bold text-white shadow-2xl transition hover:-translate-y-1"
        href="https://wa.me/31600000000"
      >
        WA
      </a>
      <a
        className="fixed bottom-5 left-5 z-50 hidden rounded-md bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white shadow-2xl transition hover:-translate-y-1 sm:inline-flex"
        href="/contact"
      >
        Start intake
      </a>
    </main>
  );
}
