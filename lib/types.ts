export type SeoSettings = {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  openGraphImage?: string;
};

export type LinkItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type SmartLink =
  | {linkType: 'internal'; internalRef?: {_type: string; slug: string}}
  | {linkType: 'external'; externalUrl: string; openInNewTab?: boolean};

export type HeaderMenuLink = {
  label: string;
  link: SmartLink;
};

export type HeaderMegaMenuColumn = {
  title: string;
  links: HeaderMenuLink[];
};

export type HeaderMegaMenuPromo = {
  image: string;
  eyebrow: string;
  title: string;
  footerText: string;
};

export type HeaderMenuItem =
  | {type: 'link'; label: string; link: SmartLink}
  | {type: 'megaMenu'; label: string; columns: HeaderMegaMenuColumn[]; promo: HeaderMegaMenuPromo};

export type HeaderButton = {
  label: string;
  link: SmartLink;
  variant: 'primary' | 'outlined';
};

export type IconTextItem = {
  title?: string;
  text?: string;
  icon?: string;
  note?: string;
  logo?: string;
};

export type NotFoundContent = {
  title?: string;
  text?: string;
  buttons?: HeaderButton[];
};

export type CtaContent = {
  eyebrow?: string;
  title?: string;
  text?: string;
  buttons?: HeaderButton[];
  ratingScore?: number;
  ratingLabel?: string;
};

export type PageHeroContent = {
  eyebrow?: string;
  title?: string;
  text?: string;
  backgroundImage?: string;
  primaryLabel?: string;
  primaryLink?: SmartLink;
  secondaryLabel?: string;
  secondaryLink?: SmartLink;
};

export type ServiceSummary = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  image: string;
  icon?: string;
  label?: string;
};

export type ReviewItem = {
  name: string;
  location: string;
  image: string;
  quote: string;
};

export type PartnerLogoItem = {
  name: string;
  image: string;
  accent?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ServiceBlock = {
  title: string;
  items: string[];
};

export type ServiceDetailContent = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  backgroundImage?: string;
  primaryLabel?: string;
  primaryLink?: SmartLink;
  secondaryLabel?: string;
  secondaryLink?: SmartLink;
  sections: ServiceBlock[];
  processTitle: string;
  processText: string;
  situations?: ServiceBlock[];
  examples?: string[];
  faqs?: FaqItem[];
  seo?: SeoSettings;
};

export type VideoChecklistItem = {
  lists?: Array<{
    icon?: string;
    title?: string;
    items?: string[];
  }>;
  videoUrl?: string;
  videoCaption?: string;
};

export type ProjectItem = {
  title: string;
  slug: string;
  description: string;
  story: string;
  images: string[];
  location: string;
  type: string;
  duration: string;
  work_items: string[];
  before: string;
  after: string;
  beforeImage?: string;
  afterImage?: string;
  videoChecklist?: VideoChecklistItem[];
  href?: string;
  seo?: SeoSettings;
};

export type OrganizationSeo = {
  legalName?: string;
  siteUrl?: string;
  logo?: string;
  telephone?: string;
  email?: string;
  streetAddress?: string;
  addressLocality?: string;
  postalCode?: string;
  addressRegion?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
  areaServed?: string[];
  sameAs?: string[];
  priceRange?: string;
};

export type SiteSettings = {
  title: string;
  description?: string;
  favicon?: string;
  headerLogo?: string;
  headerMenu: HeaderMenuItem[];
  headerButtons: HeaderButton[];
  footerCta?: CtaContent;
  notFound?: NotFoundContent;
  footer: {
    logo?: string;
    logoAlt?: string;
    brandTitle: string;
    description: string;
    contactTitle: string;
    contactAddress: string;
    contactPhone: string;
    contactPhoneHref: string;
    contactPhoneNote: string;
    contactEmail: string;
    contactEmailHref: string;
    servicesTitle: string;
    businessTitle: string;
    businessText: string;
    businessItems: string[];
    businessClosing: string;
    statement: string;
    copyright: string;
    legalLinks: LinkItem[];
  };
  floatingActions: {
    whatsappLabel: string;
    whatsappHref: string;
    intakeLabel: string;
    intakeHref: string;
  };
  globalSeo?: SeoSettings;
  organizationSeo?: OrganizationSeo;
};

