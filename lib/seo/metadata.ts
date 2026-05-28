import type {Metadata} from "next";
import type {SeoSettings} from "@/lib/types";
import {absoluteUrl, getSiteUrl} from "@/lib/seo/site";

export type BuildMetadataOptions = {
  seo?: SeoSettings;
  fallbackTitle: string;
  fallbackDescription?: string;
  pathname: string;
  type?: "website" | "article";
  image?: string;
};

export function buildPageMetadata({
  seo = {},
  fallbackTitle,
  fallbackDescription,
  pathname,
  type = "website",
  image,
}: BuildMetadataOptions): Metadata {
  const title = seo.metaTitle || fallbackTitle;
  const description = seo.metaDescription || fallbackDescription;
  const canonical = absoluteUrl(pathname);
  const ogImage = seo.openGraphImage || image;
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    robots: seo.noIndex
      ? {index: false, follow: false, googleBot: {index: false, follow: false}}
      : {
          index: true,
          follow: true,
          googleBot: {index: true, follow: true, "max-image-preview": "large", "max-snippet": -1},
        },
    openGraph: {
      type,
      locale: "nl_NL",
      url: canonical,
      siteName: "DRO Renovaties",
      title,
      description,
      ...(ogImage ? {images: [{url: ogImage, width: 1200, height: 630, alt: title}]} : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? {images: [ogImage]} : {}),
    },
  };
}

export function metadataFromSeo(
  seo: SeoSettings,
  fallbackTitle: string,
  options: Omit<BuildMetadataOptions, "seo" | "fallbackTitle"> = {pathname: "/"}
) {
  return buildPageMetadata({
    seo,
    fallbackTitle,
    ...options,
  });
}
