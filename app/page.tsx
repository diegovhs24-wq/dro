import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import ProjectCard from "@/components/ProjectCard";
import ReviewCard from "@/components/ReviewCard";
import ServiceCard from "@/components/ServiceCard";
import SystemLayers from "@/components/SystemLayers";
import { projects } from "@/components/projectData";
import { reviews, services } from "@/components/siteContent";

const problems = [
  "Onduidelijke offertes",
  "Slechte communicatie",
  "Uitlopende projecten",
  "Onverwachte kosten"
];

const solutions = [
  "Heldere en gespecificeerde offertes",
  "Eén vast aanspreekpunt",
  "Strakke planning en communicatie",
  "Geen verrassingen achteraf"
];

const clarityItems = [
  "Heldere en gespecificeerde offertes",
  "Geen verborgen kosten",
  "Realistische planning",
  "Eén vast aanspreekpunt",
  "Volledige begeleiding van A tot Z"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />

      <section className="bg-white py-24">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-brand-soft p-8 transition duration-300 hover:-translate-y-1">
            <p className="eyebrow text-neutral-500">Probleem</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Waar loopt u tegenaan?
            </h2>
            <ul className="mt-8 grid gap-5 text-neutral-700">
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
          <div className="rounded-lg border border-brand-orange/20 bg-white p-8 shadow-premium transition duration-300 hover:-translate-y-1">
            <p className="eyebrow">Oplossing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              Zo hoort het wél
            </h2>
            <ul className="mt-8 grid gap-5 text-neutral-700">
              {solutions.map((item) => (
                <li className="flex items-start gap-4" key={item}>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-extrabold text-white">
                    ✓
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-lg bg-brand-soft p-5 text-base font-bold leading-7 text-brand-ink">
              Bij DRO Renovaties weet u vooraf waar u aan toe bent.
            </p>
          </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-lg bg-neutral-950 p-7 text-white sm:flex-row sm:items-center">
            <h3 className="text-xl font-bold sm:text-2xl">
              Rustig starten met een duidelijke intake.
            </h3>
            <a className="btn-primary shrink-0" href="/contact">
              Start intake
            </a>
          </div>
        </div>
      </section>

      <Partners />

      <section className="bg-brand-soft py-24">
        <div className="section-shell">
          <p className="eyebrow">Duidelijkheid vooraf</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Rust in het proces voordat de uitvoering start.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {clarityItems.map((item) => (
              <div className="rounded-lg bg-white p-7 shadow-sm" key={item}>
                <span className="text-brand-orange">✔</span>
                <h3 className="mt-4 text-lg font-bold">{item}</h3>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-neutral-600">
            Bij DRO Renovaties weet u vooraf precies waar u aan toe bent.
          </p>
        </div>
      </section>

      <SystemLayers />

      <section className="bg-white py-24" id="diensten">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Diensten</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Renovaties van A tot Z.
              </h2>
            </div>
            <a className="text-sm font-bold text-brand-orange hover:text-brand-ink" href="/diensten">
              Alle diensten
            </a>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.slug} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-24">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Werkwijze</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Eerst overzicht, dan bouwen.
            </h2>
            <p className="mt-6 leading-8 text-neutral-600">
              Wij brengen scope, planning, communicatie en uitvoering samen in één duidelijk traject.
            </p>
            <a className="btn-primary mt-7" href="/werkwijze">
              Bekijk werkwijze
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Aanvraag", "Intake", "Offerte", "Uitvoering"].map((step, index) => (
              <div className="rounded-lg bg-white p-6" key={step}>
                <span className="text-sm font-extrabold text-brand-orange">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="section-shell">
          <p className="eyebrow">Projecten</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Voor en na met controle.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-24">
        <div className="section-shell">
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Vertrouwen begint bij duidelijkheid.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
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
        Plan een vrijblijvend gesprek
      </a>
    </main>
  );
}