export type IntakeFormField = {
  fieldKey: string;
  label: string;
  inputType: 'text' | 'email' | 'tel' | 'number';
  required: boolean;
  halfWidth: boolean;
};

export type IntakeStep = {
  title: string;
  subtitle: string;
  stepType: 'clientType' | 'fields' | 'choice' | 'date' | 'textarea';
  stepKey?: string;
  options?: string[];
  fields?: IntakeFormField[];
};

export type IntakeFormConfig = {
  formTitle: string;
  timeLabel: string;
  description: string;
  privacyText: string;
  steps: IntakeStep[];
  successEyebrow: string;
  successTitle: string;
  successText: string;
  faqItems: Array<{ question: string; answer: string }>;
  submitLabel: string;
  nextLabel: string;
  backLabel: string;
  errorMessage: string;
};

export type HomeHeroContent = {
  coverageText: string;
  backgroundImage: string;
  headlineTop: string;
  headlineHighlight: string;
  headlineBottom: string;
  description: string;
  trustItems: IconTextItem[];
  note: string;
  intakeForm: IntakeFormConfig | null;
  stats: Array<{
    value: string;
    label: string;
    icon?: string;
    rating?: boolean;
  }>;
  processIntro: string;
  processSteps: IconTextItem[];
};

export type ProblemSolutionContent = {
  problemEyebrow: string;
  problemTitle: string;
  problems: string[];
  solutionEyebrow: string;
  solutionTitle: string;
  solutions: string[];
  solutionNote: string;
  bannerTitle: string;
  bannerButtonLabel: string;
  bannerButtonLink: SmartLink;
};

export type HomePageContent = {
  seo?: SeoSettings;
  hero: HomeHeroContent;
  problemSolution: ProblemSolutionContent;
};

export type ListingPageContent = {
  seo?: SeoSettings;
  hero: PageHeroContent;
  cta?: CtaContent;
};

export type AboutPageContent = {
  seo?: SeoSettings;
  eyebrow: string;
  title: string;
  intro: string;
  sketchLabels: string[];
  sketchClosing: string;
  introItems: IconTextItem[];
  teamEyebrow: string;
  teamTitle: string;
  coreTeam: Array<{
    name: string;
    role: string;
    image: string;
    text: string;
  }>;
  teamBanner: string;
  teamImageEyebrow: string;
  teamImageTitle: string;
  teamImage: string;
};

export type ProcessStep = {
  title: string;
  text: string;
  note?: string;
  icon?: string;
};

export type ProcessPageContent = {
  seo?: SeoSettings;
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  intro: string;
  note: string;
  sideNote: string;
  steps: ProcessStep[];
  benefits: IconTextItem[];
  trustPoints: IconTextItem[];
  faqEyebrow: string;
  faqTitle: string;
  faqIntro: string;
  faqs: FaqItem[];
  intakeBannerTitle: string;
  intakeBannerText: string;
  cta?: CtaContent;
};

export type BusinessPageContent = {
  seo?: SeoSettings;
  hero: PageHeroContent;
  positionEyebrow: string;
  positionTitle: string;
  positionText: string;
  positionBanner: string;
  capacity: string[];
  cards: Array<{
    eyebrow: string;
    title: string;
    items: string[];
  }>;
  cta?: CtaContent;
};

export type ContactPageContent = {
  seo?: SeoSettings;
  eyebrow: string;
  title: string;
  text: string;
  note: string;
  intakeForm: IntakeFormConfig | null;
};
