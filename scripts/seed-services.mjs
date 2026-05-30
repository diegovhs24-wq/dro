import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] ??= rest.join('=').trim()
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lxi5ttc2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

function pt(text) {
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).slice(2, 9),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: Math.random().toString(36).slice(2, 9), text, marks: []}],
    },
  ]
}

async function upsertById(doc) {
  const id = doc._id
  const existing = await client.fetch(`*[_id == $id][0]{ _id }`, {id})
  if (existing?._id) {
    const {_id, _type, ...rest} = doc
    const result = await client.patch(id).set(rest).commit({returnDocuments: true})
    console.log(`✅ Updated ${doc._type}:`, result._id)
  } else {
    const result = await client.create(doc)
    console.log(`✅ Created ${doc._type}:`, result._id)
  }
}

const services = [
  {
    _id: 'service-badkamer-renovatie',
    _type: 'service',
    title: 'Badkamer renovatie',
    slug: {_type: 'slug', current: 'badkamer-renovatie'},
    sortOrder: 1,
    icon: 'bathroom',
    label: 'Volledig verzorgd',
    summary: 'Badkamer renovatie met planning, coördinatie en strakke oplevering.',
    pageContent: {
      eyebrow: 'Badkamer renovatie',
      title: 'Badkamer renovatie Den Haag | DRO Renovaties',
      intro: 'Strakke badkamer renovatie met duidelijke planning, vaste coördinatie en nette oplevering.',
      processTitle: 'Van intake tot oplevering geregeld.',
      processText: 'Wensen, techniek en planning worden vooraf afgestemd.',
      examples: ['Techniek voorbereiden', 'Tegelwerk en sanitair', 'Detailcontrole'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij verzorgen',
          items: ['Sloopwerk en afvoer', 'Leidingwerk', 'Elektra en verlichting', 'Tegelwerk en sanitair'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Voor wie',
          items: ['Particuliere woningbezitters', 'Nieuw gekochte woningen', 'Verouderde badkamers'],
        },
        {
          _key: 'section-2',
          _type: 'listBlock',
          title: 'Waarom DRO',
          items: ['Alles onder één dak', 'Heldere communicatie', 'Ervaren vakmensen'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Compacte badkamer',
          items: ['Slimme indeling', 'Praktische opbergruimte', 'Heldere materiaalkeuzes'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Luxe afwerking',
          items: ['Inbouwkranen', 'Nis en verlichting', 'Strak tegelwerk'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Nieuwe woning',
          items: ['Vooraf plannen', 'Keuzes bundelen', 'Snel woonklaar'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Hoe begint een badkamerrenovatie?', answer: pt('We bespreken wensen, bekijken de ruimte en stemmen techniek, indeling en materiaalkeuzes af.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Regelen jullie sloop en afvoer?', answer: pt('Ja. De bestaande badkamer wordt netjes verwijderd en afgevoerd.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Wie coördineert de verschillende vakmensen?', answer: pt('Wij doen de coördinatie. U heeft één aanspreekpunt.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Kan ik sanitair zelf kiezen?', answer: pt('Ja. We denken mee en stemmen keuzes technisch af voordat we starten.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Wordt alles waterdicht gecontroleerd?', answer: pt('Ja. Leidingen, kitwerk en natte zones krijgen extra aandacht.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Wanneer is de badkamer klaar voor gebruik?', answer: pt('Dat stemmen we vooraf af op basis van scope, materiaalkeuzes en planning.')},
      ],
    },
  },
  {
    _id: 'service-totaalrenovatie',
    _type: 'service',
    title: 'Totaalrenovatie',
    slug: {_type: 'slug', current: 'totaalrenovatie'},
    sortOrder: 2,
    icon: 'renovation',
    label: 'Van A tot Z',
    summary: 'Complete woningrenovatie met vaste teams en één aanspreekpunt.',
    pageContent: {
      eyebrow: 'Totaalrenovatie',
      title: 'Totaalrenovatie woning Den Haag',
      intro: 'Complete woningrenovatie met één planning, één aanspreekpunt en vaste uitvoering.',
      processTitle: 'Grip op planning en uitvoering.',
      processText: 'Sloop, techniek en afbouw sluiten logisch op elkaar aan.',
      examples: ['Sloop en techniek', 'Afbouw per fase', 'Oplevering per ruimte'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Werkzaamheden',
          items: ['Complete sloop', 'Nieuwe indeling', 'Elektra en installaties', 'Afbouw en afwerking'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Voor wie',
          items: ['Nieuwe woningkopers', 'Beleggers', 'Complete upgrades'],
        },
        {
          _key: 'section-2',
          _type: 'listBlock',
          title: 'Zekerheid in uitvoering',
          items: ['Eén aanspreekpunt', 'Strakke fasering', 'Heldere keuzes vooraf'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Nieuwe woning',
          items: ['Voor sleuteloverdracht plannen', 'Keuzes bundelen', 'Sneller intrekken'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Complete upgrade',
          items: ['Indeling verbeteren', 'Installaties vernieuwen', 'Afwerking strak trekken'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Zakelijk bezit',
          items: ['Projectmatig uitvoeren', 'Overzicht bewaren', 'Herhaalbaar opleveren'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Hoe houden jullie een totaalrenovatie overzichtelijk?', answer: pt('We faseren het project en stemmen sloop, techniek en afbouw vooraf op elkaar af.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Kan ik vooraf keuzes maken?', answer: pt('Ja. Juist door keuzes vooraf te bundelen blijft de uitvoering rustiger.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Werken jullie met vaste teams?', answer: pt('Ja. Dat zorgt voor korte lijnen en controle op kwaliteit.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Kan dit voor een aangekochte woning?', answer: pt('Ja. We helpen vaak woningkopers die direct goed willen starten.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Hoe wordt communicatie geregeld?', answer: pt('U heeft één aanspreekpunt dat planning en updates bewaakt.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Doen jullie ook de afwerking?', answer: pt('Ja. Van voorbereiding tot eindafwerking kan onder één traject vallen.')},
      ],
    },
  },
  {
    _id: 'service-uitbouw-aanbouw',
    _type: 'service',
    title: 'Uitbouw / aanbouw',
    slug: {_type: 'slug', current: 'uitbouw-aanbouw'},
    sortOrder: 3,
    icon: 'extension',
    label: 'Bouwkundig begeleid',
    summary: 'Meer leefruimte met technische voorbereiding en nette afwerking.',
    pageContent: {
      eyebrow: 'Uitbouw / aanbouw',
      title: 'Uitbouw laten plaatsen Den Haag',
      intro: 'Meer ruimte met technische voorbereiding, duidelijke planning en nette afwerking.',
      processTitle: 'Bouwkundig voorbereid.',
      processText: 'Constructie, materialen en uitvoering worden vooraf afgestemd.',
      examples: ['Constructie en fundering', 'Wind- en waterdicht', 'Binnenafwerking'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Werkzaamheden',
          items: ['Fundering', 'Constructie', 'Kozijnen en puien', 'Dak, isolatie en afwerking'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Waar wij op sturen',
          items: ['Heldere voorbereiding', 'Betrouwbare planning', 'Nette bouwplaats', 'Controle op details'],
        },
        {
          _key: 'section-2',
          _type: 'listBlock',
          title: 'Ideaal voor',
          items: ['Leefkeukens', 'Meer woonruimte', 'Woningwaarde verhogen'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Leefkeuken',
          items: ['Meer licht', 'Open verbinding', 'Praktische indeling'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Extra woonruimte',
          items: ['Constructie beoordelen', 'Isolatie meenemen', 'Afwerking aansluiten'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Aanbouw op maat',
          items: ['Bouwkundig plannen', 'Kozijnen afstemmen', 'Netjes opleveren'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Hoe starten jullie een uitbouw?', answer: pt('We kijken eerst naar constructie, vergunningen, planning en gewenste afwerking.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Stemmen jullie constructie af?', answer: pt('Ja. Waar nodig werken we met vaste constructeurs en partners.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Regelen jullie ook de afwerking binnen?', answer: pt('Ja. Denk aan stucwerk, elektra, vloeropbouw en schilderwerk.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Kan de woning bewoond blijven?', answer: pt('Dat hangt af van de situatie. We bespreken vooraf wat praktisch haalbaar is.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Hoe blijft de planning beheersbaar?', answer: pt('Door bouwkundige voorbereiding, materiaalkeuzes en fasering vooraf vast te leggen.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Is isolatie onderdeel van het werk?', answer: pt('Ja. Dak, gevel en aansluitingen worden meegenomen in de uitvoering.')},
      ],
    },
  },
  {
    _id: 'service-afbouw-nieuwbouw',
    _type: 'service',
    title: 'Afbouw nieuwbouw',
    slug: {_type: 'slug', current: 'afbouw-nieuwbouw'},
    sortOrder: 4,
    icon: 'newbuild',
    label: 'Instapklaar',
    summary: 'Van casco naar woonklaar met één planning.',
    pageContent: {
      eyebrow: 'Afbouw nieuwbouw',
      title: 'Afbouw nieuwbouwwoning',
      intro: 'Van casco naar woonklaar met duidelijke planning en één uitvoerende partij.',
      processTitle: 'Van casco naar woonklaar.',
      processText: 'Scope, volgorde en disciplines worden vooraf vastgelegd.',
      examples: ['Wanden en vloeren', 'Installatie-afwerking', 'Woonklaar opleveren'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij verzorgen',
          items: ['Wanden en plafonds', 'Vloeren', 'Schilderwerk', 'Sanitair en keukenvoorbereiding'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Voor wie',
          items: ['Nieuwbouwwoning eigenaren', 'Kopers met casco oplevering', 'Gezinnen die snel willen intrekken'],
        },
        {
          _key: 'section-2',
          _type: 'listBlock',
          title: 'Waarom dit werkt',
          items: ['Minder losse partijen', 'Kortere doorlooptijd', 'Duidelijke coördinatie'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Casco oplevering',
          items: ['Volgorde bepalen', 'Keuzes bundelen', 'Snel woonklaar'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Nieuwbouwwoning',
          items: ['Vloeren en wanden', 'Installatie-afwerking', 'Schilderklaar of woonklaar'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Meerdere woningen',
          items: ['Herhaalbare aanpak', 'Vaste teams', 'Strakke oplevering'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Wat valt onder afbouw nieuwbouw?', answer: pt('Denk aan wanden, plafonds, vloeren, schilderwerk, installatie-afwerking en detailafwerking.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Kunnen jullie direct na sleuteloverdracht starten?', answer: pt('Als keuzes en planning vooraf rond zijn, kunnen we snel schakelen.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Coördineren jullie alle disciplines?', answer: pt('Ja. U heeft één aanspreekpunt voor de volledige afbouw.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Kan dit ook voor meerdere woningen?', answer: pt('Ja. We kunnen afbouw projectmatig en herhaalbaar uitvoeren.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Stemmen jullie materiaalkeuzes af?', answer: pt('Ja. Keuzes worden vooraf afgestemd op planning en uitvoering.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Hoe wordt opgeleverd?', answer: pt('We controleren per onderdeel en lopen de oplevering samen door.')},
      ],
    },
  },
  {
    _id: 'service-vloerverwarming',
    _type: 'service',
    title: 'Vloerverwarming',
    slug: {_type: 'slug', current: 'vloerverwarming'},
    sortOrder: 5,
    icon: 'floorHeating',
    label: 'Comfort & controle',
    summary: 'Vloerverwarming netjes afgestemd, aangesloten en getest.',
    pageContent: {
      eyebrow: 'Vloerverwarming',
      title: 'Vloerverwarming laten aanleggen',
      intro: 'Vloerverwarming netjes aangelegd als onderdeel van een strak renovatietraject.',
      processTitle: 'Correct aangelegd.',
      processText: 'Het systeem wordt afgestemd, getest en netjes opgeleverd.',
      examples: ['Vloeropbouw bepalen', 'Verdeler plaatsen', 'Testen en afstellen'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij doen',
          items: ['Frezen of opbouw systeem', 'Aansluiten op bestaande installatie', 'Verdeler plaatsen', 'Testen en afstellen'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Onderdeel van een totaaloplossing',
          items: ['Afstemming met vloeropbouw', 'Technische controle vooraf', 'Heldere planning met de rest van het project'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Fermacell',
          items: ['Bij droge opbouw', 'Laag gewicht', 'Snel verder afwerken'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Op netten',
          items: ['Bij nieuwe vloeropbouw', 'Sterke verdeling', 'Geschikt voor grotere ruimtes'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Infrezen',
          items: ['Bij bestaande dekvloer', 'Beperkte opbouwhoogte', 'Snel en netjes uitgevoerd'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Welke methode past bij mijn woning?', answer: pt('Dat hangt af van de vloeropbouw, hoogte en bestaande installatie. We beoordelen dit vooraf.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Kan vloerverwarming in een bestaande woning?', answer: pt('Ja, vaak via infrezen of een dun opbouwsysteem. We kijken wat technisch logisch is.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Stemmen jullie dit af met de vloer?', answer: pt('Ja. Vloerverwarming en vloerafwerking worden samen bekeken.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Wordt het systeem getest?', answer: pt('Ja. We testen en stellen het systeem af voor oplevering.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Kan dit onderdeel zijn van een renovatie?', answer: pt('Ja. Dan plannen we het logisch in met sloop, afbouw en vloerwerk.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Krijg ik uitleg bij oplevering?', answer: pt('Ja. We leggen uit hoe het systeem werkt en waar u op moet letten.')},
      ],
    },
  },
  {
    _id: 'service-warmtepomp',
    _type: 'service',
    title: 'Warmtepomp',
    slug: {_type: 'slug', current: 'warmtepomp'},
    sortOrder: 6,
    icon: 'heatPump',
    label: 'Duurzame installatie',
    summary: 'Warmtepomp installatie met advies, aansluiting en controle.',
    pageContent: {
      eyebrow: 'Warmtepomp',
      title: 'Warmtepomp installatie',
      intro: 'Warmtepomp installatie met advies, aansluiting en duidelijke oplevering.',
      processTitle: 'Goed afgestemd.',
      processText: 'Systeemkeuze, aansluiting en werking worden gecontroleerd.',
      examples: ['Advies en selectie', 'Installatie en aansluiting', 'Inregelen en uitleg'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij doen',
          items: ['Advies en selectie systeem', 'Installatie en aansluiting', 'Integratie met bestaande installaties', 'Inregelen en oplevering'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Onderdeel van een totaaloplossing',
          items: ['Afstemming met renovatie of afbouw', 'Technische voorbereiding', 'Controle op werking en oplevering'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Hybride systeem',
          items: ['Bij bestaande ketel', 'Stap naar verduurzaming', 'Praktische overgang'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'All-electric',
          items: ['Volledig elektrisch', 'Goede isolatie nodig', 'Voorbereiding belangrijk'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Renovatie',
          items: ['Afstemmen met installaties', 'Ruimte en geluid beoordelen', 'Netjes integreren'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Welke warmtepomp past bij mijn woning?', answer: pt('Dat hangt af van isolatie, huidige installatie, ruimte en energiebehoefte.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Kijken jullie naar bestaande installaties?', answer: pt('Ja. We controleren hoe het systeem kan worden geïntegreerd.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Is een warmtepomp altijd geschikt?', answer: pt('Niet altijd. Daarom beoordelen we de woning eerst zorgvuldig.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Regelen jullie inregelen en oplevering?', answer: pt('Ja. Het systeem wordt ingesteld en gecontroleerd op werking.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Kan dit samen met vloerverwarming?', answer: pt('Ja. Die combinatie wordt vaak samen bekeken voor een efficiënt systeem.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Krijg ik uitleg over gebruik?', answer: pt('Ja. Bij oplevering leggen we de basisinstellingen en aandachtspunten uit.')},
      ],
    },
  },
  {
    _id: 'service-zonnepanelen',
    _type: 'service',
    title: 'Zonnepanelen',
    slug: {_type: 'slug', current: 'zonnepanelen'},
    sortOrder: 7,
    icon: 'solar',
    label: 'Veilig aangesloten',
    summary: 'Zonnepanelen veilig geplaatst en aangesloten.',
    pageContent: {
      eyebrow: 'Zonnepanelen',
      title: 'Zonnepanelen laten installeren',
      intro: 'Zonnepanelen veilig geplaatst, aangesloten en gecontroleerd opgeleverd.',
      processTitle: 'Veilig geïnstalleerd.',
      processText: 'Plaatsing, aansluiting en controle worden helder afgestemd.',
      examples: ['Dakinspectie', 'Panelen plaatsen', 'Aansluiten en controleren'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij doen',
          items: ['Plaatsing panelen', 'Omvormer installatie', 'Aansluiting op meterkast', 'Controle en oplevering'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Onderdeel van een totaaloplossing',
          items: ['Veilige voorbereiding', 'Nette afstemming met bestaande installatie', 'Controle voor oplevering'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Schuin dak',
          items: ['Dakvlak beoordelen', 'Montageplan maken', 'Veilig installeren'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Plat dak',
          items: ['Ballast en ligging', 'Windbelasting checken', 'Nette kabelroute'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Meterkast',
          items: ['Aansluiting controleren', 'Groep voorbereiden', 'Veilig opleveren'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Bekijken jullie eerst het dak?', answer: pt('Ja. We kijken naar dakvlak, ligging, bereikbaarheid en veilige montage.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Wordt de meterkast meegenomen?', answer: pt('Ja. De aansluiting op de meterkast wordt gecontroleerd en afgestemd.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Kan dit tijdens een renovatie?', answer: pt('Ja. Dan plannen we dit logisch mee met andere werkzaamheden.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Hoe wordt kabelwerk weggewerkt?', answer: pt('We kiezen vooraf een nette en veilige kabelroute.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Controleren jullie na installatie?', answer: pt('Ja. We controleren plaatsing, aansluiting en werking.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Krijg ik uitleg bij oplevering?', answer: pt('Ja. We nemen de installatie en aandachtspunten kort met u door.')},
      ],
    },
  },
  {
    _id: 'service-stuc-schilderwerk',
    _type: 'service',
    title: 'Stuc- en schilderwerk',
    slug: {_type: 'slug', current: 'stuc-schilderwerk'},
    sortOrder: 8,
    icon: 'paint',
    label: 'Strakke afwerking',
    summary: 'Strakke wanden, plafonds en schilderwerk.',
    pageContent: {
      eyebrow: 'Afwerking',
      title: 'Stuc- en schilderwerk',
      intro: 'Strakke wanden, plafonds en schilderwerk met gecontroleerde afwerking.',
      processTitle: 'Afwerking met controle.',
      processText: 'Voorbereiding, bescherming en eindcontrole horen bij het proces.',
      examples: ['Ondergrond voorbereiden', 'Strak afwerken', 'Eindcontrole'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij doen',
          items: ['Wanden en plafonds stucen', 'Glad pleisterwerk', 'Schilderwerk binnen en buiten', 'Afwerking tot in detail'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Onderdeel van een totaaloplossing',
          items: ['Afstemming met renovatieplanning', 'Nette voorbereiding en bescherming', 'Controle op eindafwerking'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Nieuw stucwerk',
          items: ['Strakke ondergrond', 'Wanden en plafonds', 'Klaar voor afwerking'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Schilderwerk',
          items: ['Binnen en buiten', 'Nette voorbereiding', 'Duurzame lagen'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Renovatie-afwerking',
          items: ['Herstel meenemen', 'Details strak trekken', 'Rustig eindbeeld'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Doen jullie stuc- en schilderwerk samen?', answer: pt('Ja. Daardoor sluiten voorbereiding en afwerking beter op elkaar aan.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Wordt de woning beschermd?', answer: pt('Ja. We beschermen vloeren, kozijnen en andere onderdelen waar nodig.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Kunnen jullie beschadigingen herstellen?', answer: pt('Ja. Kleine herstelpunten nemen we mee in de voorbereiding.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Is dit onderdeel van totaalrenovatie?', answer: pt('Ja. Afwerking is vaak de laatste fase van het traject.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Hoe bewaken jullie kwaliteit?', answer: pt('We controleren ondergrond, lagen en details voor oplevering.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Stemmen jullie kleuren en afwerking af?', answer: pt('Ja. Keuzes worden vooraf afgestemd zodat de uitvoering helder blijft.')},
      ],
    },
  },
  {
    _id: 'service-onderhoud',
    _type: 'service',
    title: 'Onderhoud',
    slug: {_type: 'slug', current: 'onderhoud'},
    sortOrder: 9,
    icon: 'maintenance',
    label: 'Herstel & behoud',
    summary: 'Onderhoud en herstelwerk helder afgestemd.',
    pageContent: {
      eyebrow: 'Onderhoud',
      title: 'Onderhoud en herstelwerk',
      intro: 'Onderhoud en herstelwerk helder afgestemd en netjes uitgevoerd.',
      processTitle: 'Netjes uitgevoerd.',
      processText: 'Inspectie, planning en afronding blijven overzichtelijk.',
      examples: ['Inspectie', 'Herstel uitvoeren', 'Controle en afronding'],
      sections: [
        {
          _key: 'section-0',
          _type: 'listBlock',
          title: 'Wat wij doen',
          items: ['Klein herstelwerk', 'Kit- en voegwerk', 'Inspectie en onderhoud', 'Oplossen van gebreken'],
        },
        {
          _key: 'section-1',
          _type: 'listBlock',
          title: 'Onderdeel van een totaaloplossing',
          items: ['Heldere inspectie vooraf', 'Praktische planning', 'Nette uitvoering en afronding'],
        },
      ],
      situations: [
        {
          _key: 'situation-0',
          _type: 'listBlock',
          title: 'Herstelwerk',
          items: ['Gebreken oplossen', 'Nette afwerking', 'Snel duidelijkheid'],
        },
        {
          _key: 'situation-1',
          _type: 'listBlock',
          title: 'Periodiek onderhoud',
          items: ['Voorkomen van schade', 'Inspectie vooraf', 'Praktisch plannen'],
        },
        {
          _key: 'situation-2',
          _type: 'listBlock',
          title: 'Na renovatie',
          items: ['Kleine punten nalopen', 'Kit en voegwerk', 'Woning netjes houden'],
        },
      ],
      faqs: [
        {_key: 'faq-0', _type: 'faqItem', question: 'Doen jullie ook klein herstelwerk?', answer: pt('Ja. We pakken kleine herstelpunten professioneel en netjes op.')},
        {_key: 'faq-1', _type: 'faqItem', question: 'Kunnen jullie eerst inspecteren?', answer: pt('Ja. We bekijken wat nodig is voordat we werkzaamheden inplannen.')},
        {_key: 'faq-2', _type: 'faqItem', question: 'Is onderhoud ook voor zakelijke partijen?', answer: pt('Ja. Ook voor vastgoed, mutatie en terugkerend onderhoud.')},
        {_key: 'faq-3', _type: 'faqItem', question: 'Regelen jullie kit- en voegwerk?', answer: pt('Ja. Dat valt onder onderhoud en herstel.')},
        {_key: 'faq-4', _type: 'faqItem', question: 'Hoe snel kan onderhoud worden ingepland?', answer: pt('Dat hangt af van de werkzaamheden. Na intake geven we duidelijkheid.')},
        {_key: 'faq-5', _type: 'faqItem', question: 'Krijg ik advies voor vervolg?', answer: pt('Ja. We geven aan wat direct nodig is en wat later kan.')},
      ],
    },
  },
]

async function main() {
  for (const service of services) {
    await upsertById(service)
  }
  console.log(`\n✅ Done — ${services.length} services seeded.`)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
