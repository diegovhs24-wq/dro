import {notFound, redirect} from "next/navigation";
import type {Metadata} from "next";

import {
  getLocationBySlug,
  getPageFetchResult,
  metadataFromSeo,
  type CmsDynamicPage,
  type LocationDetail,
} from "@/lib/cms";
import {getFallbackHomePage} from "@/lib/cms-fallback";

type CmsPageMetadataOptions = {
  slug: string;
  pathname: string;
  fallbackTitle: string;
};

export type PageOrLocationResult =
  | {kind: "page"; page: CmsDynamicPage}
  | {kind: "location"; location: LocationDetail}
  | {kind: "redirect_home"}
  | {kind: "not_found"};

/**
 * Resolves a top-level slug against CMS pages first, then falls back to a
 * Location document. Both content types share the `/[slug]` route since
 * Next.js requires a single dynamic segment name at a given route level.
 */
export async function resolvePageOrLocation(slug: string): Promise<PageOrLocationResult> {
  const result = await getPageFetchResult(slug);

  if (result.status === "ok") {
    return {kind: "page", page: result.page};
  }

  if (result.status === "unavailable") {
    if (slug === "home") {
      return {kind: "page", page: getFallbackHomePage() as CmsDynamicPage};
    }
    return {kind: "redirect_home"};
  }

  const location = await getLocationBySlug(slug);

  if (location) {
    return {kind: "location", location};
  }

  return {kind: "not_found"};
}

export async function pageOrLocationMetadata({
  slug,
  pathname,
  fallbackTitle,
}: CmsPageMetadataOptions): Promise<Metadata> {
  const result = await resolvePageOrLocation(slug);

  if (result.kind === "page") {
    return metadataFromSeo(result.page.seo || {}, result.page.title || fallbackTitle, {
      pathname,
      fallbackDescription: result.page.seo?.metaDescription,
    });
  }

  if (result.kind === "location") {
    const {location} = result;
    const title = location.seo?.metaTitle || `Renovatie in ${location.name} | DRO Renovaties`;
    const description = location.seo?.metaDescription || location.intro;
    return metadataFromSeo({metaTitle: title, metaDescription: description}, title, {
      pathname,
      fallbackDescription: description,
    });
  }

  return metadataFromSeo({}, fallbackTitle, {pathname});
}

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
