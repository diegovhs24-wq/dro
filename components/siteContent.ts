export const services = [
  {
    slug: "badkamer-renovatie",
    icon: "bathroom",
    title: "Badkamer renovatie",
    href: "/diensten/badkamer-renovatie",
    label: "Volledig verzorgd",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80",
    summary:
      "Badkamer renovatie met planning, coördinatie en strakke oplevering."
  },
  {
    slug: "totaalrenovatie",
    icon: "renovation",
    title: "Totaalrenovatie",
    href: "/diensten/totaalrenovatie",
    label: "Van A tot Z",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    summary:
      "Complete woningrenovatie met vaste teams en één aanspreekpunt."
  },
  {
    slug: "uitbouw-aanbouw",
    icon: "extension",
    title: "Uitbouw / aanbouw",
    href: "/diensten/uitbouw-aanbouw",
    label: "Bouwkundig begeleid",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80",
    summary:
      "Meer leefruimte met technische voorbereiding en nette afwerking."
  },
  {
    slug: "afbouw-nieuwbouw",
    icon: "newbuild",
    title: "Afbouw nieuwbouw",
    href: "/diensten/afbouw-nieuwbouw",
    label: "Instapklaar",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
    summary:
      "Van casco naar woonklaar met één planning."
  },
  {
    slug: "vloerverwarming",
    icon: "floorHeating",
    title: "Vloerverwarming",
    href: "/diensten/vloerverwarming",
    label: "Comfort & controle",
    image:
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=900&q=80",
    summary:
      "Vloerverwarming netjes afgestemd, aangesloten en getest."
  },
  {
    slug: "warmtepomp",
    icon: "heatPump",
    title: "Warmtepomp",
    href: "/diensten/warmtepomp",
    label: "Duurzame installatie",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    summary:
      "Warmtepomp installatie met advies, aansluiting en controle."
  },
  {
    slug: "zonnepanelen",
    icon: "solar",
    title: "Zonnepanelen",
    href: "/diensten/zonnepanelen",
    label: "Veilig aangesloten",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
    summary:
      "Zonnepanelen veilig geplaatst en aangesloten."
  },
  {
    slug: "stuc-schilderwerk",
    icon: "paint",
    title: "Stuc- en schilderwerk",
    href: "/diensten/stuc-schilderwerk",
    label: "Strakke afwerking",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
    summary:
      "Strakke wanden, plafonds en schilderwerk."
  },
  {
    slug: "onderhoud",
    icon: "maintenance",
    title: "Onderhoud",
    href: "/diensten/onderhoud",
    label: "Herstel & behoud",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
    summary:
      "Onderhoud en herstelwerk helder afgestemd."
  }
];

export const reviews = [
  {
    name: "Sanne",
    location: "Den Haag",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    quote:
      "Duidelijke planning, nette mensen en een badkamer die precies is geworden zoals besproken."
  },
  {
    name: "Murat",
    location: "Rijswijk",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    quote:
      "Vanaf de intake wist ik waar ik aan toe was. Ze reageren snel en houden overzicht."
  },
  {
    name: "Eva",
    location: "Voorburg",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    quote:
      "Geen gedoe tijdens de verbouwing. Alles werd rustig uitgelegd en strak uitgevoerd."
  },
  {
    name: "Karim",
    location: "Delft",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    quote:
      "Prettig dat er één aanspreekpunt was. Dat gaf rust tijdens het hele traject."
  },
  {
    name: "Laura",
    location: "Rotterdam",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    quote:
      "Professionele uitvoering en duidelijke afspraken. Je merkt dat ze met vaste teams werken."
  },
  {
    name: "Niels",
    location: "Leiden",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80",
    quote:
      "De communicatie bleef helder, ook toen er keuzes gemaakt moesten worden."
  }
];

export const processSteps = [
  "Aanvraag",
  "Intake",
  "Offerte",
  "Planning",
  "Uitvoering",
  "Oplevering"
];

export const partners = [
  "Constructeurs",
  "Architecten",
  "Badkamerzaken",
  "Keukenzaken",
  "Vloerspecialisten",
  "Bouwmaat",
  "Sanisale",
  "Keukensale"
];

type PartnerLogo =
  | { name: string; image: string }
  | { name: string; accent: string };

export const partnerLogos: PartnerLogo[] = [
  { name: "Bouwmaat", image: "/bouwmaat-logo.svg" },
  { name: "Sanisale", image: "/sanisale-logo.svg" },
  { name: "Keukensale", image: "/keukensale-logo.svg" }
];
