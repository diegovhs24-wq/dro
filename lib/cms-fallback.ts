import type {SeoSettings} from "@/lib/types";
import type {ServiceSummary, SiteSettings} from "@/lib/types";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85";

export const fallbackSiteSettings: SiteSettings = {
  title: "DRO Renovaties",
  description: "Renovatie- en bouwbedrijf in Den Haag en omgeving.",
  headerNavigation: [
    {label: "Projecten", href: "/projecten"},
    {label: "Over ons", href: "/over-ons"},
    {label: "Werkwijze", href: "/werkwijze"},
    {label: "Zakelijk", href: "/zakelijk"},
  ],
  serviceMenuGroups: [
    {
      title: "Woning",
      slugs: ["badkamer-renovatie", "totaalrenovatie", "uitbouw-aanbouw", "afbouw-nieuwbouw"],
    },
    {
      title: "Installaties",
      slugs: ["vloerverwarming", "warmtepomp", "zonnepanelen"],
    },
    {
      title: "Afwerking",
      slugs: ["stuc-schilderwerk", "onderhoud"],
    },
  ],
  menuPromo: {
    image: HERO_IMAGE,
    eyebrow: "Start vandaag",
    title: "Plan uw renovatie met één vast aanspreekpunt.",
    footerText: "Intake duurt ongeveer 2 minuten.",
  },
  footer: {
    brandTitle: "DRO Renovaties",
    description: "Renovatie, afbouw en installaties met duidelijke planning en één aanspreekpunt.",
    contactTitle: "Contact",
    contactAddress: "Den Haag en omgeving",
    contactPhone: "+31 6 0000 0000",
    contactPhoneHref: "tel:+31600000000",
    contactPhoneNote: "Bel ons op werkdagen tussen 08:00 en 18:00.",
    contactEmail: "info@drorenovaties.nl",
    contactEmailHref: "mailto:info@drorenovaties.nl",
    servicesTitle: "Diensten",
    businessTitle: "Zakelijk",
    businessText: "Ook voor vastgoed, aannemers en ontwikkelaars.",
    businessItems: ["Meerdere units", "Vaste planning", "Één aanspreekpunt"],
    businessClosing: "Bespreek uw project via de intake.",
    statement: "Renoveren met overzicht.",
    copyright: "© DRO Renovaties",
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
        primaryLabel: "Start intake",
        primaryHref: "/contact",
        secondaryLabel: "Bel direct",
        secondaryHref: "tel:+31600000000",
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

function normalizeLinkItems(items: SiteSettings["headerNavigation"]) {
  return items.map((item) => ({
    ...item,
    href: normalizeHref(item.href),
  }));
}

export function withSiteSettingsFallback(settings: SiteSettings): SiteSettings {
  const headerNavigation = settings.headerNavigation.length
    ? normalizeLinkItems(settings.headerNavigation)
    : fallbackSiteSettings.headerNavigation;

  const serviceMenuGroups = settings.serviceMenuGroups.length
    ? settings.serviceMenuGroups
    : fallbackSiteSettings.serviceMenuGroups;

  const menuPromo =
    settings.menuPromo.image || settings.menuPromo.title
      ? settings.menuPromo
      : fallbackSiteSettings.menuPromo;

  return {
    ...settings,
    title: settings.title || fallbackSiteSettings.title,
    description: settings.description || fallbackSiteSettings.description,
    headerNavigation,
    serviceMenuGroups,
    menuPromo,
    footer: {
      ...fallbackSiteSettings.footer,
      ...settings.footer,
      brandTitle: settings.footer.brandTitle || fallbackSiteSettings.footer.brandTitle,
      description: settings.footer.description || fallbackSiteSettings.footer.description,
      contactTitle: settings.footer.contactTitle || fallbackSiteSettings.footer.contactTitle,
      contactAddress: settings.footer.contactAddress || fallbackSiteSettings.footer.contactAddress,
      contactPhone: settings.footer.contactPhone || fallbackSiteSettings.footer.contactPhone,
      contactPhoneHref:
        settings.footer.contactPhoneHref || fallbackSiteSettings.footer.contactPhoneHref,
      contactPhoneNote:
        settings.footer.contactPhoneNote || fallbackSiteSettings.footer.contactPhoneNote,
      contactEmail: settings.footer.contactEmail || fallbackSiteSettings.footer.contactEmail,
      contactEmailHref:
        settings.footer.contactEmailHref || fallbackSiteSettings.footer.contactEmailHref,
      servicesTitle: settings.footer.servicesTitle || fallbackSiteSettings.footer.servicesTitle,
      businessTitle: settings.footer.businessTitle || fallbackSiteSettings.footer.businessTitle,
      businessText: settings.footer.businessText || fallbackSiteSettings.footer.businessText,
      businessItems: settings.footer.businessItems.length
        ? settings.footer.businessItems
        : fallbackSiteSettings.footer.businessItems,
      businessClosing:
        settings.footer.businessClosing || fallbackSiteSettings.footer.businessClosing,
      statement: settings.footer.statement || fallbackSiteSettings.footer.statement,
      copyright: settings.footer.copyright || fallbackSiteSettings.footer.copyright,
      legalLinks: settings.footer.legalLinks.length
        ? normalizeLinkItems(settings.footer.legalLinks)
        : fallbackSiteSettings.footer.legalLinks,
    },
    floatingActions: {
      ...fallbackSiteSettings.floatingActions,
      ...settings.floatingActions,
      whatsappLabel:
        settings.floatingActions.whatsappLabel || fallbackSiteSettings.floatingActions.whatsappLabel,
      whatsappHref:
        settings.floatingActions.whatsappHref || fallbackSiteSettings.floatingActions.whatsappHref,
      intakeLabel:
        settings.floatingActions.intakeLabel || fallbackSiteSettings.floatingActions.intakeLabel,
      intakeHref:
        settings.floatingActions.intakeHref || fallbackSiteSettings.floatingActions.intakeHref,
    },
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
