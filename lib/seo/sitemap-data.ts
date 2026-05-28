import {fetchSanity} from "@/lib/sanity";
import {absoluteUrl} from "@/lib/seo/site";

type SitemapEntry = {
  slug: string;
  updatedAt?: string;
  noIndex?: boolean;
};

type SitemapQueryResult = {
  pages?: SitemapEntry[];
  services?: SitemapEntry[];
  projects?: SitemapEntry[];
};

const SITEMAP_QUERY = `{
  "pages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "noIndex": seo.noIndex
  },
  "services": *[_type == "service" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "noIndex": seo.noIndex
  },
  "projects": *[_type == "project" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "noIndex": seo.noIndex
  }
}`;

const STATIC_PATHS = [
  {path: "/", priority: 1, changeFrequency: "weekly" as const},
  {path: "/diensten", priority: 0.9, changeFrequency: "weekly" as const},
  {path: "/projecten", priority: 0.9, changeFrequency: "weekly" as const},
  {path: "/over-ons", priority: 0.8, changeFrequency: "monthly" as const},
  {path: "/werkwijze", priority: 0.8, changeFrequency: "monthly" as const},
  {path: "/zakelijk", priority: 0.8, changeFrequency: "monthly" as const},
  {path: "/contact", priority: 0.8, changeFrequency: "monthly" as const},
];

export type SitemapUrl = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

async function fetchSitemapData(): Promise<SitemapQueryResult | null> {
  try {
    return await fetchSanity<SitemapQueryResult>(SITEMAP_QUERY);
  } catch {
    return null;
  }
}

function pagePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  const data = await fetchSitemapData();
  const urls = new Map<string, SitemapUrl>();

  STATIC_PATHS.forEach((entry) => {
    urls.set(entry.path, {
      url: absoluteUrl(entry.path),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    });
  });

  (data?.pages || []).forEach((page) => {
    if (page.noIndex) return;
    const path = pagePath(page.slug);
    urls.set(path, {
      url: absoluteUrl(path),
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.7,
    });
  });

  (data?.services || []).forEach((service) => {
    if (service.noIndex) return;
    const path = `/diensten/${service.slug}`;
    urls.set(path, {
      url: absoluteUrl(path),
      lastModified: service.updatedAt ? new Date(service.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  (data?.projects || []).forEach((project) => {
    if (project.noIndex) return;
    const path = `/projecten/${project.slug}`;
    urls.set(path, {
      url: absoluteUrl(path),
      lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return Array.from(urls.values());
}
