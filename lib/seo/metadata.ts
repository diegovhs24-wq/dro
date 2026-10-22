import type {Metadata} from "next";
import type {SeoSettings} from "@/lib/types";
import {absoluteUrl, getSiteUrl} from "@/lib/seo/site";

// Standaard deelafbeelding (WhatsApp, LinkedIn, Google): echte teamfoto, 1200 x 630.
export const DEFAULT_OG_IMAGE = "/og/dro-renovaties.jpg";

// Google toont ongeveer 155 tot 160 tekens. Langere teksten (ook uit het CMS)
// worden netjes op een woordgrens ingekort in plaats van midden in een woord.
export const META_DESCRIPTION_MAX = 160;

export function clampDescription(text?: string, max = META_DESCRIPTION_MAX): string | undefined {
  if (!text) return text;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const sentence = cut.lastIndexOf(". ");
  if (sentence >= max * 0.6) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

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
  const description = clampDescription(seo.metaDescription || fallbackDescription);
  const canonical = absoluteUrl(pathname);
  const ogImage = seo.openGraphImage || image || DEFAULT_OG_IMAGE;
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    robots: seo.noIndex
      ? // noindex,follow: pagina niet in de index, maar links blijven gevolgd.
        {index: false, follow: true, googleBot: {index: false, follow: true}}
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
