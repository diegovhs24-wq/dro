import {cmsImageUrl, fetchSanity} from "@/lib/sanity";
import {
  fallbackHomePage,
  fallbackServices,
  fallbackSiteSettings,
  mergeServicesWithFallback,
  withSiteSettingsFallback,
} from "@/lib/cms-fallback";
import type {
  CtaContent,
  FaqItem,
  HomeHeroContent,
  HomePageContent,
  IconTextItem,
  PartnerLogoItem,
  ProblemSolutionContent,
  ProjectItem,
  ReviewItem,
  SeoSettings,
  ServiceBlock,
  ServiceDetailContent,
  ServiceSummary,
  SiteSettings,
  AboutPageContent,
  BusinessPageContent,
  ContactPageContent,
  ListingPageContent,
  ProcessPageContent,
} from "@/lib/types";

const IMAGE_SOURCE_FIELDS = `
  image,
  externalImageUrl
`;

const SMART_LINK_FIELDS = `
  linkType,
  internalRef->{_type, "slug": slug.current},
  externalUrl,
  openInNewTab
`;

const SEO_FIELDS = `
  metaTitle,
  metaDescription,
  noIndex,
  openGraphImage{${IMAGE_SOURCE_FIELDS}}
`;

const CTA_FIELDS = `
  eyebrow,
  title,
  text,
  buttons[]{
    label,
    link{${SMART_LINK_FIELDS}},
    variant
  },
  ratingScore,
  ratingLabel
`;

const PAGE_HERO_FIELDS = `
  eyebrow,
  title,
  text,
  backgroundImage{${IMAGE_SOURCE_FIELDS}},
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref
`;

const ICON_TEXT_FIELDS = `
  title,
  text,
  icon,
  note,
  logo{${IMAGE_SOURCE_FIELDS}}
`;

const INTAKE_FORM_FIELDS = `
  intakeForm->{
    formTitle,
    timeLabel,
    description,
    privacyText,
    steps[]{
      title,
      subtitle,
      stepType,
      stepKey,
      options,
      fields[]{
        fieldKey,
        label,
        inputType,
        required,
        halfWidth
      }
    },
    successEyebrow,
    successTitle,
    successText,
    faqItems[]->{
      question,
      answer
    },
    submitLabel,
    nextLabel,
    backLabel,
    errorMessage
  }
`;

const HOME_HERO_FIELDS = `
  coverageText,
  backgroundImage{${IMAGE_SOURCE_FIELDS}},
  headlineTop,
  headlineHighlight,
  headlineBottom,
  description,
  trustItems[]{${ICON_TEXT_FIELDS}},
  note,
  ${INTAKE_FORM_FIELDS},
  stats[]{
    value,
    label,
    icon,
    rating
  },
  processIntro,
  processSteps[]{
    title,
    text,
    icon
  }
`;

const INDEX_CONTENT_BLOCKS = `
  contentBlocks[]{
    _type,
    _key,
    _type == "homeHeroBlock" => { hero{${HOME_HERO_FIELDS}} },
    _type == "pageHeroBlock" => { hero{${PAGE_HERO_FIELDS}} },
    _type == "problemSolutionBlock" => {
      problemEyebrow, problemTitle, problems,
      solutionEyebrow, solutionTitle, solutions, solutionNote,
      bannerTitle, bannerButtonLabel, bannerButtonHref
    },
    _type == "textBlock" => { eyebrow, title, text },
    _type == "iconCardsBlock" => { eyebrow, title, buttonLabel, buttonHref, items[]{${ICON_TEXT_FIELDS}} },
    _type == "partnersBlock" => { eyebrow, title, text },
    _type == "googleReviewsBlock" => { limit, compact },
    _type == "contactFormBlock" => { eyebrow, title, text, note, ${INTAKE_FORM_FIELDS} },
    _type == "aboutIntroBlock" => { eyebrow, title, intro, sketchLabels, sketchClosing, introItems[]{${ICON_TEXT_FIELDS}} },
    _type == "aboutTeamBlock" => { teamEyebrow, teamTitle, coreTeam[]{ name, role, image{${IMAGE_SOURCE_FIELDS}}, text }, teamBanner },
    _type == "aboutTeamImageBlock" => { teamImageEyebrow, teamImageTitle, teamImage{${IMAGE_SOURCE_FIELDS}} },
    _type == "processHeaderBlock" => { eyebrow, titlePrefix, titleHighlight, intro, note, sideNote, steps[]{ title, text, note, icon } },
    _type == "processBenefitsBlock" => { benefits[]{${ICON_TEXT_FIELDS}} },
    _type == "processTrustBlock" => { trustPoints[]{${ICON_TEXT_FIELDS}} },
    _type == "processFaqBlock" => { faqEyebrow, faqTitle, faqIntro, faqs[]->{question, answer} },
    _type == "processIntakeBannerBlock" => { intakeBannerTitle, intakeBannerText, buttonLabel, buttonHref },
    _type == "businessContentBlock" => { positionEyebrow, positionTitle, positionText, positionBanner, capacity, cards[]{ eyebrow, title, items } }
  }
`;

