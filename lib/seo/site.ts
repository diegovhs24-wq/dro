import type {OrganizationSeo, SiteSettings} from "@/lib/types";

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

export function resolveOrganizationSeo(
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null,
  extraAreaServed: string[] = []
): Required<
  Pick<
    OrganizationSeo,
    | "legalName"
    | "telephone"
    | "email"
    | "streetAddress"
    | "addressLocality"
    | "postalCode"
    | "addressRegion"
    | "addressCountry"
    | "areaServed"
    | "sameAs"
    | "priceRange"
  >
> & {
  siteUrl: string;
  logo?: string;
  latitude?: number;
  longitude?: number;
  aggregateRatingValue?: number;
  aggregateRatingCount?: number;
  name: string;
  slogan?: string;
  knowsAbout: string[];
  kvkNumber: string;
} {
  const footer = siteSettings.footer;
  const dedupedAreaServed = Array.from(
    new Set([
      ...(organizationSeo?.areaServed?.length
        ? organizationSeo.areaServed
        : ["Zuid-Holland", "Noord-Holland", "Utrecht", "Zeeland", "Randstad"]),
      ...extraAreaServed,
    ])
  );

  return {
    name: organizationSeo?.name || footer.brandTitle || siteSettings.title,
    legalName: organizationSeo?.legalName || footer.brandTitle || siteSettings.title,
    slogan: organizationSeo?.slogan,
    siteUrl: organizationSeo?.siteUrl || getSiteUrl(),
    logo: organizationSeo?.logo || footer.logo,
    telephone:
      organizationSeo?.telephone ||
      footer.contactPhoneHref.replace(/^tel:/, "") ||
      footer.contactPhone ||
      "0850871814",
    email:
      organizationSeo?.email ||
      footer.contactEmailHref.replace(/^mailto:/, "") ||
      footer.contactEmail ||
      "info@dro-renovaties.nl",
    streetAddress: organizationSeo?.streetAddress || "Orionstraat 235",
    addressLocality: organizationSeo?.addressLocality || "Den Haag",
    postalCode: organizationSeo?.postalCode || "",
    addressRegion: organizationSeo?.addressRegion || "Zuid-Holland",
    addressCountry: organizationSeo?.addressCountry || "NL",
    latitude: organizationSeo?.latitude,
    longitude: organizationSeo?.longitude,
    areaServed: dedupedAreaServed,
    sameAs: organizationSeo?.sameAs || [],
    priceRange: organizationSeo?.priceRange || "$$",
    aggregateRatingValue: organizationSeo?.aggregateRatingValue ?? 4.8,
    aggregateRatingCount: organizationSeo?.aggregateRatingCount ?? 273,
    knowsAbout: organizationSeo?.knowsAbout?.length ? organizationSeo.knowsAbout : [],
    kvkNumber: organizationSeo?.kvkNumber || "94825653",
  };
}
