import {cmsImageUrl, fetchSanity} from "@/lib/sanity";
import {
  fallbackHomePage,
  fallbackServices,
  fallbackSiteSettings,
  mergeServicesWithFallback,
  withSiteSettingsFallback,
} from "@/lib/cms-fallback";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPostDetail,
  BlogPostSummary,
  CtaContent,
  DarkAssuranceGridContent,
  FaqItem,
  HomeHeroContent,
  HomePageContent,
  IconTextItem,
  PartnerLogoItem,
  PtBlock,
  ProblemSolutionContent,
  ProjectItem,
  RichTextContent,
  RichTextImageBlock,
  ReviewItem,
  SeoSettings,
  ServiceBlock,
  ServiceDetailContent,
  ServiceSummary,
  SiteSettings,
  SmartLink,
  AboutPageContent,
  BusinessPageContent,
  ContactPageContent,
  EditorialPrinciplesContent,
  CenteredActionBannerContent,
  FaqAnswersGridContent,
  ListingPageContent,
  LogoCardGridContent,
  MetricsBandContent,
  ProjectsShowcaseGridContent,
  ProcessPageContent,
  ReviewShowcaseContent,
  SplitIntroContent,
  SplitFeatureListContent,
  StackedStepsListContent,
  SplitTimelineContent,
  TeamProfilesShowcaseContent,
  VisitInvitationContent,
  VideoChecklistItem,
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
  primaryLink{${SMART_LINK_FIELDS}},
  secondaryLabel,
  secondaryLink{${SMART_LINK_FIELDS}}
`;

const SPLIT_INTRO_FIELDS = `
  eyebrow,
  titlePrefix,
  titleHighlight,
  titleSuffix,
  description,
  primaryButtonLabel,
  primaryButtonLink{${SMART_LINK_FIELDS}},
  secondaryNotePrefix,
  secondaryNoteLinkLabel,
  secondaryNoteLink{${SMART_LINK_FIELDS}},
  secondaryNoteSuffix,
  image{${IMAGE_SOURCE_FIELDS}},
  imageCaption,
  referenceScreenshot{${IMAGE_SOURCE_FIELDS}}
`;

const METRICS_BAND_FIELDS = `
  eyebrow,
  stats[]{
    value,
    suffix,
    label
  },
  referenceScreenshot{${IMAGE_SOURCE_FIELDS}}
`;

const EDITORIAL_PRINCIPLES_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  sideIntro,
  content,
  pillars[]{
    title,
    text
  },
  referenceScreenshot{${IMAGE_SOURCE_FIELDS}}
`;

const REVIEW_SHOWCASE_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  ratingValue,
  reviewsSummary,
  ctaLabel,
  ctaLink{${SMART_LINK_FIELDS}},
  selectedReviews[]->{
    name,
    location,
    image{${IMAGE_SOURCE_FIELDS}},
    quote
  }
`;

const LOGO_CARD_GRID_FIELDS = `
  eyebrow,
  title,
  text,
  partners[]->{
    name,
    category,
    image{${IMAGE_SOURCE_FIELDS}},
    accent
  }
`;

const TEAM_PROFILES_SHOWCASE_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  intro,
  profiles[]{
    image{${IMAGE_SOURCE_FIELDS}},
    photoCredit,
    name,
    role,
    whatIDo,
    why
  },
  teamImage{${IMAGE_SOURCE_FIELDS}},
  teamImageCredit,
  closingText
`;

const VISIT_INVITATION_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  description,
  primaryButtonLabel,
  primaryButtonLink{${SMART_LINK_FIELDS}},
  secondaryNote,
  image{${IMAGE_SOURCE_FIELDS}},
  imageCaption
`;

const SPLIT_TIMELINE_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  description,
  highlightLabel,
  milestones[]{
    eyebrow,
    title,
    text
  },
  assurancePoints[]{
    title,
    text
  }
`;

const FAQ_ANSWERS_GRID_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  intro,
  faqs[]->{
    question,
    "answer": pt::text(answer)
  }
