import type {Metadata} from "next";

import PageStructuredData from "@/components/seo/PageStructuredData";
import ToolsLibrary from "@/components/tools/ToolsLibrary";
import {getSiteSettings} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";
import {buildPageMetadata} from "@/lib/seo/metadata";

const PATHNAME = "/handige-tools";
const TITLE = "Handige tools voor je verbouwing | DRO Renovaties";
const DESCRIPTION =
  "Gratis rekentools en checks voor je verbouwing: bouwtijd, vergunningen, materialen en techniek. Direct een uitkomst, geen aanmelding nodig.";

const FAQS = [
  {
    question: "Hoe lang duurt een badkamerrenovatie?",
    answer:
      "Een gemiddelde badkamerrenovatie tot 6 m² duurt ongeveer 10 werkdagen, oftewel 2 tot 2,5 week. Grotere badkamers en extra werk zoals vloerverwarming of leidingwerk verplaatsen komen daar bovenop. Gebruik de bouwtijd calculator voor een inschatting op maat.",
  },
  {
    question: "Hoe lang duurt een uitbouw?",
    answer:
      "Een uitbouw tot 20 m² duurt gemiddeld ongeveer 30 werkdagen, oftewel 6 tot 7 weken uitvoeringstijd. Daarbovenop komt 4 tot 8 weken voorbereiding, en als er een vergunning nodig is nog eens 8 tot 14 weken gemeentelijke doorlooptijd.",
  },
  {
    question: "Heb ik een vergunning nodig voor een uitbouw?",
    answer:
      "Een uitbouw aan de achterkant tot en met 4 meter diepte is vaak vergunningvrij. Is de uitbouw dieper dan 4 meter, of aan de zij- of voorkant, dan is een omgevingsvergunning nodig. Bij een monument of beschermd stads- of dorpsgezicht is altijd een vergunning nodig. Doe de vergunningcheck voor jouw situatie.",
  },
  {
    question: "Hoeveel tegels moet ik bestellen?",
    answer:
      "Dat hangt af van je vloer- en wandoppervlak, het tegelformaat en het legpatroon. Reken op 10 tot 15 procent extra voor snijverlies, afhankelijk van het patroon. Gebruik de tegel calculator voor het exacte aantal dozen, plus de benodigde lijm en voeg.",
  },
  {
    question: "Hoeveel verf heb ik nodig per m2?",
    answer:
      "Reken op ongeveer 1 liter verf per 8 m² per laag. De meeste ondergronden hebben 2 lagen nodig, een donkere kleur overschilderen vaak 3. Gebruik de verf calculator om precies uit te rekenen hoeveel liter en welke blikken je nodig hebt.",
  },
  {
    question: "Verbouwen of verhuizen, wat is verstandiger?",
    answer:
      "Dat hangt af van je situatie: hoe tevreden je bent met de buurt, of er uitbreidingsruimte is, en hoe lang je nog wilt blijven wonen. Doe de verbouwen-of-verhuizen check voor een persoonlijke indicatie.",
  },
  {
    question: "Is er een asbestcheck nodig voor het bouwjaar van mijn woning?",
    answer:
      "Bij een pand van voor 1994 is een asbestinventarisatie door een gecertificeerd bureau verplicht voordat er wordt gesloopt. De sloopchecklist generator toont dit automatisch als veiligheidspunt bij een bouwjaar voor 1994.",
  },
  {
    question: "Hoeveel groepen heb ik nodig in de meterkast voor een laadpaal of warmtepomp?",
    answer:
      "Apparaten zoals een laadpaal, warmtepomp of inductiekookplaat vragen meestal een eigen groep. Bij meerdere zware apparaten samen is vaak een overstap naar 3 fasen nodig. Gebruik de groepenkast check voor een indicatie voor jouw situatie.",
  },
  {
    question: "Wat is de juiste volgorde van klussen bij een verbouwing?",
    answer:
      "In grote lijnen: eerst slopen en de indeling wijzigen, dan leidingwerk en elektra, dan stucwerk en de dekvloer, dan tegelwerk en kozijnen, dan schilderwerk, en pas als laatste de vloer en de afmontage. De klusvolgorde planner zet dit voor jouw geselecteerde werkzaamheden op een rij.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    fallbackTitle: TITLE,
    fallbackDescription: DESCRIPTION,
    pathname: PATHNAME,
  });
}

export default async function HandigeToolsPage() {
  const siteSettings = await getSiteSettings();
  const breadcrumbs = breadcrumbsForPath(PATHNAME, "Handige tools");

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={DESCRIPTION}
        faqs={FAQS}
        organizationSeo={siteSettings.organizationSeo}
        pathname={PATHNAME}
        siteSettings={siteSettings}
        title={TITLE}
      />
      <ToolsLibrary />
    </>
  );
}