const SERVICES_INDEX_QUERY = `*[_type == "servicesIndex"][0]{
  title,
  ${INDEX_CONTENT_BLOCKS},
  listingSettings{ limit, layout },
  seo{${SEO_FIELDS}}
}`;

const PROJECTS_INDEX_QUERY = `*[_type == "projectsIndex"][0]{
  title,
  ${INDEX_CONTENT_BLOCKS},
  listingSettings{ limit, layout },
  seo{${SEO_FIELDS}}
}`;

const PAGE_BUILDER_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  seo{${SEO_FIELDS}},
  contentBlocks[]{
    _type,
    _key,
    _type == "homeHeroBlock" => {
      hero{${HOME_HERO_FIELDS}}
    },
    _type == "pageHeroBlock" => {
      hero{${PAGE_HERO_FIELDS}}
    },
    _type == "problemSolutionBlock" => {
      problemEyebrow,
      problemTitle,
      problems,
      solutionEyebrow,
      solutionTitle,
      solutions,
      solutionNote,
      bannerTitle,
      bannerButtonLabel,
      bannerButtonHref
    },
    _type == "textBlock" => {
      eyebrow,
      title,
      text
    },
    _type == "servicesListingBlock" => {
      limit,
      layout
    },
    _type == "projectsListingBlock" => {
      limit
    },
    _type == "iconCardsBlock" => {
      eyebrow,
      title,
      buttonLabel,
      buttonHref,
      items[]{${ICON_TEXT_FIELDS}}
    },
    _type == "partnersBlock" => {
      eyebrow,
      title,
      text
    },
    _type == "googleReviewsBlock" => {
      limit,
      compact
    },
    _type == "ctaBannerBlock" => {
      cta{${CTA_FIELDS}}
    },
    _type == "contactFormBlock" => {
      eyebrow,
      title,
      text,
      note,
      ${INTAKE_FORM_FIELDS}
    },
    _type == "aboutIntroBlock" => {
      eyebrow,
      title,
      intro,
      sketchLabels,
      sketchClosing,
      introItems[]{${ICON_TEXT_FIELDS}}
    },
    _type == "aboutTeamBlock" => {
      teamEyebrow,
      teamTitle,
      coreTeam[]{
        name,
        role,
        image{${IMAGE_SOURCE_FIELDS}},
        text
      },
      teamBanner
    },
    _type == "aboutTeamImageBlock" => {
      teamImageEyebrow,
      teamImageTitle,
      teamImage{${IMAGE_SOURCE_FIELDS}}
    },
    _type == "processHeaderBlock" => {
      eyebrow,
      titlePrefix,
      titleHighlight,
      intro,
      note,
      sideNote,
      steps[]{
        title,
        text,
        note,
        icon
      }
    },
    _type == "processBenefitsBlock" => {
      benefits[]{${ICON_TEXT_FIELDS}}
    },
    _type == "processTrustBlock" => {
      trustPoints[]{${ICON_TEXT_FIELDS}}
    },
    _type == "processFaqBlock" => {
      faqEyebrow,
      faqTitle,
      faqIntro,
      faqs[]->{question, answer}
    },
    _type == "processIntakeBannerBlock" => {
      intakeBannerTitle,
      intakeBannerText,
      buttonLabel,
      buttonHref
    },
    _type == "businessContentBlock" => {
      positionEyebrow,
      positionTitle,
      positionText,
      positionBanner,
      capacity,
      cards[]{
        eyebrow,
        title,
        items
      }
    }
  }
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  description,
  favicon{${IMAGE_SOURCE_FIELDS}},
  headerLogo{${IMAGE_SOURCE_FIELDS}},
  headerMenu[]{
    label,
    type,
    link{${SMART_LINK_FIELDS}},
    columns[]{
      title,
      links[]{
        label,
        link{${SMART_LINK_FIELDS}}
      }
    },
    promo{
      image{${IMAGE_SOURCE_FIELDS}},
      eyebrow,
      title,
      footerText
    }
  },
  headerButtons[]{
    label,
    link{${SMART_LINK_FIELDS}},
    variant
  },
  footer{
    "logo": brand.logo{${IMAGE_SOURCE_FIELDS}},
    "logoAlt": brand.logoAlt,
    "brandTitle": brand.brandTitle,
    "description": brand.description,
    "contactTitle": contact.contactTitle,
    "contactAddress": contact.contactAddress,
    "contactPhone": contact.contactPhone,
    "contactPhoneHref": contact.contactPhoneHref,
    "contactPhoneNote": contact.contactPhoneNote,
    "contactEmail": contact.contactEmail,
    "contactEmailHref": contact.contactEmailHref,
    "servicesTitle": services.servicesTitle,
    "businessTitle": commercial.businessTitle,
    "businessText": commercial.businessText,
    "businessItems": commercial.businessItems,
    "businessClosing": commercial.businessClosing,
    "statement": bottom.statement,
    "copyright": bottom.copyright,
    "legalLinks": bottom.legalLinks[]{label, href, openInNewTab}
  },
  footerCta{${CTA_FIELDS}},
  notFound{
    title,
    text,
    buttons[]{
      label,
      link{${SMART_LINK_FIELDS}},
      variant
    }
  },
  floatingActions{
    whatsappLabel,
    whatsappHref,
    intakeLabel,
    intakeHref
  },
  globalSeo{${SEO_FIELDS}},
  organizationSeo{
    legalName,
    siteUrl,
    logo{${IMAGE_SOURCE_FIELDS}},
    telephone,
    email,
    streetAddress,
    addressLocality,
    postalCode,
    addressRegion,
    addressCountry,
    latitude,
    longitude,
    areaServed,
    sameAs,
    priceRange
  }
}`;

const SERVICES_QUERY = `*[_type == "service"]|order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  icon,
  label,
  cardImage{${IMAGE_SOURCE_FIELDS}},
  summary,
  seo{${SEO_FIELDS}},
  pageContent{
    eyebrow,
    title,
    intro,
    sections[]{
      title,
      items
    },
    processTitle,
    processText,
    situations[]{
      title,
      items
    },
    examples,
    faqs[]->{question, answer}
  }
}`;

const SERVICE_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  icon,
  label,
  cardImage{${IMAGE_SOURCE_FIELDS}},
  summary,
  seo{${SEO_FIELDS}},
  pageContent{
    eyebrow,
    title,
    intro,
    sections[]{
      title,
      items
    },
    processTitle,
    processText,
    situations[]{
      title,
      items
    },
    examples,
    faqs[]->{question, answer}
  }
}`;

