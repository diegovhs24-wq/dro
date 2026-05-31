import type {SeoSettings} from "@/lib/types";
import type {ServiceSummary, SiteSettings} from "@/lib/types";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85";

export const fallbackSiteSettings: SiteSettings = {
  title: "DRO Renovaties",
  description: "Renovatie- en bouwbedrijf in Den Haag en omgeving.",
  headerMenu: [],
  headerButtons: [],
  footer: {
    brandTitle: "",
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
    whatsappHref: "https://wa.me/31600000000",
    intakeLabel: "Start intake",
    intakeHref: "/contact",
  },
};

export const fallbackServices: ServiceSummary[] = [
  {
    slug: "badkamer-renovatie",
    href: "/diensten/badkamer-renovatie",
    title: "Badkamer renovatie",
    summary: "Badkamer renovatie met planning, coördinatie en strakke oplevering.",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80",
    icon: "bathroom",
    label: "Volledig verzorgd",
  },
  {
    slug: "totaalrenovatie",
    href: "/diensten/totaalrenovatie",
    title: "Totaalrenovatie",
    summary: "Complete woningrenovatie met vaste teams en één aanspreekpunt.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    icon: "renovation",
    label: "Van A tot Z",
  },
  {
    slug: "uitbouw-aanbouw",
    href: "/diensten/uitbouw-aanbouw",
    title: "Uitbouw / aanbouw",
    summary: "Meer leefruimte met technische voorbereiding en nette afwerking.",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80",
    icon: "extension",
    label: "Bouwkundig begeleid",
  },
  {
    slug: "afbouw-nieuwbouw",
    href: "/diensten/afbouw-nieuwbouw",
    title: "Afbouw nieuwbouw",
    summary: "Van casco naar woonklaar met één planning.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
    icon: "newbuild",
    label: "Instapklaar",
  },
  {
    slug: "vloerverwarming",
    href: "/diensten/vloerverwarming",
    title: "Vloerverwarming",
    summary: "Vloerverwarming netjes afgestemd, aangesloten en getest.",
    image:
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=900&q=80",
    icon: "floorHeating",
    label: "Comfort & controle",
  },
  {
    slug: "warmtepomp",
    href: "/diensten/warmtepomp",
    title: "Warmtepomp",
    summary: "Warmtepomp installatie met advies, aansluiting en controle.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    icon: "heatPump",
    label: "Duurzame installatie",
  },
  {
    slug: "zonnepanelen",
    href: "/diensten/zonnepanelen",
    title: "Zonnepanelen",
    summary: "Zonnepanelen veilig geplaatst en aangesloten.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
    icon: "solar",
    label: "Veilig aangesloten",
  },
  {
    slug: "stuc-schilderwerk",
    href: "/diensten/stuc-schilderwerk",
    title: "Stuc- en schilderwerk",
    summary: "Strakke wanden, plafonds en schilderwerk.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
    icon: "paint",
    label: "Strakke afwerking",
  },
  {
    slug: "onderhoud",
    href: "/diensten/onderhoud",
    title: "Onderhoud",
    summary: "Onderhoud en herstelwerk helder afgestemd.",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
    icon: "maintenance",
    label: "Herstel & behoud",
  },
];

export const fallbackHomePage = {
  title: "DRO Renovaties",
  slug: "home",
  seo: {
    metaTitle: "Renovatiebedrijf | DRO Renovaties",
    metaDescription:
      "Renovatie, afbouw en installaties in Den Haag en omgeving. Eén aanspreekpunt, duidelijke planning en nette uitvoering.",
  },
  contentBlocks: [
    {
      _type: "homeHeroBlock",
      _key: "fallback-home-hero",
      hero: {
        coverageText: "Renovatie & bouw in Den Haag en omgeving",
        backgroundImage: HERO_IMAGE,
        headlineTop: "Renoveren",
        headlineHighlight: "met overzicht",
        headlineBottom: "en één aanspreekpunt",
        description:
          "Van badkamer tot totaalrenovatie.\nDuidelijke planning, vaste teams en nette oplevering.",
        trustItems: [
          {title: "Één aanspreekpunt", icon: "team"},
          {title: "Vaste teams", icon: "tools"},
          {title: "Duidelijke planning", icon: "planning"},
        ],
        note: "Start met een korte intake — wij nemen binnen 24 uur contact op.",
        formTitle: "Gratis intake",
        formTimeLabel: "± 2 min",
        formText: "Vertel kort wat u wilt laten doen.",
        formPrivacyText: "Uw gegevens worden vertrouwelijk behandeld.",
        stats: [
          {value: "273+", label: "Google reviews", rating: true},
          {value: "15+", label: "Jaar ervaring", icon: "quality"},
          {value: "1", label: "Vast aanspreekpunt", icon: "team"},
        ],
        processIntro: "Zo werken wij",
        processSteps: [
          {title: "Intake", text: "We bespreken uw wensen", icon: "chat"},
          {title: "Plan", text: "Planning en keuzes", icon: "planning"},
          {title: "Uitvoering", text: "Netjes en op tijd", icon: "tools"},
        ],
      },
    },
    {
      _type: "servicesListingBlock",
      _key: "fallback-services",
      eyebrow: "Diensten",
      title: "Renovatie, afbouw en installaties.",
      linkLabel: "Alle diensten",
      linkHref: "/diensten",
      limit: 6,
    },
    {
      _type: "ctaBannerBlock",
      _key: "fallback-cta",
      cta: {
        eyebrow: "Start vandaag",
        title: "Klaar om uw project goed te starten?",
        text: "Start de intake. Wij nemen binnen 24 uur contact op.",
        buttons: [
          {label: "Start intake", link: {linkType: "external" as const, externalUrl: "/contact"}, variant: "primary" as const},
          {label: "Bel direct", link: {linkType: "external" as const, externalUrl: "tel:+31600000000"}, variant: "outlined" as const},
        ],
      },
    },
  ],
};

export type FallbackHomePage = typeof fallbackHomePage & {
  seo?: SeoSettings;
};

function normalizeHref(href: string) {
  if (!href) {
    return "/";
  }

  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  return href.startsWith("/") ? href : `/${href}`;
}

function normalizeLinkItems(items: {label: string; href: string; openInNewTab?: boolean}[]) {
  return items.map((item) => ({
    ...item,
    href: normalizeHref(item.href),
  }));
}

export function withSiteSettingsFallback(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    title: settings.title || fallbackSiteSettings.title,
    description: settings.description || fallbackSiteSettings.description,
    footer: {
      ...settings.footer,
      legalLinks: normalizeLinkItems(settings.footer.legalLinks),
    },
    floatingActions: settings.floatingActions,
  };
}

export function mergeServicesWithFallback(services: ServiceSummary[]) {
  const bySlug = new Map(fallbackServices.map((service) => [service.slug, service]));

  services.forEach((service) => {
    bySlug.set(service.slug, {
      ...service,
      href: normalizeHref(service.href || `/diensten/${service.slug}`),
    });
  });

  return Array.from(bySlug.values());
}

export function getFallbackHomePage() {
  return fallbackHomePage;
}
