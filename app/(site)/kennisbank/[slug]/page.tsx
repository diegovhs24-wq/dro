import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";

import BlogCard from "@/components/BlogCard";
import RichText from "@/components/RichText";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  getBlogPosts,
  getSiteSettings,
  metadataFromSeo,
} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

function formatDate(date?: string) {
  if (!date) return null;

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Artikel niet gevonden | DRO Renovaties",
      robots: {index: false, follow: false},
    };
  }

  return metadataFromSeo(post.seo || {}, `${post.title} | DRO Renovaties`, {
    pathname: `/kennisbank/${params.slug}`,
    fallbackDescription: post.excerpt,
    type: "article",
    image: post.featuredImage,
  });
}

export default async function BlogPostPage({params}: BlogPostPageProps) {
  const [siteSettings, post, allPosts] = await Promise.all([
    getSiteSettings(),
    getBlogPostBySlug(params.slug),
    getBlogPosts(),
  ]);

  if (!post) notFound();

  const pathname = `/kennisbank/${post.slug}`;
  const breadcrumbs = breadcrumbsForPath(pathname, post.title);
  const publishedDate = formatDate(post.publishedAt);
  const relatedPosts = allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageStructuredData
        article={{
          title: post.title,
          description: post.excerpt,
          pathname,
          image: post.featuredImage,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt || post.publishedAt,
          authorName: post.author?.name,
        }}
        breadcrumbs={breadcrumbs}
        description={post.excerpt}
        organizationSeo={siteSettings.organizationSeo}
        pathname={pathname}
        siteSettings={siteSettings}
        title={post.title}
      />
      <main>
        <section className="bg-brand-ink py-14 text-white sm:py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Link className="eyebrow hover:text-brand-orange" href="/kennisbank">
                Kennisbank
              </Link>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/76">{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/75">
                {post.author?.name ? <span>Door {post.author.name}</span> : null}
                {publishedDate ? <span>{publishedDate}</span> : null}
                {post.readingTime ? <span>{post.readingTime}</span> : null}
              </div>
              {post.categories?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      className="rounded bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/80"
                      key={category.slug}
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            {post.featuredImage ? (
              <div className="relative min-h-[430px] overflow-hidden rounded-lg shadow-premium">
                <Image
                  alt={post.title}
                  className="object-cover object-center"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={post.featuredImage}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article className="max-w-3xl">
              <RichText blocks={post.body} />
            </article>

            <aside className="space-y-5">
              {post.author ? (
                <div className="rounded-lg bg-brand-soft p-6">
                  {post.author.image ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image alt={post.author.name} className="object-cover" fill sizes="80px" src={post.author.image} />
                    </div>
                  ) : null}
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">
                    Auteur
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold text-brand-ink">{post.author.name}</h2>
                  {post.author.role ? (
                    <p className="mt-1 text-sm font-semibold text-neutral-600">{post.author.role}</p>
                  ) : null}
                  {post.author.bio ? (
                    <p className="mt-4 text-sm leading-7 text-neutral-600">{post.author.bio}</p>
                  ) : null}
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        {post.relatedServices?.length ? (
          <section className="bg-brand-soft py-14 sm:py-16">
            <div className="section-shell">
              <p className="eyebrow">Gerelateerde diensten</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                Verder lezen over onze aanpak
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {post.relatedServices.map((service) => (
                  <ServiceCard key={service.slug} {...service} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {post.relatedProjects?.length ? (
          <section className="bg-white py-14 sm:py-16">
            <div className="section-shell">
              <p className="eyebrow">Gerelateerde projecten</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                Voorbeelden uit de praktijk
              </h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {post.relatedProjects.map((project) => (
                  <ProjectCard key={project.slug} {...project} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {relatedPosts.length ? (
          <section className="bg-brand-soft py-14 sm:py-16">
            <div className="section-shell">
              <p className="eyebrow">Meer uit de kennisbank</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                Praktische renovatie-inzichten
              </h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} {...relatedPost} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
