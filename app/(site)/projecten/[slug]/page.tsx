import type {Metadata} from "next";
import {notFound} from "next/navigation";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {
  getProjectBySlug,
  getProjects,
  getServices,
  getSiteSettings,
  metadataFromSeo,
} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({slug: project.slug}));
}

export async function generateMetadata({params}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project niet gevonden | DRO Renovaties",
      robots: {index: false, follow: false},
    };
  }

  const title = `${project.type} ${project.location} | DRO Renovaties`;

  return metadataFromSeo({}, title, {
    pathname: `/projecten/${params.slug}`,
    fallbackDescription: project.description,
    type: "article",
    image: project.images[0],
  });
}

export default async function ProjectDetailPage({params}: ProjectPageProps) {
  const [siteSettings, services, project] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProjectBySlug(params.slug),
  ]);

  if (!project) notFound();

  const pathname = `/projecten/${params.slug}`;
  const breadcrumbs = breadcrumbsForPath(pathname, project.title);
  const title = `${project.type} in ${project.location}`;

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={project.description}
        organizationSeo={siteSettings.organizationSeo}
        pathname={pathname}
        siteSettings={siteSettings}
        title={title}
      />
      <main>
        <Header services={services} siteSettings={siteSettings} />
        <section className="bg-brand-ink py-14 text-white sm:py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="eyebrow">{project.location}</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
                {project.type} in {project.location}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/76">{project.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="btn-primary" href="/contact">
                  Start intake
                </a>
                <a className="btn-secondary" href="tel:+31600000000">
                  Bespreek uw project met ons
                </a>
              </div>
            </div>
            <div
              className="min-h-[430px] rounded-lg bg-cover bg-center shadow-premium"
              style={{backgroundImage: `url(${project.images[0]})`}}
            />
          </div>
        </section>

        <section className="bg-white py-12 sm:py-14">
          <div className="section-shell grid gap-5 md:grid-cols-4">
            {[
              ["Locatie", project.location],
              ["Type", project.type],
              ["Duur", project.duration],
              ["Begeleiding", "Van A tot Z"],
            ].map(([label, value]) => (
              <div className="rounded-lg bg-brand-soft p-6" key={label}>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-orange">
                  {label}
                </p>
                <p className="mt-3 text-xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow">Uitgevoerd werk</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Wat hebben we gedaan?
              </h2>
              <ul className="mt-7 grid gap-3 text-neutral-700">
                {project.work_items.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="text-brand-orange">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.map((image, index) => (
                <div
                  className={`min-h-72 rounded-lg bg-cover bg-center shadow-sm ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                  key={image}
                  style={{backgroundImage: `url(${image})`}}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell max-w-4xl">
            <p className="eyebrow">Projectverhaal</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Van eerste plan naar duidelijke oplevering.
            </h2>
            <p className="mt-7 text-lg leading-9 text-neutral-700">{project.story}</p>
          </div>
        </section>

        <CTASection title="Wilt u een renovatie met dezelfde duidelijkheid?" />
        <Footer services={services} siteSettings={siteSettings} />
      </main>
    </>
  );
}