const PROJECTS_QUERY = `*[_type == "project"]|order(sortOrder asc, title asc){
  title,
  "slug": slug.current,
  description,
  story,
  images[]{${IMAGE_SOURCE_FIELDS}},
  location,
  type,
  duration,
  work_items,
  before,
  after,
  beforeImage{${IMAGE_SOURCE_FIELDS}},
  afterImage{${IMAGE_SOURCE_FIELDS}},
  seo{${SEO_FIELDS}}
}`;

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  description,
  story,
  images[]{${IMAGE_SOURCE_FIELDS}},
  location,
  type,
  duration,
  work_items,
  before,
  after,
  beforeImage{${IMAGE_SOURCE_FIELDS}},
  afterImage{${IMAGE_SOURCE_FIELDS}},
  seo{${SEO_FIELDS}}
}`;

const REVIEWS_QUERY = `*[_type == "review"]|order(sortOrder asc, name asc){
  name,
  location,
  image{${IMAGE_SOURCE_FIELDS}},
  quote
}`;

const PARTNERS_QUERY = `*[_type == "partner"]|order(sortOrder asc, name asc){
  name,
  image{${IMAGE_SOURCE_FIELDS}},
  accent
}`;

const EMPTY_SITE_SETTINGS: SiteSettings = {
  title: "DRO Renovaties",
  headerMenu: [],
  headerButtons: [],
  footer: {
    brandTitle: "DRO Renovaties",
    description: "",
    contactTitle: "",
    contactAddress: "",
    contactPhone: "",
    contactPhoneHref: "",
    contactPhoneNote: "",
    contactEmail: "",
    contactEmailHref: "",
    servicesTitle: "",
    businessTitle: "",
    businessText: "",
    businessItems: [],
    businessClosing: "",
    statement: "",
    copyright: "",
    legalLinks: [],
  },
  floatingActions: {
    whatsappLabel: "WhatsApp",
    whatsappHref: "#",
    intakeLabel: "Start intake",
    intakeHref: "/contact",
  },
};

type RawRecord = Record<string, unknown>;

type CmsBaseBlock = {
  _key?: string;
};

export type HomeHeroBlock = CmsBaseBlock & {
  _type: "homeHeroBlock";
  hero?: HomeHeroContent;
};

export type PageHeroBlock = CmsBaseBlock & {
  _type: "pageHeroBlock";
  hero?: ListingPageContent["hero"];
};

export type ProblemSolutionBlock = CmsBaseBlock & {
  _type: "problemSolutionBlock";
} & ProblemSolutionContent;

export type TextBlock = CmsBaseBlock & {
  _type: "textBlock";
  eyebrow?: string;
  title?: string;
  text?: string;
};

export type ServicesListingBlock = CmsBaseBlock & {
  _type: "servicesListingBlock";
  limit?: number;
  layout?: "default" | "fullGrid";
};

export type ProjectsListingBlock = CmsBaseBlock & {
  _type: "projectsListingBlock";
  limit?: number;
};

export type IconCardsBlock = CmsBaseBlock & {
  _type: "iconCardsBlock";
  eyebrow?: string;
  title?: string;
  buttonLabel?: string;
  buttonHref?: string;
  items?: IconTextItem[];
};

export type PartnersBlock = CmsBaseBlock & {
  _type: "partnersBlock";
  eyebrow?: string;
  title?: string;
  text?: string;
};

export type GoogleReviewsBlock = CmsBaseBlock & {
  _type: "googleReviewsBlock";
  limit?: number;
  compact?: boolean;
};

export type CtaBannerBlock = CmsBaseBlock & {
  _type: "ctaBannerBlock";
  cta?: CtaContent;
};

export type ContactFormBlock = CmsBaseBlock & {
  _type: "contactFormBlock";
  eyebrow?: string;
  title?: string;
  text?: string;
  note?: string;
  intakeForm?: import("@/lib/types").IntakeFormConfig;
};

export type AboutIntroBlock = CmsBaseBlock & {
  _type: "aboutIntroBlock";
} & Pick<AboutPageContent, "eyebrow" | "title" | "intro" | "sketchLabels" | "sketchClosing" | "introItems">;

export type AboutTeamBlock = CmsBaseBlock & {
  _type: "aboutTeamBlock";
} & Pick<AboutPageContent, "teamEyebrow" | "teamTitle" | "coreTeam" | "teamBanner">;

export type AboutTeamImageBlock = CmsBaseBlock & {
  _type: "aboutTeamImageBlock";
} & Pick<AboutPageContent, "teamImageEyebrow" | "teamImageTitle" | "teamImage">;

export type ProcessHeaderBlock = CmsBaseBlock & {
  _type: "processHeaderBlock";
} & Pick<ProcessPageContent, "eyebrow" | "titlePrefix" | "titleHighlight" | "intro" | "note" | "sideNote" | "steps">;

export type ProcessBenefitsBlock = CmsBaseBlock & {
  _type: "processBenefitsBlock";
  benefits?: IconTextItem[];
};

export type ProcessTrustBlock = CmsBaseBlock & {
  _type: "processTrustBlock";
  trustPoints?: IconTextItem[];
};

export type ProcessFaqBlock = CmsBaseBlock & {
  _type: "processFaqBlock";
} & Pick<ProcessPageContent, "faqEyebrow" | "faqTitle" | "faqIntro" | "faqs">;

export type ProcessIntakeBannerBlock = CmsBaseBlock & {
  _type: "processIntakeBannerBlock";
  intakeBannerTitle?: string;
  intakeBannerText?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export type BusinessContentBlock = CmsBaseBlock & {
  _type: "businessContentBlock";
} & Pick<
  BusinessPageContent,
  "positionEyebrow" | "positionTitle" | "positionText" | "positionBanner" | "capacity" | "cards"
>;

export type CmsDynamicPageBlock =
  | HomeHeroBlock
  | PageHeroBlock
  | ProblemSolutionBlock
  | TextBlock
  | ServicesListingBlock
  | ProjectsListingBlock
  | IconCardsBlock
  | PartnersBlock
  | GoogleReviewsBlock
  | CtaBannerBlock
  | ContactFormBlock
  | AboutIntroBlock
  | AboutTeamBlock
  | AboutTeamImageBlock
  | ProcessHeaderBlock
  | ProcessBenefitsBlock
  | ProcessTrustBlock
  | ProcessFaqBlock
  | ProcessIntakeBannerBlock
  | BusinessContentBlock;

export type CmsDynamicPage = {
  _id?: string;
  title?: string;
  slug?: string;
  seo?: SeoSettings;
  contentBlocks?: CmsDynamicPageBlock[];
};

export type PageFetchResult =
  | {status: "ok"; page: CmsDynamicPage}
  | {status: "not_found"}
  | {status: "unavailable"};

type SafeFetchResult<T> = {
  data: T | null;
  failed: boolean;
};

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<SafeFetchResult<T>> {
  try {
    const data = await fetchSanity<T>(query, params);
    return {data, failed: false};
  } catch {
    return {data: null, failed: true};
  }
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeCmsValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeCmsValue).filter((item) => item !== undefined);
  }

  if (!isRecord(value)) {
    return value;
  }

  if ("externalImageUrl" in value || "image" in value) {
    const imageUrl = cmsImageUrl(value, 1800);

    if (imageUrl) {
      return imageUrl;
    }
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, normalizeCmsValue(item)])
      .filter(([, item]) => item !== undefined)
  );
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function mapSeo(rawSeo: unknown): SeoSettings {
  const normalized = normalizeCmsValue(rawSeo);
  return isRecord(normalized) ? (normalized as SeoSettings) : {};
}

function toServiceSummary(raw: RawRecord): ServiceSummary | null {
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";
  const image = cmsImageUrl(raw.cardImage as never, 900);
  const summary = typeof raw.summary === "string" ? raw.summary : "";

  if (!slug || !title || !summary || !image) {
    return null;
  }

  return {
    slug,
    href: `/diensten/${slug}`,
    title,
    summary,
    image,
    icon: typeof raw.icon === "string" ? raw.icon : undefined,
    label: typeof raw.label === "string" ? raw.label : undefined,
  };
}

function mapServiceDetail(raw: RawRecord): ServiceDetailContent | null {
  const summary = toServiceSummary(raw);

  if (!summary) {
    return null;
  }

  const pageContent = normalizeCmsValue(raw.pageContent);
  const content = isRecord(pageContent) ? pageContent : {};

  return {
    slug: summary.slug,
    eyebrow: asString(content.eyebrow),
    title: asString(content.title) || summary.title,
    intro: asString(content.intro),
    sections: asArray<ServiceBlock>(content.sections),
    processTitle: asString(content.processTitle),
    processText: asString(content.processText),
    situations: asArray<ServiceBlock>(content.situations),
    examples: asStringArray(content.examples),
    faqs: asArray<FaqItem>(content.faqs),
    seo: mapSeo(raw.seo),
  };
}

function toProject(raw: RawRecord): ProjectItem | null {
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";

  if (!slug || !title) {
    return null;
  }

  const normalized = normalizeCmsValue(raw) as Partial<ProjectItem>;

  return {
    title,
    slug,
    description: normalized.description || "",
    story: normalized.story || "",
    images: Array.isArray(normalized.images) ? normalized.images : [],
    location: normalized.location || "",
    type: normalized.type || "",
    duration: normalized.duration || "",
    work_items: Array.isArray(normalized.work_items) ? normalized.work_items : [],
    before: normalized.before || "",
    after: normalized.after || "",
    beforeImage: normalized.beforeImage,
    afterImage: normalized.afterImage,
    seo: mapSeo(raw.seo),
  };
}

function mapSiteSettings(raw: unknown): SiteSettings {
  const normalized = normalizeCmsValue(raw);

  if (!isRecord(normalized)) {
    return EMPTY_SITE_SETTINGS;
  }

  const footer = isRecord(normalized.footer) ? normalized.footer : {};
  const floatingActions = isRecord(normalized.floatingActions) ? normalized.floatingActions : {};

  return {
    title: asString(normalized.title, EMPTY_SITE_SETTINGS.title),
    description: asString(normalized.description) || undefined,
    favicon: asString(normalized.favicon) || undefined,
    headerLogo: asString(normalized.headerLogo) || undefined,
    headerMenu: asArray<SiteSettings["headerMenu"][number]>(normalized.headerMenu),
    headerButtons: asArray<SiteSettings["headerButtons"][number]>(normalized.headerButtons),
    footer: {
      logo: asString(footer.logo) || undefined,
      logoAlt: asString(footer.logoAlt) || undefined,
      brandTitle: asString(footer.brandTitle, EMPTY_SITE_SETTINGS.footer.brandTitle),
      description: asString(footer.description),
      contactTitle: asString(footer.contactTitle),
      contactAddress: asString(footer.contactAddress),
      contactPhone: asString(footer.contactPhone),
      contactPhoneHref: asString(footer.contactPhoneHref),
      contactPhoneNote: asString(footer.contactPhoneNote),
      contactEmail: asString(footer.contactEmail),
      contactEmailHref: asString(footer.contactEmailHref),
      servicesTitle: asString(footer.servicesTitle),
      businessTitle: asString(footer.businessTitle),
      businessText: asString(footer.businessText),
      businessItems: asStringArray(footer.businessItems),
      businessClosing: asString(footer.businessClosing),
      statement: asString(footer.statement),
      copyright: asString(footer.copyright),
      legalLinks: asArray<SiteSettings["footer"]["legalLinks"][number]>(footer.legalLinks),
    },
    footerCta: isRecord(normalized.footerCta)
      ? (normalizeCmsValue(normalized.footerCta) as CtaContent)
      : undefined,
    notFound: isRecord(normalized.notFound)
      ? (normalizeCmsValue(normalized.notFound) as SiteSettings["notFound"])
      : undefined,
    floatingActions: {
      whatsappLabel: asString(floatingActions.whatsappLabel, EMPTY_SITE_SETTINGS.floatingActions.whatsappLabel),
      whatsappHref: asString(floatingActions.whatsappHref, EMPTY_SITE_SETTINGS.floatingActions.whatsappHref),
      intakeLabel: asString(floatingActions.intakeLabel, EMPTY_SITE_SETTINGS.floatingActions.intakeLabel),
      intakeHref: asString(floatingActions.intakeHref, EMPTY_SITE_SETTINGS.floatingActions.intakeHref),
    },
    globalSeo: mapSeo(normalized.globalSeo),
    organizationSeo: isRecord(normalized.organizationSeo)
      ? (normalizeCmsValue(normalized.organizationSeo) as SiteSettings["organizationSeo"])
      : undefined,
  };
}

export async function getSiteSettings() {
  const {data, failed} = await safeFetch<RawRecord | null>(SITE_SETTINGS_QUERY);

  if (failed || !data) {
    return fallbackSiteSettings;
  }

  return withSiteSettingsFallback(mapSiteSettings(data));
}

export async function getServices() {
  const {data, failed} = await safeFetch<RawRecord[] | null>(SERVICES_QUERY);

  if (failed) {
    return fallbackServices;
  }

  const services = data?.map(toServiceSummary).filter(Boolean) as ServiceSummary[] | undefined;
  return mergeServicesWithFallback(services || []);
}

export async function getServiceBySlug(slug: string) {
  const {data, failed} = await safeFetch<RawRecord | null>(SERVICE_QUERY, {slug});

  if (failed) {
    return null;
  }

  return data ? mapServiceDetail(data) : null;
}

export async function isCmsUnavailable() {
  const {failed} = await safeFetch<{_id?: string} | null>(`*[_type == "siteSettings"][0]{ _id }`);
  return failed;
}

export async function getServiceSlugs() {
  const services = await getServices();
  return services.map((service) => service.slug);
}

export async function getProjects() {
  const {data, failed} = await safeFetch<RawRecord[] | null>(PROJECTS_QUERY);

  if (failed || !data) {
    return [];
  }

  return (data.map(toProject).filter(Boolean) as ProjectItem[]) || [];
}

export async function getProjectBySlug(slug: string) {
  const {data, failed} = await safeFetch<RawRecord | null>(PROJECT_QUERY, {slug});

  if (failed) {
    return null;
  }

  return data ? toProject(data) : null;
}

export async function getReviews() {
  const {data, failed} = await safeFetch<RawRecord[] | null>(REVIEWS_QUERY);

  if (failed || !data) {
    return [];
  }

  const reviews = normalizeCmsValue(data) as ReviewItem[] | null;
  return reviews || [];
}

export async function getPartners() {
  const {data, failed} = await safeFetch<RawRecord[] | null>(PARTNERS_QUERY);

  if (failed || !data) {
    return [];
  }

  const partners = normalizeCmsValue(data) as PartnerLogoItem[] | null;
  return partners || [];
}

function normalizePage(raw: RawRecord | null, slug: string): CmsDynamicPage | null {
  if (!raw) {
    return null;
  }

  const normalized = normalizeCmsValue(raw) as CmsDynamicPage;
  const contentBlocks = Array.isArray(normalized.contentBlocks) ? normalized.contentBlocks : [];

  if (!contentBlocks.length) {
    return null;
  }

  return {
    ...normalized,
    slug: normalized.slug || slug,
    seo: mapSeo(normalized.seo),
    contentBlocks,
  } as CmsDynamicPage;
}

export async function getPageFetchResult(slug: string): Promise<PageFetchResult> {
  const {data, failed} = await safeFetch<RawRecord | null>(PAGE_BUILDER_QUERY, {slug});

  if (failed) {
    return {status: "unavailable"};
  }

  const page = normalizePage(data, slug);

  if (!page) {
    return {status: "not_found"};
  }

  return {status: "ok", page};
}

export async function getPageBySlug(slug: string) {
  const result = await getPageFetchResult(slug);

  if (result.status === "ok") {
    return result.page;
  }

  if (result.status === "unavailable" && slug === "home") {
    return fallbackHomePage as CmsDynamicPage;
  }

  return null;
}

export type IndexPageDoc = {
  title?: string;
  seo?: SeoSettings;
  contentBlocks?: CmsDynamicPageBlock[];
  listingSettings?: {
    limit?: number;
    layout?: string;
  };
};

function normalizeIndexPage(raw: RawRecord | null): IndexPageDoc | null {
  if (!raw) return null;
  const normalized = normalizeCmsValue(raw) as IndexPageDoc;
  return {
    ...normalized,
    seo: mapSeo(raw.seo),
    contentBlocks: Array.isArray(normalized.contentBlocks) ? normalized.contentBlocks : [],
  };
}

export async function getServicesIndex(): Promise<IndexPageDoc | null> {
  const {data, failed} = await safeFetch<RawRecord | null>(SERVICES_INDEX_QUERY);
  if (failed || !data) return null;
  return normalizeIndexPage(data);
}

export async function getProjectsIndex(): Promise<IndexPageDoc | null> {
  const {data, failed} = await safeFetch<RawRecord | null>(PROJECTS_INDEX_QUERY);
  if (failed || !data) return null;
  return normalizeIndexPage(data);
}

export {metadataFromSeo, buildPageMetadata} from "@/lib/seo/metadata";
export type {OrganizationSeo} from "@/lib/seo/site";
export type {
  AboutPageContent,
  BusinessPageContent,
  ContactPageContent,
  HomePageContent,
  ListingPageContent,
  ProcessPageContent,
  ProjectItem,
  ReviewItem,
  ServiceDetailContent,
  ServiceSummary,
  SiteSettings,
} from "@/lib/types";
