import type {OrganizationSeo, SiteSettings} from "@/lib/types";
import {BUSINESS, getReviewSnapshot, stripOutdatedClaims} from "@/lib/seo/business";

export type {OrganizationSeo} from "@/lib/types";

export function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  const base = (configured || "https://www.dro-renovaties.nl").replace(/\/+$/, "");

  // Forceert de canonical www-host voor het productiedomein, ook als een
  // env var (NEXT_PUBLIC_SITE_URL/SITE_URL) verkeerd op de apex-host staat.
  // Andere hosts (Vercel-previews) blijven ongemoeid.
  if (/^https?:\/\/(www\.)?dro-renovaties\.nl$/i.test(base)) {
    return "https://www.dro-renovaties.nl";
  }

  return base;
}

export function absoluteUrl(pathname: string) {
  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalizedPath === "/") {
    return getSiteUrl();
  }
  return `${getSiteUrl()}${normalizedPath}`;
}

// Kale Google-URL zonder tracking-parameters (alleen kgmid), zodat sameAs
// een stabiele, eenduidige verwijzing naar het bedrijfsprofiel is.
export function cleanSameAs(urls: string[] = []): string[] {
  const cleaned = urls
    .map((raw) => {
      try {
        const url = new URL(raw.trim());
        if (/(^|\.)google\.[a-z.]+$/i.test(url.hostname) && url.searchParams.get("kgmid")) {
          return `https://www.google.com/search?kgmid=${url.searchParams.get("kgmid")}`;
        }
        url.hash = "";
        ["utm_source", "utm_medium", "utm_campaign", "hl", "igsh"].forEach((key) =>
          url.searchParams.delete(key)
        );
        return url.toString().replace(/\/$/, "");
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  return Array.from(new Set(cleaned));
}

export type ResolvedOrganization = {
  name: string;
  legalName: string;
  alternateNames: string[];
  slogan?: string;
  description: string;
  siteUrl: string;
  logo?: string;
  telephone: string;
  email: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion: string;
  addressCountry: string;
  latitude?: number;
  longitude?: number;
  areaServed: string[];
  sameAs: string[];
  knowsAbout: string[];
  priceRange: string;
  aggregateRatingValue: number;
  aggregateRatingCount: number;
  kvkNumber: string;
  vatId: string;
};

export function resolveOrganizationSeo(
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null,
  extraAreaServed: string[] = []
): ResolvedOrganization {
  const footer = siteSettings.footer;
  const reviews = getReviewSnapshot(organizationSeo);
  const dedupedAreaServed = Array.from(
    new Set([
      ...BUSINESS.coreAreaServed,
      // Alleen plaatsen waar een eigen pagina voor bestaat (GEO-05); losse
      // CMS-waarden als Amsterdam/Utrecht zonder pagina vallen weg.
      ...(extraAreaServed.length ? extraAreaServed : organizationSeo?.areaServed || []),
    ].map((area) => area.trim()).filter(Boolean))
  );

  return {
    name: organizationSeo?.name || BUSINESS.name,
    // Juridische gegevens altijd uit BUSINESS (KvK-schrijfwijze), nooit uit het CMS.
    legalName: BUSINESS.legalName,
    alternateNames: [...BUSINESS.alternateNames],
    slogan: organizationSeo?.slogan || BUSINESS.slogan,
    description: stripOutdatedClaims(BUSINESS.description),
    siteUrl: getSiteUrl(),
    logo: organizationSeo?.logo || footer?.logo,
    telephone: BUSINESS.phone.e164,
    email: organizationSeo?.email || footer?.contactEmailHref?.replace(/^mailto:/, "") || BUSINESS.email,
    streetAddress: BUSINESS.address.streetAddress,
    addressLocality: BUSINESS.address.addressLocality,
    postalCode: organizationSeo?.postalCode || BUSINESS.address.postalCode,
    addressRegion: BUSINESS.address.addressRegion,
    addressCountry: BUSINESS.address.addressCountry,
    latitude: organizationSeo?.latitude,
    longitude: organizationSeo?.longitude,
    areaServed: dedupedAreaServed,
    sameAs: cleanSameAs(organizationSeo?.sameAs || []),
    priceRange: organizationSeo?.priceRange || "€€€",
    aggregateRatingValue: reviews.ratingValue,
    aggregateRatingCount: reviews.reviewCount,
    knowsAbout: Array.from(
      new Set([...BUSINESS.specialisms, ...(organizationSeo?.knowsAbout || [])])
    ),
    kvkNumber: BUSINESS.kvkNumber,
    vatId: BUSINESS.vatId,
  };
}
