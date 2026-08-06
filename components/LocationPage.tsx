import Link from "next/link";

import BlogCard from "@/components/BlogCard";
import CTASection from "@/components/CTASection";
import GoogleReviews from "@/components/GoogleReviews";
import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import NearbyCitiesLinks from "@/components/NearbyCitiesLinks";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import TrustSignals from "@/components/TrustSignals";
import type {BlogPostSummary, FaqItem, LocationDetail, ReviewItem} from "@/lib/types";

type LocationPageProps = {
  location: LocationDetail;
  reviews: ReviewItem[];
  relatedArticles: BlogPostSummary[];
  faqs: FaqItem[];
};

export default function LocationPage({location, reviews, relatedArticles, faqs}: LocationPageProps) {
  const projects = [...location.relatedProjects, ...location.matchedProjects].slice(0, 6);

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-brand-ink py-14 text-white sm:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="section-shell">
          <div className="max-w-3xl animate-float-in">
            <p className="eyebrow">Werkgebied</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              Renovatiebedrijf in {location.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Ja, DRO Renovaties voert renovaties uit in {location.name} en omgeving: badkamers,
              totaalrenovaties, uitbouwen en meer &mdash; met een vaste prijs vooraf en zonder
              aanbetaling.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">{location.intro}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" href="/contact">
                Start intake
              </Link>
              <Link className="btn-secondary" href="tel:+31850871814">
                Bespreek uw project met ons
              </Link>
            </div>
            <div className="mt-6">
              <GoogleRatingBadge compact variant="dark" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <TrustSignals />
        </div>
      </section>

      {location.localContext || location.neighborhoods.length ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow">Lokale situatie</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
                Renoveren in {location.name}.
              </h2>
              {location.localContext ? (
                <p className="mt-5 text-base leading-7 text-neutral-700">{location.localContext}</p>
              ) : null}
            </div>
            {location.neighborhoods.length ? (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">
                  Actief in de buurten
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {location.neighborhoods.map((neighborhood) => (
                    <span
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-brand-ink"
                      key={neighborhood}
                    >
                      {neighborhood}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {location.popularServices.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell">
            <p className="eyebrow">Diensten</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Populaire diensten in {location.name}.
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {location.popularServices.map((service) => (
                <ServiceCard
                  href={`/${location.slug}/${service.slug}`}
                  icon={service.icon}
                  image={service.image}
                  key={service.slug}
                  label={service.label}
                  summary={service.summary}
                  title={service.title}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {location.whyDro ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell max-w-3xl">
            <p className="eyebrow">Waarom DRO</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Waarom kiezen voor DRO in {location.name}?
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-700">{location.whyDro}</p>
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Bewijs</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
                  Projecten in en rond {location.name}.
                </h2>
              </div>
              <Link className="text-sm font-bold text-brand-orange hover:text-brand-ink" href="/projecten">
                Bekijk alle projecten
              </Link>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  afterImage={project.afterImage}
                  after={project.after}
                  beforeImage={project.beforeImage}
                  before={project.before}
                  description={project.description}
                  key={project.slug}
                  slug={project.slug}
                  title={project.title}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedArticles.length ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell">
            <p className="eyebrow">Kennisbank</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Praktische renovatie-inzichten.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedArticles.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Veelgestelde vragen over renoveren in {location.name}.
            </h2>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq, index) => (
              <details
                className="rounded-lg bg-brand-soft p-5 shadow-sm transition hover:shadow-premium"
                key={faq.question}
                open={index === 0}
              >
                <summary className="cursor-pointer list-none font-bold text-brand-ink">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {reviews.length ? <GoogleReviews compact limit={4} reviews={reviews} /> : null}

      <NearbyCitiesLinks
        cities={location.nearbyCities}
        title={`Ook actief rond ${location.name}`}
      />

      <CTASection
        eyebrow="Aan de slag"
        title={`Renoveren in ${location.name}?`}
        text="Start een vrijblijvende intake en ontvang een vaste prijs voor uw project."
        buttons={[
          {label: "Start intake", link: {linkType: "external", externalUrl: "/contact"}, variant: "primary"},
          {label: "Bel direct", link: {linkType: "external", externalUrl: "tel:+31850871814"}, variant: "outlined"},
        ]}
        ratingScore={4.8}
        ratingLabel="4,8 uit 273 reviews"
      />
    </main>
  );
}
