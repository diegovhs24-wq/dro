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

const projects = [
  {
    _id: 'project-badkamer-renovatie-den-haag',
    _type: 'project',
    title: 'Badkamer in hotelstijl',
    slug: {_type: 'slug', current: 'badkamer-renovatie-den-haag'},
    sortOrder: 1,
    description: 'Een compacte badkamer in Den Haag is volledig vernieuwd met rustige materialen, strak tegelwerk en praktische maatwerkdetails.',
    location: 'Den Haag',
    type: 'Badkamer renovatie',
    duration: '3 weken',
    before: 'Voor',
    after: 'Na',
    story:
      'De woning had een verouderde badkamer met weinig opbergruimte en een onrustige indeling. We hebben de ruimte eerst technisch opnieuw opgebouwd en daarna gekozen voor een rustige hotelstijl. Door leidingwerk, verlichting en tegelwerk strak te plannen, bleef de doorlooptijd voorspelbaar en kon de klant snel weer gebruikmaken van de badkamer.',
    work_items: [
      'Sloop en afvoer oude badkamer',
      'Aanpassen waterleidingen en afvoer',
      'Nieuwe elektra en dimbare verlichting',
      'Tegelwerk vloer en wanden',
      'Installatie sanitair en maatwerk nis',
      'Kitwerk en eindafwerking',
    ],
  },
  {
    _id: 'project-totaalrenovatie-gezinswoning-rijswijk',
    _type: 'project',
    title: 'Gezinswoning totaalrenovatie',
    slug: {_type: 'slug', current: 'totaalrenovatie-gezinswoning-rijswijk'},
    sortOrder: 2,
    description: 'Een aangekochte gezinswoning in Rijswijk is volledig gerenoveerd met nieuwe indeling, installaties en afwerking.',
    location: 'Rijswijk',
    type: 'Totaalrenovatie',
    duration: '9 weken',
    before: 'Casco',
    after: 'Instapklaar',
    story:
      'De bewoners wilden direct na aankoop duidelijkheid over planning, keuzes en prioriteiten. We hebben de renovatie opgeknipt in logische fases: sloop, technische vernieuwing, indeling en afbouw. Daardoor bleef het project beheersbaar en waren keuzes steeds op tijd gemaakt.',
    work_items: [
      'Complete sloop en voorbereiding',
      'Nieuwe elektra en installaties',
      'Aanpassen indeling begane grond',
      'Stucwerk en schilderwerk',
      'Nieuwe vloeren en plinten',
      'Badkamer en toilet vernieuwd',
    ],
  },
  {
    _id: 'project-uitbouw-leefkeuken-voorburg',
    _type: 'project',
    title: 'Uitbouw met leefkeuken',
    slug: {_type: 'slug', current: 'uitbouw-leefkeuken-voorburg'},
    sortOrder: 3,
    description: 'Een woning in Voorburg kreeg meer leefruimte door een uitbouw met veel licht en een directe verbinding met de tuin.',
    location: 'Voorburg',
    type: 'Uitbouw / aanbouw',
    duration: '8 weken',
    before: 'Oud',
    after: 'Nieuw',
    story:
      'De klant wilde een ruimere leefkeuken zonder grip te verliezen op planning en bouwkundige keuzes. Samen met vaste partners hebben we constructie, kozijnen, dak en afwerking afgestemd voordat de uitvoering startte. Het resultaat is een lichte ruimte die dagelijks wordt gebruikt als hart van de woning.',
    work_items: [
      'Fundering en constructiewerk',
      'Plaatsen kozijnen en pui',
      'Dakopbouw en isolatie',
      'Elektra en voorbereiding keuken',
      'Stucwerk en vloerafwerking',
      'Oplevering inclusief detailcontrole',
    ],
  },
  {
    _id: 'project-afbouw-nieuwbouwwoning-delft',
    _type: 'project',
    title: 'Afbouw nieuwbouwwoning',
    slug: {_type: 'slug', current: 'afbouw-nieuwbouwwoning-delft'},
    sortOrder: 4,
    description: 'Een casco nieuwbouwwoning in Delft is volledig afgewerkt zodat de bewoners direct konden intrekken.',
    location: 'Delft',
    type: 'Afbouw nieuwbouw',
    duration: '5 weken',
    before: 'Nieuwbouw',
    after: 'Woonklaar',
    story:
      'Na oplevering van de nieuwbouwwoning moest er in korte tijd veel gebeuren. We hebben de afbouw centraal gepland, zodat vloeren, wanden, verlichting en sanitaire afwerking elkaar niet in de weg zaten. De klant had één aanspreekpunt en wist per week wat er gebeurde.',
    work_items: [
      'Wand- en plafondafwerking',
      'Vloeren en plinten',
      'Verlichting en elektra-afwerking',
      'Sanitair geplaatst',
      'Schilderwerk',
      'Eindcontrole voor intrek',
    ],
  },
  {
    _id: 'project-appartement-renovatie-rotterdam',
    _type: 'project',
    title: 'Appartement upgrade',
    slug: {_type: 'slug', current: 'appartement-renovatie-rotterdam'},
    sortOrder: 5,
    description: 'Een appartement in Rotterdam kreeg een moderne upgrade met nieuwe badkamer, strak stucwerk en vloerafwerking.',
    location: 'Rotterdam',
    type: 'Appartement renovatie',
    duration: '4 weken',
    before: 'Gedateerd',
    after: 'Modern',
    story:
      'Bij dit appartement lag de nadruk op snelheid en minimale overlast. Door de werkzaamheden compact te plannen en materiaalkeuzes vooraf vast te leggen, konden we binnen korte tijd veel impact maken zonder het traject onnodig complex te maken.',
    work_items: [
      'Badkamer vernieuwd',
      'Stucwerk hersteld en afgewerkt',
      'Nieuwe vloerafwerking',
      'Schilderwerk',
      'Verlichting vervangen',
      'Opleverronde met klant',
    ],
  },
  {
    _id: 'project-begane-grond-renovatie-leiden',
    _type: 'project',
    title: 'Begane grond renovatie',
    slug: {_type: 'slug', current: 'begane-grond-renovatie-leiden'},
    sortOrder: 6,
    description: 'Een gesloten begane grond in Leiden is omgezet naar een open leefruimte met betere routing en hoogwaardige afwerking.',
    location: 'Leiden',
    type: 'Begane grond renovatie',
    duration: '6 weken',
    before: 'Gesloten',
    after: 'Open',
    story:
      'De bewoners wilden meer rust, licht en een logische verbinding tussen keuken en woonkamer. We hebben de werkzaamheden technisch voorbereid en daarna in fases uitgevoerd, zodat constructieve keuzes, afbouw en installaties netjes op elkaar aansloten.',
    work_items: [
      'Sloop en voorbereiding',
      'Aanpassen indeling',
      'Elektra en verlichting',
      'Wand- en plafondafwerking',
      'Vloerafwerking',
      'Detailafwerking en oplevering',
    ],
  },
]

async function main() {
  for (const project of projects) {
    await upsertById(project)
  }
  console.log(`\n✅ Done — ${projects.length} projects seeded.`)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
