import Link from "next/link";

import BlogCard from "@/components/BlogCard";
import CTASection from "@/components/CTASection";
import GoogleReviews from "@/components/GoogleReviews";
import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import NearbyCitiesLinks from "@/components/NearbyCitiesLinks";
import ProjectCard from "@/components/ProjectCard";
import SketchIcon from "@/components/SketchIcon";
import TrustSignals from "@/components/TrustSignals";
import type {BlogPostSummary, LocationDetail, ReviewItem, ServiceDetailContent} from "@/lib/types";

type LocationServicePageProps = {
  location: LocationDetail;
  service: ServiceDetailContent;
  reviews: ReviewItem[];
  relatedArticles: BlogPostSummary[];
};

export default function LocationServicePage({
  location,
  service,
  reviews,
  relatedArticles,
}: LocationServicePageProps) {
  const projects = [...location.relatedProjects, ...location.matchedProjects].slice(0, 3);
  const faqs = service.faqs || [];
  // service.title is the SEO-styled page H1 (already includes a city + brand suffix);
  // eyebrow holds the clean short service name for composing "{name} in {city}" copy.
  const serviceName = service.eyebrow || service.title;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-brand-ink py-14 text-white sm:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="section-shell">
          <div className="max-w-3xl animate-float-in">
            <p className="eyebrow">
              <Link className="hover:text-brand-orange" href={`/${location.slug}`}>
                {location.name}
              </Link>{" "}
              / {serviceName}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              {serviceName} in {location.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Ja, DRO Renovaties verzorgt {serviceName.toLowerCase()} in {location.name} en
              omgeving &mdash; met een vaste prijs vooraf, geen aanbetaling en één vast
              aanspreekpunt.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">{service.intro}</p>
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

      {service.sections.length ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell">
            <p className="eyebrow">Aanpak</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              {service.processTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700">
              {service.processText}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.sections.slice(0, 2).map((section) => (
                <article className="rounded-lg border border-black/10 bg-white p-6 shadow-sm" key={section.title}>
                  <SketchIcon name="checklist" className="mb-4 h-10 w-10 text-brand-ink" />
                  <h3 className="text-xl font-bold text-brand-ink">{section.title}</h3>
                  <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-neutral-700">
                    {section.items.slice(0, 4).map((item) => (
                      <li className="flex gap-3" key={item}>
                        <span className="text-brand-orange">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {location.localContext ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell max-w-3xl">
            <p className="eyebrow">{location.name}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Waarom {serviceName.toLowerCase()} in {location.name} vaak nodig is.
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-700">{location.localContext}</p>
            {location.whyDro ? (
              <p className="mt-4 text-base leading-7 text-neutral-700">{location.whyDro}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell">
            <p className="eyebrow">Bewijs</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Projecten in en rond {location.name}.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
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
        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell">
            <p className="eyebrow">Kennisbank</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Meer over {serviceName.toLowerCase()}.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedArticles.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
                Veelgestelde vragen.
              </h2>
            </div>
            <div className="grid gap-3">
              {faqs.slice(0, 6).map((faq, index) => (
                <details
                  className="rounded-lg bg-white p-5 shadow-sm transition hover:shadow-premium"
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
      ) : null}

      {reviews.length ? <GoogleReviews compact limit={4} reviews={reviews} /> : null}

      <section className="bg-white py-10">
        <div className="section-shell flex flex-wrap gap-4 text-sm font-bold">
          <Link className="text-brand-orange hover:text-brand-ink" href={`/${location.slug}`}>
            &larr; Meer over {location.name}
          </Link>
          <Link className="text-brand-orange hover:text-brand-ink" href={`/diensten/${service.slug}`}>
            &larr; Meer over {serviceName}
          </Link>
        </div>
      </section>

      <NearbyCitiesLinks
        cities={location.nearbyCities}
        serviceSlug={service.slug}
        title={`${serviceName} in de omgeving van ${location.name}`}
      />

      <CTASection
        eyebrow="Aan de slag"
        title={`${serviceName} in ${location.name}?`}
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