`;

const PROJECTS_SHOWCASE_GRID_FIELDS = `
  sectionNumber,
  eyebrow,
  title,
  intro,
  projects[]->{
    "slug": slug.current,
    title,
    location,
    type,
    duration,
    before,
    after,
    "beforeImage": beforeImage{${IMAGE_SOURCE_FIELDS}},
    "afterImage": afterImage{${IMAGE_SOURCE_FIELDS}}
  }
`;

const STACKED_STEPS_LIST_FIELDS = `
  items[]{
    _type,
    _type == "stackedStepsStepItem" => {
      icon,
      stepLabel,
      title,
      description,
      callout{
        title,
        text
      }
    },
    _type == "stackedStepsMediaItem" => {
      image{${IMAGE_SOURCE_FIELDS}},
      caption
    }
  },
  referenceScreenshot{${IMAGE_SOURCE_FIELDS}}
`;

const SPLIT_FEATURE_LIST_FIELDS = `
  eyebrow,
  title,
  description,
  image{${IMAGE_SOURCE_FIELDS}},
  imageCaption,
  features[]{
    icon,
    title,
    text
  }
`;

const DARK_ASSURANCE_GRID_FIELDS = `
  eyebrow,
  title,
  items[]{
    title,
    text
  }
`;

const CENTERED_ACTION_BANNER_FIELDS = `
  title,
  primaryButtonLabel,
  primaryButtonLink{${SMART_LINK_FIELDS}},
  secondaryButtonLabel,
  secondaryButtonLink{${SMART_LINK_FIELDS}}
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
      "answer": pt::text(answer)
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
    _type == "splitIntroBlock" => { ${SPLIT_INTRO_FIELDS} },
    _type == "editorialPrinciplesBlock" => { ${EDITORIAL_PRINCIPLES_FIELDS} },
    _type == "metricsBandBlock" => { ${METRICS_BAND_FIELDS} },
    _type == "problemSolutionBlock" => {
      problemEyebrow, problemTitle, problems,
      solutionEyebrow, solutionTitle, solutions, solutionNote,
      bannerTitle, bannerButtonLabel, bannerButtonLink{${SMART_LINK_FIELDS}}
    },
    _type == "textBlock" => { eyebrow, title, description },
    _type == "servicesListingBlock" => { limit, layout },
    _type == "projectsListingBlock" => { limit },
    _type == "featuredServicesBlock" => {
      eyebrow, title, viewAllLabel, viewAllLink{${SMART_LINK_FIELDS}},
      services[]->{
        title,
        "slug": slug.current,
        "href": "/diensten/" + slug.current,
        summary,
        "image": cardImage{${IMAGE_SOURCE_FIELDS}},
        icon,
        label
      }
    },
    _type == "featuredProjectsBlock" => {
      eyebrow, title, viewAllLabel, viewAllLink{${SMART_LINK_FIELDS}},
      projects[]->{
        title,
        "slug": slug.current,
        description,
        before,
        after,
        "beforeImage": beforeImage{${IMAGE_SOURCE_FIELDS}},
        "afterImage": afterImage{${IMAGE_SOURCE_FIELDS}}
      }
    },
    _type == "iconCardsBlock" => { eyebrow, title, buttonLabel, buttonLink{${SMART_LINK_FIELDS}}, items[]{${ICON_TEXT_FIELDS}} },
    _type == "partnersBlock" => { eyebrow, title, text },
    _type == "logoCardGridBlock" => { ${LOGO_CARD_GRID_FIELDS} },
    _type == "googleReviewsBlock" => { limit, compact },
    _type == "reviewShowcaseBlock" => { ${REVIEW_SHOWCASE_FIELDS} },
    _type == "ctaBannerBlock" => { cta{${CTA_FIELDS}} },
    _type == "contactFormBlock" => { eyebrow, title, text, note, ${INTAKE_FORM_FIELDS} },
    _type == "aboutIntroBlock" => { eyebrow, title, intro, sketchLabels, sketchClosing, introItems[]{${ICON_TEXT_FIELDS}} },
    _type == "aboutTeamBlock" => { teamEyebrow, teamTitle, coreTeam[]{ name, role, image{${IMAGE_SOURCE_FIELDS}}, text }, teamBanner },
    _type == "aboutTeamImageBlock" => { teamImageEyebrow, teamImageTitle, teamImage{${IMAGE_SOURCE_FIELDS}} },
    _type == "teamProfilesShowcaseBlock" => { ${TEAM_PROFILES_SHOWCASE_FIELDS} },
    _type == "visitInvitationBlock" => { ${VISIT_INVITATION_FIELDS} },
    _type == "splitTimelineBlock" => { ${SPLIT_TIMELINE_FIELDS} },
    _type == "faqAnswersGridBlock" => { ${FAQ_ANSWERS_GRID_FIELDS} },
    _type == "projectsShowcaseGridBlock" => { ${PROJECTS_SHOWCASE_GRID_FIELDS} },
    _type == "stackedStepsListBlock" => { ${STACKED_STEPS_LIST_FIELDS} },
    _type == "splitFeatureListBlock" => { ${SPLIT_FEATURE_LIST_FIELDS} },
    _type == "darkAssuranceGridBlock" => { ${DARK_ASSURANCE_GRID_FIELDS} },
    _type == "centeredActionBannerBlock" => { ${CENTERED_ACTION_BANNER_FIELDS} },
    _type == "processBlock" => { eyebrow, titlePrefix, titleHighlight, intro, note, sideNote, steps[]{ title, text, note, icon }, benefits[]{${ICON_TEXT_FIELDS}}, trustPoints[]{${ICON_TEXT_FIELDS}} },
    _type == "processFaqBlock" => { faqEyebrow, faqTitle, faqIntro, faqs[]->{question, "answer": pt::text(answer)} },
    _type == "processIntakeBannerBlock" => { intakeBannerTitle, intakeBannerText, buttonLabel, buttonLink{${SMART_LINK_FIELDS}} },
    _type == "businessContentBlock" => { positionEyebrow, positionTitle, positionText, positionBanner, capacity, cards[]{ eyebrow, title, items } },
    _type == "videoChecklistBlock" => { lists[]{ icon, title, items }, videoUrl, videoCaption }
  }
