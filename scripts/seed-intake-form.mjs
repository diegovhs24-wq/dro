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

// --- FAQ documents (referenced by the intake form) --------------------------

const faqDocs = [
  {
    _id: 'intake-faq-1',
    _type: 'faq',
    question: 'Wat gebeurt er na mijn aanvraag?',
    answer: ['We bekijken uw aanvraag en nemen binnen 24 uur contact op om de situatie rustig door te nemen.'],
    category: 'Intake',
    sortOrder: 1,
  },
  {
    _id: 'intake-faq-2',
    _type: 'faq',
    question: 'Krijg ik één aanspreekpunt?',
    answer: ['Ja. U heeft één vast aanspreekpunt voor vragen, planning en afstemming.'],
    category: 'Intake',
    sortOrder: 2,
  },
  {
    _id: 'intake-faq-3',
    _type: 'faq',
    question: "Kan ik foto's later nog nasturen?",
    answer: ["Ja. Tijdens het eerste contact geven wij aan welke foto's of tekeningen handig zijn."],
    category: 'Intake',
    sortOrder: 3,
  },
  {
    _id: 'intake-faq-4',
    _type: 'faq',
    question: 'Werken jullie ook zakelijk?',
    answer: ['Ja. Wij ondersteunen ook vastgoedpartijen, aannemers en ontwikkelaars met uitvoering en afbouw.'],
    category: 'Intake',
    sortOrder: 4,
  },
]

// --- Intake form document ---------------------------------------------------

const FORM_ID = 'default-intake-form'

const intakeFormDoc = {
  _id: FORM_ID,
  _type: 'intakeForm',
  title: 'Standaard Intake Formulier',
  formTitle: 'Start uw aanvraag',
  timeLabel: 'Duurt ca. 2 minuten',
  description: 'Vul het formulier in en wij nemen binnen 24 uur contact met u op.',
  privacyText: 'Uw gegevens worden vertrouwelijk behandeld en nooit gedeeld met derden.',
  steps: [
    {
      _key: 'step-client-type',
      title: 'Voor wie is deze aanvraag?',
      subtitle: 'Zo stemmen we de intake direct goed af.',
      stepType: 'clientType',
      stepKey: 'clientType',
      options: ['Particulier', 'Zakelijk'],
    },
    {
      _key: 'step-contact',
      title: 'Hoe kunnen we u bereiken?',
      subtitle: 'We nemen binnen 24 uur persoonlijk contact op.',
      stepType: 'fields',
      fields: [
        {_key: 'f-naam',      fieldKey: 'naam',      label: 'Naam *',            inputType: 'text',  required: true,  halfWidth: false},
        {_key: 'f-email',     fieldKey: 'email',     label: 'E-mail *',          inputType: 'email', required: true,  halfWidth: false},
        {_key: 'f-telefoon',  fieldKey: 'telefoon',  label: 'Telefoonnummer *',  inputType: 'tel',   required: true,  halfWidth: false},
      ],
    },
    {
      _key: 'step-address',
      title: 'Waar bevindt het project zich?',
      subtitle: 'Alleen de basislocatie is genoeg voor de eerste beoordeling.',
      stepType: 'fields',
      fields: [
        {_key: 'f-straatnaam',  fieldKey: 'straatnaam',  label: 'Straatnaam *',   inputType: 'text', required: true,  halfWidth: true},
        {_key: 'f-huisnummer',  fieldKey: 'huisnummer',  label: 'Huisnummer *',   inputType: 'text', required: true,  halfWidth: true},
        {_key: 'f-postcode',    fieldKey: 'postcode',    label: 'Postcode *',     inputType: 'text', required: true,  halfWidth: true},
        {_key: 'f-plaats',      fieldKey: 'plaats',      label: 'Plaats *',       inputType: 'text', required: true,  halfWidth: true},
      ],
    },
    {
      _key: 'step-project-type',
      title: 'Wat wilt u laten uitvoeren?',
      subtitle: 'Kies de dienst die het beste past. Details bespreken we daarna.',
      stepType: 'choice',
      stepKey: 'projectType',
      options: [
        'Badkamer renovatie',
        'Totaalrenovatie',
        'Uitbouw / aanbouw',
        'Afbouw nieuwbouw',
        'Vloerverwarming',
        'Warmtepomp',
        'Zonnepanelen',
        'Stuc- en schilderwerk',
        'Onderhoud',
        'Zakelijk project',
      ],
    },
    {
      _key: 'step-budget',
      title: 'Welke budgetrange past bij uw project?',
      subtitle: 'Geen oordeel. Dit helpt alleen om realistisch mee te denken.',
      stepType: 'choice',
      stepKey: 'budget',
      options: [
        'Nog te bepalen',
        '€ 5.000 - € 15.000',
        '€ 15.000 - € 30.000',
        '€ 30.000 - € 75.000',
        '€ 75.000+',
        'Zakelijk / meerdere units',
      ],
    },
    {
      _key: 'step-date',
      title: 'Wanneer wilt u starten?',
      subtitle: 'Een indicatie is voldoende. We stemmen de planning samen af.',
      stepType: 'date',
      stepKey: 'startDate',
    },
    {
      _key: 'step-description',
      title: 'Wat moeten we weten?',
      subtitle: 'Korte omschrijving van uw project',
      stepType: 'textarea',
      stepKey: 'description',
    },
  ],
  successEyebrow: 'Aanvraag ontvangen',
  successTitle: 'We nemen contact met u op',
  successText: 'Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op.',
  faqItems: faqDocs.map((faq) => ({_key: faq._id, _type: 'reference', _ref: faq._id})),
  submitLabel: 'Verstuur intake',
  nextLabel: 'Volgende stap',
  backLabel: 'Terug',
  errorMessage: 'Vul deze stap eerst in, dan kunt u door.',
}

// --- Main -------------------------------------------------------------------

async function main() {
  // 1. Seed FAQ documents
  console.log('Seeding FAQ documents…')
  for (const faq of faqDocs) {
    await client.createOrReplace(faq)
    console.log(`  ✓ FAQ: ${faq.question}`)
  }

  // 2. Seed intake form
  console.log(`\nSeeding intake form (id: ${FORM_ID})…`)
  await client.createOrReplace(intakeFormDoc)
  console.log('  ✓ Intake form created / updated.')

  console.log('\nDone. Link the form in the hero block via Sanity Studio.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
