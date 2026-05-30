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

function pt(...paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: Math.random().toString(36).slice(2, 9), text, marks: []}],
  }))
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

const faqs = [
  {
    _id: 'faq-aanvraag-gedaan',
    _type: 'faq',
    question: 'Wat gebeurt er nadat ik mijn aanvraag heb gedaan?',
    answer: pt(
      'We nemen binnen 24 uur contact met u op. Soms dezelfde dag, soms de volgende werkdag.',
      'We kijken direct of uw project bij ons past. Zo ja, dan plannen we een gesprek in en gaan we inhoudelijk met u mee.',
      'Past het niet? Dan zeggen we dat ook gewoon eerlijk.',
    ),
  },
  {
    _id: 'faq-snel-weten',
    _type: 'faq',
    question: 'Hoe snel weet ik waar ik aan toe ben?',
    answer: pt(
      'Vrij snel. Na het eerste gesprek kunnen we al veel richting geven.',
      'Daarna ontvangt u een duidelijke offerte waarin staat wat we doen, hoe we het doen en wat het kost.',
      'Geen vage aannames. Gewoon concreet.',
    ),
  },
  {
    _id: 'faq-geen-compleet-plan',
    _type: 'faq',
    question: 'Wat als ik zelf nog geen compleet plan heb?',
    answer: pt(
      'Dat is normaal. De meeste projecten starten met een idee, niet met een uitgewerkt ontwerp.',
      'Wij helpen u dat idee technisch en praktisch kloppend te maken.',
      "Van 'ik wil iets' naar 'zo gaan we het doen'.",
    ),
  },
  {
    _id: 'faq-alles-zelf-of-losse-partijen',
    _type: 'faq',
    question: 'Doen jullie echt alles zelf of werken jullie met losse partijen?',
    answer: pt(
      'Wij werken met vaste teams en vaste specialisten.',
      'Denk aan sloopwerk, constructieve aanpassingen, elektra, installaties, wanden, vloeren, tegelwerk, stucwerk, schilderwerk, timmerwerk en afbouw.',
      'Alles wordt vanuit één centrale aansturing geregeld.',
    ),
  },
  {
    _id: 'faq-constructieve-dingen',
    _type: 'faq',
    question: 'Kunnen jullie ook constructieve dingen oppakken?',
    answer: pt(
      'Ja. Bijvoorbeeld dragende muren aanpassen, staalconstructies plaatsen, indelingen veranderen en volledige renovaties.',
      'Waar nodig werken we samen met constructeurs en zorgen wij dat de uitvoering klopt.',
      'U hoeft dat niet zelf te regelen.',
    ),
  },
  {
    _id: 'faq-project-niet-uitloopt',
    _type: 'faq',
    question: 'Hoe zorgen jullie dat een project niet uitloopt?',
    answer: pt(
      'Door vooraf strak te plannen en tijdens het werk kort te schakelen.',
      'Duidelijke voorbereiding, vaste teams en directe communicatie zorgen voor overzicht.',
      'Geen losse schakels, maar één lijn.',
    ),
  },
  {
    _id: 'faq-een-aanspreekpunt',
    _type: 'faq',
    question: 'Heb ik één aanspreekpunt tijdens het project?',
    answer: pt(
      'Ja. U heeft één vast aanspreekpunt die alles overziet.',
      'Van planning tot uitvoering.',
      'Geen gedoe met vijf verschillende nummers.',
    ),
  },
  {
    _id: 'faq-iets-verandert',
    _type: 'faq',
    question: 'Wat gebeurt er als er iets verandert tijdens de verbouwing?',
    answer: pt(
      'Dat gebeurt soms en dat is geen probleem.',
      'We bespreken direct wat er verandert, wat dat betekent en wat het eventueel kost.',
      'Altijd vooraf duidelijk. Nooit achteraf verrassingen.',
    ),
  },
  {
    _id: 'faq-vaste-mensen',
    _type: 'faq',
    question: 'Werken jullie met vaste mensen?',
    answer: pt(
      'Ja. Wij werken met vaste vakmensen die gewend zijn om samen te werken.',
      'Geen wisselende ploegen per week.',
      'Daardoor blijven kwaliteit en tempo stabiel.',
    ),
  },
  {
    _id: 'faq-hoe-jullie-werken-zien',
    _type: 'faq',
    question: 'Kan ik zien hoe jullie werken voordat ik beslis?',
    answer: pt(
      'Ja. Tijdens het traject nemen we u indien mogelijk mee naar een lopend project.',
      'Zo ziet u precies wat u kunt verwachten.',
      'Dat geeft vaak meteen vertrouwen.',
    ),
  },
  {
    _id: 'faq-juiste-partij',
    _type: 'faq',
    question: 'Voor wat voor projecten zijn jullie de juiste partij?',
    answer: pt(
      'Voor mensen die het goed geregeld willen hebben.',
      'Badkamers, totaalrenovaties, verbouwingen en grotere projecten passen goed bij onze aanpak.',
      'Zolang kwaliteit en duidelijkheid belangrijk zijn, zitten we goed.',
    ),
  },
  {
    _id: 'faq-project-past-niet',
    _type: 'faq',
    question: 'En als mijn project niet bij jullie past?',
    answer: pt(
      'Dan zeggen we dat eerlijk.',
      'We nemen alleen projecten aan waar we volledig achter staan en capaciteit voor hebben.',
      'Liever nee zeggen, dan half werk leveren.',
    ),
  },
  {
    _id: 'faq-groot-of-familiebedrijf',
    _type: 'faq',
    question: 'Zijn jullie meer een groot bedrijf of een familiebedrijf?',
    answer: pt(
      'Beide.',
      'We hebben de structuur en capaciteit om projecten strak te draaien, maar werken nog steeds met persoonlijk contact en verantwoordelijkheid.',
      'U merkt dat verschil direct.',
    ),
  },
  {
    _id: 'faq-kwaliteit-en-zekerheid',
    _type: 'faq',
    question: 'Hoe zit het met kwaliteit en zekerheid?',
    answer: pt(
      'Dat is goed geregeld.',
      'Onze monteurs zijn VCA gecertificeerd en het bedrijf beschikt over een CAR- en aansprakelijkheidsverzekering.',
      'We werken veilig, gestructureerd en professioneel.',
    ),
  },
  {
    _id: 'faq-waarom-kiezen-voor-jullie',
    _type: 'faq',
    question: 'Waarom kiezen mensen uiteindelijk voor jullie?',
    answer: pt(
      'Omdat het klopt.',
      'Duidelijke communicatie, strakke uitvoering, geen verrassingen en één aanspreekpunt.',
      'En misschien nog belangrijker: het voelt betrouwbaar.',
    ),
  },
]

async function main() {
  for (const faq of faqs) {
    await upsertById(faq)
  }
  console.log(`\n✅ Done — ${faqs.length} FAQs seeded.`)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