`;

const INDEX_PAGE_FIELDS = `
  title,
  ${INDEX_CONTENT_BLOCKS},
  listingSettings{ limit, layout },
  seo{${SEO_FIELDS}}
`;

const SERVICES_INDEX_QUERY = `coalesce(
  *[_id == "servicesIndex"][0]{${INDEX_PAGE_FIELDS}},
  *[_type == "servicesIndex"][0]{${INDEX_PAGE_FIELDS}}
)`;

const PROJECTS_INDEX_QUERY = `coalesce(
  *[_id == "projectsIndex"][0]{${INDEX_PAGE_FIELDS}},
  *[_type == "projectsIndex"][0]{${INDEX_PAGE_FIELDS}}
)`;

const BLOGS_INDEX_QUERY = `coalesce(
  *[_id == "blogsIndex"][0]{${INDEX_PAGE_FIELDS}},
  *[_type == "blogsIndex"][0]{${INDEX_PAGE_FIELDS}}
)`;

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
    _type == "splitIntroBlock" => {
      ${SPLIT_INTRO_FIELDS}
    },
    _type == "editorialPrinciplesBlock" => {
      ${EDITORIAL_PRINCIPLES_FIELDS}
    },
    _type == "metricsBandBlock" => {
      ${METRICS_BAND_FIELDS}
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
      bannerButtonLink{${SMART_LINK_FIELDS}}
    },
    _type == "textBlock" => {
      eyebrow,
      title,
      description
    },
    _type == "servicesListingBlock" => {
      limit,
      layout
    },
    _type == "projectsListingBlock" => {
      limit
    },
    _type == "featuredServicesBlock" => {
      eyebrow,
      title,
      viewAllLabel,
      viewAllLink{${SMART_LINK_FIELDS}},
      services[]->{
        title,
        "slug": slug.current,
        "href": "/diensten/" + slug.current,
        summary,
        "image": cardImage{${IMAGE_SOURCE_FIELDS}},
        icon,
        label
      }
    },
    _type == "featuredProjectsBlock" => {
      eyebrow,
      title,
      viewAllLabel,
      viewAllLink{${SMART_LINK_FIELDS}},
      projects[]->{
        title,
        "slug": slug.current,
        description,
        before,
        after,
        "beforeImage": beforeImage{${IMAGE_SOURCE_FIELDS}},
        "afterImage": afterImage{${IMAGE_SOURCE_FIELDS}}
      }
    },
    _type == "iconCardsBlock" => {
      eyebrow,
      title,
      buttonLabel,
      buttonLink{${SMART_LINK_FIELDS}},
      items[]{${ICON_TEXT_FIELDS}}
    },
    _type == "partnersBlock" => {
      eyebrow,
      title,
      text
    },
    _type == "logoCardGridBlock" => {
      ${LOGO_CARD_GRID_FIELDS}
    },
    _type == "googleReviewsBlock" => {
      limit,
      compact
    },
    _type == "reviewShowcaseBlock" => {
      ${REVIEW_SHOWCASE_FIELDS}
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
    _type == "teamProfilesShowcaseBlock" => {
      ${TEAM_PROFILES_SHOWCASE_FIELDS}
    },
    _type == "visitInvitationBlock" => {
      ${VISIT_INVITATION_FIELDS}
    },
    _type == "splitTimelineBlock" => {
      ${SPLIT_TIMELINE_FIELDS}
    },
    _type == "faqAnswersGridBlock" => {
      ${FAQ_ANSWERS_GRID_FIELDS}
    },
    _type == "projectsShowcaseGridBlock" => {
      ${PROJECTS_SHOWCASE_GRID_FIELDS}
    },
    _type == "stackedStepsListBlock" => {
      ${STACKED_STEPS_LIST_FIELDS}
    },
    _type == "splitFeatureListBlock" => {
      ${SPLIT_FEATURE_LIST_FIELDS}
    },
    _type == "darkAssuranceGridBlock" => {
      ${DARK_ASSURANCE_GRID_FIELDS}
    },
    _type == "centeredActionBannerBlock" => {
      ${CENTERED_ACTION_BANNER_FIELDS}
    },
    _type == "processBlock" => {
      eyebrow,
      titlePrefix,
      titleHighlight,
      intro,
      note,
      sideNote,
      steps[]{ title, text, note, icon },
      benefits[]{${ICON_TEXT_FIELDS}},
      trustPoints[]{${ICON_TEXT_FIELDS}}
    },
    _type == "processFaqBlock" => {
      faqEyebrow,
      faqTitle,
      faqIntro,
      faqs[]->{question, "answer": pt::text(answer)}
    },
    _type == "processIntakeBannerBlock" => {
      intakeBannerTitle,
      intakeBannerText,
      buttonLabel,
      buttonLink{${SMART_LINK_FIELDS}}
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
    },
    _type == "videoChecklistBlock" => {
      lists[]{
        icon,
        title,
        items
      },
      videoUrl,
      videoCaption
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
    priceRange,
    aggregateRatingValue,
    aggregateRatingCount
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
    backgroundImage{${IMAGE_SOURCE_FIELDS}},
    primaryLabel,
    primaryLink{${SMART_LINK_FIELDS}},
    secondaryLabel,
    secondaryLink{${SMART_LINK_FIELDS}},
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
    faqs[]->{question, "answer": pt::text(answer)}
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
    backgroundImage{${IMAGE_SOURCE_FIELDS}},
    primaryLabel,
    primaryLink{${SMART_LINK_FIELDS}},
    secondaryLabel,
    secondaryLink{${SMART_LINK_FIELDS}},
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
    faqs[]->{question, "answer": pt::text(answer)}
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
  primaryLabel,
  primaryLink{${SMART_LINK_FIELDS}},
  secondaryLabel,
  secondaryLink{${SMART_LINK_FIELDS}},
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
  primaryLabel,
  primaryLink{${SMART_LINK_FIELDS}},
  secondaryLabel,
  secondaryLink{${SMART_LINK_FIELDS}},
  videoChecklist[]{
    lists[]{ icon, title, items },
    videoUrl,
    videoCaption
  },
  seo{${SEO_FIELDS}}
}`;

