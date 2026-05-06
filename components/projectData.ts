export type Project = {
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
};

export const projects: Project[] = [
  {
    title: "Badkamer in hotelstijl",
    slug: "badkamer-renovatie-den-haag",
    description:
      "Een compacte badkamer in Den Haag is volledig vernieuwd met rustige materialen, strak tegelwerk en praktische maatwerkdetails.",
    story:
      "De woning had een verouderde badkamer met weinig opbergruimte en een onrustige indeling. We hebben de ruimte eerst technisch opnieuw opgebouwd en daarna gekozen voor een rustige hotelstijl. Door leidingwerk, verlichting en tegelwerk strak te plannen, bleef de doorlooptijd voorspelbaar en kon de klant snel weer gebruikmaken van de badkamer.",
    images: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    location: "Den Haag",
    type: "Badkamer renovatie",
    duration: "3 weken",
    work_items: [
      "Sloop en afvoer oude badkamer",
      "Aanpassen waterleidingen en afvoer",
      "Nieuwe elektra en dimbare verlichting",
      "Tegelwerk vloer en wanden",
      "Installatie sanitair en maatwerk nis",
      "Kitwerk en eindafwerking"
    ],
    before: "Voor",
    after: "Na"
  },
  {
    title: "Gezinswoning totaalrenovatie",
    slug: "totaalrenovatie-gezinswoning-rijswijk",
    description:
      "Een aangekochte gezinswoning in Rijswijk is volledig gerenoveerd met nieuwe indeling, installaties en afwerking.",
    story:
      "De bewoners wilden direct na aankoop duidelijkheid over planning, keuzes en prioriteiten. We hebben de renovatie opgeknipt in logische fases: sloop, technische vernieuwing, indeling en afbouw. Daardoor bleef het project beheersbaar en waren keuzes steeds op tijd gemaakt.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    location: "Rijswijk",
    type: "Totaalrenovatie",
    duration: "9 weken",
    work_items: [
      "Complete sloop en voorbereiding",
      "Nieuwe elektra en installaties",
      "Aanpassen indeling begane grond",
      "Stucwerk en schilderwerk",
      "Nieuwe vloeren en plinten",
      "Badkamer en toilet vernieuwd"
    ],
    before: "Casco",
    after: "Instapklaar"
  },
  {
    title: "Uitbouw met leefkeuken",
    slug: "uitbouw-leefkeuken-voorburg",
    description:
      "Een woning in Voorburg kreeg meer leefruimte door een uitbouw met veel licht en een directe verbinding met de tuin.",
    story:
      "De klant wilde een ruimere leefkeuken zonder grip te verliezen op planning en bouwkundige keuzes. Samen met vaste partners hebben we constructie, kozijnen, dak en afwerking afgestemd voordat de uitvoering startte. Het resultaat is een lichte ruimte die dagelijks wordt gebruikt als hart van de woning.",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
    ],
    location: "Voorburg",
    type: "Uitbouw / aanbouw",
    duration: "8 weken",
    work_items: [
      "Fundering en constructiewerk",
      "Plaatsen kozijnen en pui",
      "Dakopbouw en isolatie",
      "Elektra en voorbereiding keuken",
      "Stucwerk en vloerafwerking",
      "Oplevering inclusief detailcontrole"
    ],
    before: "Oud",
    after: "Nieuw"
  },
  {
    title: "Afbouw nieuwbouwwoning",
    slug: "afbouw-nieuwbouwwoning-delft",
    description:
      "Een casco nieuwbouwwoning in Delft is volledig afgewerkt zodat de bewoners direct konden intrekken.",
    story:
      "Na oplevering van de nieuwbouwwoning moest er in korte tijd veel gebeuren. We hebben de afbouw centraal gepland, zodat vloeren, wanden, verlichting en sanitaire afwerking elkaar niet in de weg zaten. De klant had één aanspreekpunt en wist per week wat er gebeurde.",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80"
    ],
    location: "Delft",
    type: "Afbouw nieuwbouw",
    duration: "5 weken",
    work_items: [
      "Wand- en plafondafwerking",
      "Vloeren en plinten",
      "Verlichting en elektra-afwerking",
      "Sanitair geplaatst",
      "Schilderwerk",
      "Eindcontrole voor intrek"
    ],
    before: "Nieuwbouw",
    after: "Woonklaar"
  },
  {
    title: "Appartement upgrade",
    slug: "appartement-renovatie-rotterdam",
    description:
      "Een appartement in Rotterdam kreeg een moderne upgrade met nieuwe badkamer, strak stucwerk en vloerafwerking.",
    story:
      "Bij dit appartement lag de nadruk op snelheid en minimale overlast. Door de werkzaamheden compact te plannen en materiaalkeuzes vooraf vast te leggen, konden we binnen korte tijd veel impact maken zonder het traject onnodig complex te maken.",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752229-250ed79470d6?auto=format&fit=crop&w=1200&q=80"
    ],
    location: "Rotterdam",
    type: "Appartement renovatie",
    duration: "4 weken",
    work_items: [
      "Badkamer vernieuwd",
      "Stucwerk hersteld en afgewerkt",
      "Nieuwe vloerafwerking",
      "Schilderwerk",
      "Verlichting vervangen",
      "Opleverronde met klant"
    ],
    before: "Gedateerd",
    after: "Modern"
  },
  {
    title: "Begane grond renovatie",
    slug: "begane-grond-renovatie-leiden",
    description:
      "Een gesloten begane grond in Leiden is omgezet naar een open leefruimte met betere routing en hoogwaardige afwerking.",
    story:
      "De bewoners wilden meer rust, licht en een logische verbinding tussen keuken en woonkamer. We hebben de werkzaamheden technisch voorbereid en daarna in fases uitgevoerd, zodat constructieve keuzes, afbouw en installaties netjes op elkaar aansloten.",
    images: [
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=80"
    ],
    location: "Leiden",
    type: "Begane grond renovatie",
    duration: "6 weken",
    work_items: [
      "Sloop en voorbereiding",
      "Aanpassen indeling",
      "Elektra en verlichting",
      "Wand- en plafondafwerking",
      "Vloerafwerking",
      "Detailafwerking en oplevering"
    ],
    before: "Gesloten",
    after: "Open"
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
