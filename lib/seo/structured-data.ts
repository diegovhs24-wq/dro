import type {OrganizationSeo} from "@/lib/seo/site";
import {absoluteUrl, getSiteUrl, resolveOrganizationSeo} from "@/lib/seo/site";
import {BUSINESS} from "@/lib/seo/business";
import type {SiteSettings} from "@/lib/types";

// Structured data volgens schema.org, opgebouwd als één samenhangende graph.
//
// Entity-model (GEO-05): er is precies één bedrijfsentiteit, met @id
// `${site}/#organization`, van het type GeneralContractor (een subtype van
// HomeAndConstructionBusiness > LocalBusiness > Organization). Alle andere
// nodes (WebSite, WebPage, Service, BlogPosting) verwijzen ernaar via @id in
// plaats van eigen, afwijkende kopieen te maken. Daardoor zien Google, Bing en
// AI-systemen één bedrijf met één naam, adres en telefoonnummer.

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

export function organizationId(siteUrl: string = getSiteUrl()) {
  return `${siteUrl}/#organization`;
}

export function websiteId(siteUrl: string = getSiteUrl()) {
  return `${siteUrl}/#website`;
}

export function founderId(siteUrl: string = getSiteUrl()) {
  return `${siteUrl}/#projectleider`;
}


const orgRef = () => ({"@id": organizationId()});

function postalAddress(org: ReturnType<typeof resolveOrganizationSeo>) {
  return {
    "@type": "PostalAddress",
    streetAddress: org.streetAddress,
    addressLocality: org.addressLocality,
    ...(org.postalCode ? {postalCode: org.postalCode} : {}),
    addressRegion: org.addressRegion,
    addressCountry: org.addressCountry,
  };
}

export type OrganizationGraphOptions = {
  services?: Array<{title: string; href: string; summary?: string}>;
};