const BLOG_AUTHOR_FIELDS = `
  name,
  "slug": slug.current,
  role,
  image{${IMAGE_SOURCE_FIELDS}},
  bio
`;

const BLOG_CATEGORY_FIELDS = `
  title,
  "slug": slug.current,
  description,
  seo{${SEO_FIELDS}}
`;

const BLOG_POST_SUMMARY_FIELDS = `
  title,
  "slug": slug.current,
  excerpt,
  featuredImage{${IMAGE_SOURCE_FIELDS}},
  publishedAt,
  updatedAt,
  author->{${BLOG_AUTHOR_FIELDS}},
  categories[]->{${BLOG_CATEGORY_FIELDS}},
  "bodyText": pt::text(body),
  seo{${SEO_FIELDS}}
`;

const BLOG_POSTS_QUERY = `*[_type == "blogPost" && defined(slug.current)]|order(coalesce(sortOrder, 9999) asc, publishedAt desc){
  ${BLOG_POST_SUMMARY_FIELDS}
}`;

const BLOG_POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  ${BLOG_POST_SUMMARY_FIELDS},
  body[]{
    ...,
    _type == "cmsImage" => {${IMAGE_SOURCE_FIELDS}}
  },
  relatedServices[]->{
    title,
    "slug": slug.current,
    icon,
    label,
    cardImage{${IMAGE_SOURCE_FIELDS}},
    summary
  },
  relatedProjects[]->{
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
  }
}`;

const REVIEWS_QUERY = `*[_type == "review"]|order(sortOrder asc, name asc){
  name,
  location,
  image{${IMAGE_SOURCE_FIELDS}},
  quote
}`;

const PARTNERS_QUERY = `*[_type == "partner"]|order(sortOrder asc, name asc){
  name,
  category,
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

export type SplitIntroBlock = CmsBaseBlock & {
  _type: "splitIntroBlock";
} & SplitIntroContent;

export type EditorialPrinciplesBlock = CmsBaseBlock & {
  _type: "editorialPrinciplesBlock";
} & EditorialPrinciplesContent;

export type MetricsBandBlock = CmsBaseBlock & {
  _type: "metricsBandBlock";
} & MetricsBandContent;

export type ProblemSolutionBlock = CmsBaseBlock & {
  _type: "problemSolutionBlock";
} & ProblemSolutionContent;

export type TextBlock = CmsBaseBlock & {
  _type: "textBlock";
  eyebrow?: string;
  title?: string;
  description?: PtBlock[];
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

export type FeaturedServicesBlock = CmsBaseBlock & {
  _type: "featuredServicesBlock";
  eyebrow?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllLink?: SmartLink;
  services?: import("@/lib/types").ServiceSummary[];
};

export type FeaturedProjectsBlock = CmsBaseBlock & {
  _type: "featuredProjectsBlock";
  eyebrow?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllLink?: SmartLink;
  projects?: Array<{
    title: string;
    slug: string;
    description: string;
    before: string;
    after: string;
    beforeImage?: string;
    afterImage?: string;
  }>;
};

export type IconCardsBlock = CmsBaseBlock & {
  _type: "iconCardsBlock";
  eyebrow?: string;
  title?: string;
  buttonLabel?: string;
  buttonLink?: SmartLink;
  items?: IconTextItem[];
};

export type PartnersBlock = CmsBaseBlock & {
  _type: "partnersBlock";
  eyebrow?: string;
  title?: string;
  text?: string;
};

export type LogoCardGridBlock = CmsBaseBlock & {
  _type: "logoCardGridBlock";
} & LogoCardGridContent;

export type GoogleReviewsBlock = CmsBaseBlock & {
  _type: "googleReviewsBlock";
  limit?: number;
  compact?: boolean;
};

export type ReviewShowcaseBlock = CmsBaseBlock & {
  _type: "reviewShowcaseBlock";
} & ReviewShowcaseContent;

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

export type TeamProfilesShowcaseBlock = CmsBaseBlock & {
  _type: "teamProfilesShowcaseBlock";
} & TeamProfilesShowcaseContent;

export type VisitInvitationBlock = CmsBaseBlock & {
  _type: "visitInvitationBlock";
} & VisitInvitationContent;

export type SplitTimelineBlock = CmsBaseBlock & {
  _type: "splitTimelineBlock";
} & SplitTimelineContent;

export type FaqAnswersGridBlock = CmsBaseBlock & {
  _type: "faqAnswersGridBlock";
} & FaqAnswersGridContent;

export type ProjectsShowcaseGridBlock = CmsBaseBlock & {
  _type: "projectsShowcaseGridBlock";
} & ProjectsShowcaseGridContent;

export type StackedStepsListBlock = CmsBaseBlock & {
  _type: "stackedStepsListBlock";
} & StackedStepsListContent;

export type SplitFeatureListBlock = CmsBaseBlock & {
  _type: "splitFeatureListBlock";
} & SplitFeatureListContent;

export type DarkAssuranceGridBlock = CmsBaseBlock & {
  _type: "darkAssuranceGridBlock";
} & DarkAssuranceGridContent;

export type CenteredActionBannerBlock = CmsBaseBlock & {
  _type: "centeredActionBannerBlock";
} & CenteredActionBannerContent;

export type ProcessBlock = CmsBaseBlock & {
  _type: "processBlock";
  benefits?: IconTextItem[];
  trustPoints?: IconTextItem[];
} & Pick<ProcessPageContent, "eyebrow" | "titlePrefix" | "titleHighlight" | "intro" | "note" | "sideNote" | "steps">;

export type ProcessFaqBlock = CmsBaseBlock & {
  _type: "processFaqBlock";
} & Pick<ProcessPageContent, "faqEyebrow" | "faqTitle" | "faqIntro" | "faqs">;

export type ProcessIntakeBannerBlock = CmsBaseBlock & {
  _type: "processIntakeBannerBlock";
  intakeBannerTitle?: string;
  intakeBannerText?: string;
  buttonLabel?: string;
  buttonLink?: SmartLink;
};

export type BusinessContentBlock = CmsBaseBlock & {
  _type: "businessContentBlock";
} & Pick<
  BusinessPageContent,
  "positionEyebrow" | "positionTitle" | "positionText" | "positionBanner" | "capacity" | "cards"
>;

export type VideoChecklistBlock = CmsBaseBlock & {
  _type: "videoChecklistBlock";
} & VideoChecklistItem;

export type CmsDynamicPageBlock =
  | HomeHeroBlock
  | PageHeroBlock
  | SplitIntroBlock
  | EditorialPrinciplesBlock
  | MetricsBandBlock
  | ProblemSolutionBlock
  | TextBlock
  | ServicesListingBlock
  | ProjectsListingBlock
  | FeaturedServicesBlock
  | FeaturedProjectsBlock
  | IconCardsBlock
  | PartnersBlock
  | LogoCardGridBlock
  | GoogleReviewsBlock
  | ReviewShowcaseBlock
  | CtaBannerBlock
  | ContactFormBlock
  | AboutIntroBlock
  | AboutTeamBlock
  | AboutTeamImageBlock
  | TeamProfilesShowcaseBlock
  | VisitInvitationBlock
  | SplitTimelineBlock
  | FaqAnswersGridBlock
  | ProjectsShowcaseGridBlock
  | StackedStepsListBlock
  | SplitFeatureListBlock
  | DarkAssuranceGridBlock
  | CenteredActionBannerBlock
  | ProcessBlock
  | ProcessFaqBlock
  | ProcessIntakeBannerBlock
  | BusinessContentBlock
  | VideoChecklistBlock;

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
    return value.map(normalizeCmsValue).filter((item) => item !== undefined && item !== null);
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
  return Array.isArray(value) ? (value.filter((item) => item !== undefined && item !== null) as T[]) : [];
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
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";

  if (!slug || !title) {
    return null;
  }

  const pageContent = normalizeCmsValue(raw.pageContent);
  const content = isRecord(pageContent) ? pageContent : {};

  return {
    slug,
    eyebrow: asString(content.eyebrow),
    title: asString(content.title) || title,
    intro: asString(content.intro),
    backgroundImage: typeof content.backgroundImage === "string" ? content.backgroundImage : undefined,
    primaryLabel: typeof content.primaryLabel === "string" ? content.primaryLabel : undefined,
    primaryLink: isRecord(content.primaryLink) ? content.primaryLink as SmartLink : undefined,
    secondaryLabel: typeof content.secondaryLabel === "string" ? content.secondaryLabel : undefined,
    secondaryLink: isRecord(content.secondaryLink) ? content.secondaryLink as SmartLink : undefined,
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
    primaryLabel: normalized.primaryLabel,
    primaryLink: normalized.primaryLink,
    secondaryLabel: normalized.secondaryLabel,
    secondaryLink: normalized.secondaryLink,
    videoChecklist: Array.isArray(normalized.videoChecklist) ? normalized.videoChecklist as VideoChecklistItem[] : [],
    seo: mapSeo(raw.seo),
  };
}

function readingTimeFromText(text: unknown): string | undefined {
  if (typeof text !== "string" || !text.trim()) {
    return undefined;
  }

  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min leestijd`;
}

function toBlogAuthor(raw: unknown): BlogAuthor | undefined {
  const normalized = normalizeCmsValue(raw);
  if (!isRecord(normalized) || typeof normalized.name !== "string") {
    return undefined;
  }

  return {
    name: normalized.name,
    slug: asString(normalized.slug) || undefined,
    role: asString(normalized.role) || undefined,
    image: asString(normalized.image) || undefined,
    bio: asString(normalized.bio) || undefined,
  };
}

function toBlogCategory(raw: unknown): BlogCategory | null {
  const normalized = normalizeCmsValue(raw);
  if (!isRecord(normalized) || typeof normalized.title !== "string" || typeof normalized.slug !== "string") {
    return null;
  }

  return {
    title: normalized.title,
    slug: normalized.slug,
    description: asString(normalized.description) || undefined,
    seo: mapSeo(normalized.seo),
  };
}

function toBlogPostSummary(raw: RawRecord): BlogPostSummary | null {
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";
  const normalized = normalizeCmsValue(raw) as RawRecord;

  if (!slug || !title) {
    return null;
  }

  return {
    title,
    slug,
    href: `/kennisbank/${slug}`,
    excerpt: asString(normalized.excerpt),
    featuredImage: asString(normalized.featuredImage) || undefined,
    publishedAt: asString(normalized.publishedAt) || undefined,
    updatedAt: asString(normalized.updatedAt) || undefined,
    author: toBlogAuthor(normalized.author),
    categories: asArray<unknown>(normalized.categories)
      .map(toBlogCategory)
      .filter(Boolean) as BlogCategory[],
    readingTime: readingTimeFromText(normalized.bodyText),
    seo: mapSeo(raw.seo),
  };
}

function normalizeBodyBlock(block: unknown): RichTextContent[number] | null {
  if (isRecord(block) && block._type === "cmsImage") {
    const url = cmsImageUrl(block as unknown as never, 1600);
    if (!url) return null;
    const altSource = isRecord(block.image) ? block.image.alt : undefined;
    const imageBlock: RichTextImageBlock = {
      _type: "cmsImage",
      url,
      alt: typeof altSource === "string" ? altSource : "",
    };
    return imageBlock;
  }

  return normalizeCmsValue(block) as RichTextContent[number];
}

function toBlogPostDetail(raw: RawRecord): BlogPostDetail | null {
  const summary = toBlogPostSummary(raw);
  if (!summary) {
    return null;
  }

  const normalized = normalizeCmsValue(raw) as RawRecord;

  return {
    ...summary,
    body: asArray<RawRecord>(raw.body)
      .map(normalizeBodyBlock)
      .filter((block): block is RichTextContent[number] => block !== null),
    relatedServices: asArray<RawRecord>(raw.relatedServices)
      .map(toServiceSummary)
      .filter(Boolean) as ServiceSummary[],
    relatedProjects: asArray<RawRecord>(raw.relatedProjects)
      .map(toProject)
      .filter(Boolean) as ProjectItem[],
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

export async function getBlogPosts() {
  const {data, failed} = await safeFetch<RawRecord[] | null>(BLOG_POSTS_QUERY);

  if (failed || !data) {
    return [];
  }

  return (data.map(toBlogPostSummary).filter(Boolean) as BlogPostSummary[]) || [];
}

export async function getBlogPostBySlug(slug: string) {
  const {data, failed} = await safeFetch<RawRecord | null>(BLOG_POST_QUERY, {slug});

  if (failed) {
    return null;
  }

  return data ? toBlogPostDetail(data) : null;
}

export async function getBlogPostSlugs() {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
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

export async function getBlogsIndex(): Promise<IndexPageDoc | null> {
  const {data, failed} = await safeFetch<RawRecord | null>(BLOGS_INDEX_QUERY);
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
