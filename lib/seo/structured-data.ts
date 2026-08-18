import type {OrganizationSeo} from "@/lib/seo/site";
import {absoluteUrl, resolveOrganizationSeo} from "@/lib/seo/site";
import type {SiteSettings} from "@/lib/types";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqStructuredItem = {
  question: string;
  answer: string | string[];
};

export type ServiceStructuredDataInput = {
  name: string;
  description?: string;
  slug: string;
  url?: string;
};

export type ArticleStructuredDataInput = {
  title: string;
  description?: string;
  pathname: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
};

type JsonLd = Record<string, unknown>;

function organizationId(siteUrl: string) {
  return `${siteUrl}/#organization`;
}

function localBusinessId(siteUrl: string) {
  return `${siteUrl}/#localbusiness`;
}

function contractorId(siteUrl: string) {
  return `${siteUrl}/#contractor`;
}

export function buildOrganizationGraph(
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null,
  extraAreaServed: string[] = []
) {
  const org = resolveOrganizationSeo(siteSettings, organizationSeo, extraAreaServed);
  const orgId = organizationId(org.siteUrl);
  const localId = localBusinessId(org.siteUrl);
  const contractorGraphId = contractorId(org.siteUrl);

  const address = {
    "@type": "PostalAddress",
    streetAddress: org.streetAddress,
    addressLocality: org.addressLocality,
    ...(org.postalCode ? {postalCode: org.postalCode} : {}),
    addressRegion: org.addressRegion,
    addressCountry: org.addressCountry,
  };

  const geo =
    typeof org.latitude === "number" && typeof org.longitude === "number"
      ? {
          "@type": "GeoCoordinates",
          latitude: org.latitude,
          longitude: org.longitude,
        }
      : undefined;

  const organization: JsonLd = {
    "@type": "Organization",
    "@id": orgId,
    name: org.name,
    legalName: org.legalName,
    url: org.siteUrl,
    description: siteSettings.description || siteSettings.footer.description,
    ...(org.slogan ? {slogan: org.slogan} : {}),
    ...(org.logo ? {logo: absoluteUrl(org.logo)} : {}),
    ...(org.sameAs.length ? {sameAs: org.sameAs} : {}),
    ...(org.knowsAbout.length ? {knowsAbout: org.knowsAbout} : {}),
    ...(org.kvkNumber
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "KVK",
            value: org.kvkNumber,
          },
        }
      : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: org.telephone,
        email: org.email,
        contactType: "customer service",
        areaServed: org.addressCountry,
        availableLanguage: ["Dutch", "English"],
      },
    ],
  };

  const aggregateRating =
    typeof org.aggregateRatingValue === "number" && typeof org.aggregateRatingCount === "number"
      ? {
          "@type": "AggregateRating",
          ratingValue: org.aggregateRatingValue,
          reviewCount: org.aggregateRatingCount,
        }
      : undefined;

  const localBusiness: JsonLd = {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": localId,
    name: org.name,
    legalName: org.legalName,
    url: org.siteUrl,
    image: org.logo ? absoluteUrl(org.logo) : undefined,
    telephone: org.telephone,
    email: org.email,
    priceRange: org.priceRange,
    address,
    ...(geo ? {geo} : {}),
    ...(aggregateRating ? {aggregateRating} : {}),
    areaServed: org.areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    parentOrganization: {"@id": orgId},
  };

  const contractor: JsonLd = {
    "@type": "HomeAndConstructionBusiness",
    additionalType: "https://schema.org/GeneralContractor",
    "@id": contractorGraphId,
    name: org.name,
    url: org.siteUrl,
    telephone: org.telephone,
    email: org.email,
    address,
    ...(geo ? {geo} : {}),
    areaServed: org.areaServed,
    parentOrganization: {"@id": orgId},
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Renovatie en afbouw",
        areaServed: org.areaServed,
      },
    },
  };

  return [organization, localBusiness, contractor];
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildServiceSchema(
  service: ServiceStructuredDataInput,
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null
) {
  const org = resolveOrganizationSeo(siteSettings, organizationSeo);

  return {
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url || absoluteUrl(`/${service.slug}`),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": localBusinessId(org.siteUrl),
      name: org.legalName,
    },
    areaServed: org.areaServed,
    serviceType: service.name,
  };
}

export type LocationPlaceInput = {
  name: string;
  geo?: {lat: number; lng: number};
};

export function buildLocationPlace(location: LocationPlaceInput) {
  return {
    "@type": "City",
    name: location.name,
    ...(location.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: location.geo.lat,
            longitude: location.geo.lng,
          },
        }
      : {}),
  };
}

export function buildLocationServiceSchema(
  {
    serviceName,
    serviceDescription,
    location,
    pathname,
  }: {
    serviceName: string;
    serviceDescription?: string;
    location: LocationPlaceInput;
    pathname: string;
  },
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null
) {
  const org = resolveOrganizationSeo(siteSettings, organizationSeo);

  return {
    "@type": "Service",
    "@id": `${absoluteUrl(pathname)}#service`,
    name: serviceName,
    description: serviceDescription,
    url: absoluteUrl(pathname),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": localBusinessId(org.siteUrl),
      name: org.name,
    },
    areaServed: buildLocationPlace(location),
    serviceType: serviceName,
  };
}

export function buildArticleSchema(
  article: ArticleStructuredDataInput,
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null
) {
  const org = resolveOrganizationSeo(siteSettings, organizationSeo);

  return {
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.pathname),
    inLanguage: "nl-NL",
    ...(article.image ? {image: [absoluteUrl(article.image)]} : {}),
    ...(article.publishedAt ? {datePublished: article.publishedAt} : {}),
    ...(article.updatedAt ? {dateModified: article.updatedAt} : {}),
    author: {
      "@type": "Person",
      name: article.authorName || org.legalName,
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId(org.siteUrl),
      name: org.legalName,
      ...(org.logo ? {logo: absoluteUrl(org.logo)} : {}),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(article.pathname),
    },
  };
}

export function buildFaqPageSchema(faqs: FaqStructuredItem[]) {
  if (!faqs.length) {
    return null;
  }

  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(faq.answer) ? faq.answer.join("\n") : faq.answer,
      },
    })),
  };
}

export function buildWebPageSchema({
  title,
  description,
  pathname,
}: {
  title: string;
  description?: string;
  pathname: string;
}) {
  return {
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(pathname),
    inLanguage: "nl-NL",
    isPartOf: {
      "@type": "WebSite",
      name: "DRO Renovaties",
      url: getSiteUrlFromPath(pathname),
    },
  };
}

function getSiteUrlFromPath(_pathname: string) {
  return absoluteUrl("/");
}

export function buildJsonLdGraph(items: Array<JsonLd | null | undefined>) {
  const graph = items.filter(Boolean) as JsonLd[];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