export function buildOrganizationGraph(
  siteSettings: SiteSettings,
  organizationSeo?: OrganizationSeo | null,
  extraAreaServed: string[] = [],
  options: OrganizationGraphOptions = {}
): JsonLd[] {
  const org = resolveOrganizationSeo(siteSettings, organizationSeo, extraAreaServed);
  const siteUrl = org.siteUrl;

  const geo =
    typeof org.latitude === "number" && typeof org.longitude === "number"
      ? {"@type": "GeoCoordinates", latitude: org.latitude, longitude: org.longitude}
      : undefined;

  const founder: JsonLd = {
    "@type": "Person",
    "@id": founderId(siteUrl),
    name: BUSINESS.founder.name,
    jobTitle: BUSINESS.founder.jobTitle,
    worksFor: orgRef(),
  };

  const offerCatalog = options.services?.length
    ? {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Diensten van DRO Renovaties",
          itemListElement: options.services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              ...(service.summary ? {description: service.summary} : {}),
              url: absoluteUrl(service.href),
              provider: orgRef(),
            },
          })),
        },
      }
    : {};

  const organization: JsonLd = {
    "@type": "GeneralContractor",
    "@id": organizationId(siteUrl),
    name: org.name,
    legalName: org.legalName,
    alternateName: org.alternateNames,
    url: siteUrl,
    description: org.description,
    ...(org.slogan ? {slogan: org.slogan} : {}),
    ...(org.logo
      ? {
          logo: {"@type": "ImageObject", url: absoluteUrl(org.logo)},
          image: absoluteUrl(org.logo),
        }
      : {}),
    telephone: org.telephone,
    email: org.email,
    address: postalAddress(org),
    ...(geo ? {geo} : {}),
    priceRange: org.priceRange,
    currenciesAccepted: "EUR",
    paymentAccepted: "Bankoverschrijving",
    areaServed: org.areaServed.map((area) => ({"@type": "AdministrativeArea", name: area})),
    knowsAbout: org.knowsAbout,
    knowsLanguage: ["nl", "en"],
    identifier: [
      {"@type": "PropertyValue", propertyID: "KvK", value: org.kvkNumber},
      {"@type": "PropertyValue", propertyID: "BTW", value: org.vatId},
    ],
    vatID: org.vatId,
    hasCredential: BUSINESS.credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      name: credential.name,
      credentialCategory: credential.category,
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: org.telephone,
        email: org.email,
        contactType: "customer service",
        areaServed: "NL",
        availableLanguage: ["nl", "en"],
      },
    ],
    ...(org.sameAs.length ? {sameAs: org.sameAs} : {}),
    // Bewust GEEN aggregateRating: Google toont geen sterren voor
    // zelf-gepubliceerde LocalBusiness-reviews en ziet het als beleidsrisico.
    // De Google-score staat als zichtbare tekst met bron en datum op de site.
    ...offerCatalog,
  };

  const website: JsonLd = {
    "@type": "WebSite",
    "@id": websiteId(siteUrl),
    url: siteUrl,
    name: org.name,
    inLanguage: "nl-NL",
    publisher: orgRef(),
  };

  // Teamleden staan bewust niet als `employee` in de graph: hun dienstverband
  // (in loondienst of vaste partner) is niet geverifieerd.
  return [organization, website, founder];
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
  const url = service.url || absoluteUrl(`/${service.slug}`);

  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    ...(service.description ? {description: service.description} : {}),
    url,
    serviceType: service.name,
    provider: orgRef(),
    areaServed: org.areaServed.map((area) => ({"@type": "AdministrativeArea", name: area})),
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
  _siteSettings?: SiteSettings,
  _organizationSeo?: OrganizationSeo | null
) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(pathname)}#service`,
    name: serviceName,
    ...(serviceDescription ? {description: serviceDescription} : {}),
    url: absoluteUrl(pathname),
    provider: orgRef(),
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
  const authorName = article.authorName?.trim();

  // De auteur "Therab" in Sanity is de oprichter: koppel aan dezelfde Person-node
  // zodat expertise (E-E-A-T) bij één herkenbare persoon samenkomt. Zonder
  // bekende auteur is het bedrijf de auteur (als Organization, niet als Person).
  const isFounder =
    !authorName || BUSINESS.founder.name.toLowerCase().startsWith(authorName.toLowerCase());
  const author = isFounder
    ? {"@id": founderId(org.siteUrl)}
    : {"@type": "Person", name: authorName, worksFor: orgRef()};

  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(article.pathname)}#article`,
    headline: article.title,
    ...(article.description ? {description: article.description} : {}),
    url: absoluteUrl(article.pathname),
    inLanguage: "nl-NL",
    ...(article.image ? {image: [absoluteUrl(article.image)]} : {}),
    ...(article.publishedAt ? {datePublished: article.publishedAt} : {}),
    ...(article.updatedAt || article.publishedAt
      ? {dateModified: article.updatedAt || article.publishedAt}
      : {}),
    author,
    publisher: orgRef(),
    isPartOf: {"@id": websiteId(org.siteUrl)},
    mainEntityOfPage: {"@id": `${absoluteUrl(article.pathname)}#webpage`},
  };
}

export function buildFaqPageSchema(faqs: FaqStructuredItem[]) {
  const valid = faqs.filter((faq) => faq.question?.trim() && faq.answer && faq.answer.length);
  if (!valid.length) {
    return null;
  }

  return {
    "@type": "FAQPage",
    mainEntity: valid.map((faq) => ({
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
  type = "WebPage",
  dateModified,
}: {
  title: string;
  description?: string;
  pathname: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  dateModified?: string;
}) {
  const url = absoluteUrl(pathname);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    name: title,
    ...(description ? {description} : {}),
    url,
    inLanguage: "nl-NL",
    isPartOf: {"@id": websiteId()},
    about: orgRef(),
    publisher: orgRef(),
    ...(dateModified ? {dateModified} : {}),
  };
}

export function buildJsonLdGraph(items: Array<JsonLd | null | undefined>) {
  const graph = items.filter(Boolean) as JsonLd[];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
