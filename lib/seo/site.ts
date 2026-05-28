import type {OrganizationSeo, SiteSettings} from "@/lib/types";

export type {OrganizationSeo} from "@/lib/types";

export function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  return (configured || "https://www.drorenovaties.nl").replace(/\/+$/, "");
}

export function absoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalizedPath === "/") {
    return getSiteUrl();
  }
  return `${getSiteUrl()}${normalizedPath}`;
}

export function resolveOrganizationSeo(
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null
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
} {
  const footer = siteSettings.footer;

  return {
    legalName: organizationSeo?.legalName || footer.brandTitle || siteSettings.title,
    siteUrl: organizationSeo?.siteUrl || getSiteUrl(),
    logo: organizationSeo?.logo || footer.logo,
    telephone:
      organizationSeo?.telephone ||
      footer.contactPhoneHref.replace(/^tel:/, "") ||
      footer.contactPhone,
    email:
      organizationSeo?.email ||
      footer.contactEmailHref.replace(/^mailto:/, "") ||
      footer.contactEmail,
    streetAddress: organizationSeo?.streetAddress || "Den Haag en omgeving",
    addressLocality: organizationSeo?.addressLocality || "Den Haag",
    postalCode: organizationSeo?.postalCode || "",
    addressRegion: organizationSeo?.addressRegion || "Zuid-Holland",
    addressCountry: organizationSeo?.addressCountry || "NL",
    latitude: organizationSeo?.latitude,
    longitude: organizationSeo?.longitude,
    areaServed: organizationSeo?.areaServed?.length
      ? organizationSeo.areaServed
      : ["Zuid-Holland", "Noord-Holland", "Utrecht", "Zeeland", "Randstad"],
    sameAs: organizationSeo?.sameAs || [],
    priceRange: organizationSeo?.priceRange || "$$",
  };
}
