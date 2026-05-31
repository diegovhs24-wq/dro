import {notFound, redirect} from "next/navigation";
import type {Metadata} from "next";

import {
  getPageFetchResult,
  metadataFromSeo,
  type CmsDynamicPage,
} from "@/lib/cms";
import {getFallbackHomePage} from "@/lib/cms-fallback";

type CmsPageMetadataOptions = {
  slug: string;
  pathname: string;
  fallbackTitle: string;
};

export async function requireCmsPage(slug: string): Promise<CmsDynamicPage> {
  const result = await getPageFetchResult(slug);

  if (result.status === "ok") {
    return result.page;
  }

  if (result.status === "unavailable") {
    if (slug === "home") {
      return getFallbackHomePage() as CmsDynamicPage;
    }

    redirect("/");
  }

  notFound();
}

export async function cmsPageMetadata({
  slug,
  pathname,
  fallbackTitle,
}: CmsPageMetadataOptions): Promise<Metadata> {
  const result = await getPageFetchResult(slug);
  const page =
    result.status === "ok"
      ? result.page
      : slug === "home"
        ? (getFallbackHomePage() as CmsDynamicPage)
        : null;

  return metadataFromSeo(page?.seo || {}, page?.title || fallbackTitle, {
    pathname,
    fallbackDescription: page?.seo?.metaDescription,
  });
}

export async function getHomePageForRoute(): Promise<CmsDynamicPage> {
  return requireCmsPage("home");
}
