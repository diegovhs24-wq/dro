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

function ref(id) {
  return {_type: 'reference', _ref: id}
}

function external(url) {
  return {_type: 'smartLink', linkType: 'external', externalUrl: url}
}

function btn(key, label, link, variant = 'primary') {
  return {_type: 'headerButton', _key: key, label, link, variant}
}

async function upsertById(doc) {
  const id = doc._id
  const existing = await client.fetch(`*[_id == $id][0]{ _id }`, {id})
  if (existing?._id) {
    const {_id, _type, ...rest} = doc
    const result = await client.patch(id).set(rest).commit({returnDocuments: true})
    console.log(`✅ Updated ${doc._type}: ${result._id}`)
  } else {
    const result = await client.create(doc)
    console.log(`✅ Created ${doc._type}: ${result._id}`)
  }
}

// FAQ document references (seeded via seed-faqs.mjs)
const faqRefs = [
  'faq-aanvraag-gedaan',
  'faq-snel-weten',
  'faq-geen-compleet-plan',
  'faq-alles-zelf-of-losse-partijen',
  'faq-constructieve-dingen',
  'faq-project-niet-uitloopt',
  'faq-een-aanspreekpunt',
  'faq-iets-verandert',
  'faq-vaste-mensen',
  'faq-hoe-jullie-werken-zien',
  'faq-juiste-partij',
  'faq-project-past-niet',
  'faq-groot-of-familiebedrijf',
  'faq-kwaliteit-en-zekerheid',
  'faq-waarom-kiezen-voor-jullie',
].map((id, i) => ({_key: `faq-ref-${i}`, ...ref(id)}))

const pages = [
  // ─── Homepage ─────────────────────────────────────────────────────────────
  {
    _id: 'home',
    _type: 'page',
    title: 'Home',
    slug: {_type: 'slug', current: 'home'},
    contentBlocks: [
      {
        _key: 'homeHeroBlock-0',
        _type: 'homeHeroBlock',
        hero: {
          backgroundImage: {
            _type: 'cmsImage',
            externalImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85',
          },
          coverageText: 'Dekking in Zuid-Holland, Noord-Holland, Utrecht en een deel van Zeeland dankzij meerdere opstartlocaties',
          headlineTop: 'Wij regelen uw',
          headlineHighlight: 'verbouwing.',
          headlineBottom: 'Van A tot Z.',
          description: 'Eén aanspreekpunt. Strakke planning. Vaste teams.\nGeen verrassingen achteraf.',
          trustItems: [
            {_key: 'iconText-0', _type: 'iconText', icon: 'contact', title: 'Eén aanspreekpunt'},
            {_key: 'iconText-1', _type: 'iconText', icon: 'planning', title: 'Strakke planning'},
            {_key: 'iconText-2', _type: 'iconText', icon: 'shield', title: 'Geen verrassingen'},
          ],
          note: 'Past uw project bij ons? Dan gaan we all-in.\nPast het niet? Dan zeggen we dat eerlijk.',
          intakeForm: ref('default-intake-form'),
          formTitle: 'Start uw project',
          formText: 'Beantwoord stap voor stap en ontvang binnen 24 uur duidelijkheid.',
          formTimeLabel: '(1 minuut)',
          formPrivacyText: 'Wij nemen altijd contact op. Ook als uw project niet bij ons past.',
          stats: [
            {_key: 'stat-0', rating: true, value: '273+ reviews', label: 'Klanten beoordelen ons met 4.8/5'},
            {_key: 'stat-1', rating: false, icon: 'team', value: '100+', label: 'Projecten succesvol opgeleverd'},
            {_key: 'stat-2', rating: false, icon: 'planning', value: 'Binnen 24 uur', label: 'Duidelijkheid over uw project'},
          ],
          processIntro: 'Duidelijk. Gestructureerd.\nZo werken wij.',
          processSteps: [
            {_key: 'processStep-0', icon: 'idea', title: '1. Idee', text: 'U heeft een idee of wens. Wij denken direct met u mee.'},
            {_key: 'processStep-1', icon: 'talk', title: '2. Gesprek', text: 'We bespreken uw situatie en geven eerlijk advies.'},
            {_key: 'processStep-2', icon: 'checklist', title: '3. Plan', text: 'U ontvangt een helder plan en een transparante offerte.'},
            {_key: 'processStep-3', icon: 'tools', title: '4. Uitvoering', text: 'Ons team voert het werk uit volgens planning en afspraak.'},
            {_key: 'processStep-4', icon: 'delivery', title: '5. Oplevering', text: 'We leveren netjes op. Alles gecontroleerd en afgerond.'},
          ],
        },
      },
      {
        _key: 'problemSolutionBlock-1',
        _type: 'problemSolutionBlock',
        problemEyebrow: 'Probleem',
        problemTitle: 'Waar loopt u tegenaan?',
        problems: ['Onduidelijke offertes', 'Slechte communicatie', 'Te veel partijen', 'Kosten die oplopen'],
        solutionEyebrow: 'Oplossing',
        solutionTitle: 'Zo hoort het wél',
        solutions: ['Duidelijkheid vooraf', 'Eén aanspreekpunt', 'Strakke planning', 'Geen verrassingen achteraf'],
        solutionNote: 'Bij DRO Renovaties weet u vooraf waar u aan toe bent.',
        bannerTitle: 'Rustig starten met een duidelijke intake.',
        bannerButtonLabel: 'Start intake',
        bannerButtonLink: internal('page-contact'),
      },
      {
        _key: 'iconCardsBlock-3',
        _type: 'iconCardsBlock',
        eyebrow: 'Afbouw',
        title: 'Complete afbouw onder één verantwoordelijkheid.',
        buttonLabel: 'Bekijk zakelijk',
        buttonLink: internal('page-zakelijk'),
        items: [
          {_key: 'iconText-0', _type: 'iconText', icon: 'materials', title: 'Metselwerk'},
          {_key: 'iconText-1', _type: 'iconText', icon: 'bathroom', title: 'Tegelwerk'},
          {_key: 'iconText-2', _type: 'iconText', icon: 'newbuild', title: 'Wanden en plafonds'},
          {_key: 'iconText-3', _type: 'iconText', icon: 'finish', title: 'Afwerking'},
          {_key: 'iconText-4', _type: 'iconText', icon: 'tools', title: 'Timmerwerk'},
        ],
      },
      {
        _key: 'partnersBlock-4',
        _type: 'partnersBlock',
        eyebrow: 'Partners',
        title: 'Vaste partners voor materiaal, sanitair en keukens.',
        text: 'Wij werken met herkenbare leveranciers zodat keuzes, levertijden en kwaliteit beter te controleren zijn.',
      },
      {
        _key: 'googleReviewsBlock-6',
        _type: 'googleReviewsBlock',
        compact: true,
        limit: 4,
      },
    ],
  },

  // ─── Contact ──────────────────────────────────────────────────────────────
  {
    _id: 'page-contact',
    _type: 'page',
    title: 'Contact',
    slug: {_type: 'slug', current: 'contact'},
    contentBlocks: [
      {
        _key: 'contactFormBlock-0',
        _type: 'contactFormBlock',
        eyebrow: 'Project intake',
        title: 'Start uw project intake',
        text: 'Stap voor stap geregeld. Binnen 24 uur duidelijkheid.',
        note: 'Eén vraag per keer. Zo blijft de aanvraag rustig en overzichtelijk.',
        intakeForm: ref('default-intake-form'),
      },
    ],
  },

  // ─── Over ons ─────────────────────────────────────────────────────────────
  {
    _id: 'page-over-ons',
    _type: 'page',
    title: 'Over ons',
    slug: {_type: 'slug', current: 'over-ons'},
    contentBlocks: [
      {
        _key: 'aboutIntroBlock-0',
        _type: 'aboutIntroBlock',
        eyebrow: 'Over ons',
        title: 'DRO Bouwgroep staat voor duidelijk bouwen.',
        intro: 'Complete renovatie- en bouwtrajecten voor particuliere en zakelijke opdrachtgevers.',
        sketchLabels: ['1. Idee', '2. Bespreking', '3. Realiteit'],
        sketchClosing: 'Van eerste idee tot oplevering.\nEén team, één aanspreekpunt, één resultaat.',
        introItems: [
          {_key: 'iconText-0', _type: 'iconText', icon: 'finish', text: 'DRO Bouwgroep is een multidisciplinair bouwbedrijf dat complete renovatie- en bouwtrajecten verzorgt voor zowel particuliere als zakelijke opdrachtgevers.'},
          {_key: 'iconText-1', _type: 'iconText', icon: 'checklist', text: 'Wij combineren vakmanschap met strakke projectsturing, waardoor kwaliteit, planning en communicatie altijd onder controle blijven.'},
          {_key: 'iconText-2', _type: 'iconText', icon: 'team', text: 'Van een badkamerrenovatie tot een volledige verbouwing: elk project wordt uitgevoerd vanuit één duidelijke aanpak met vaste teams en heldere afspraken.'},
          {_key: 'iconText-3', _type: 'iconText', icon: 'contact', text: 'Wij werken niet vanuit losse klussen, maar vanuit complete oplossingen. Van voorbereiding en sloop tot afwerking en oplevering: één aanspreekpunt, één team, één resultaat.'},
          {_key: 'iconText-4', _type: 'iconText', icon: 'materials', text: 'Duurzaamheid en efficiëntie zijn vanzelfsprekend. Wij gebruiken materialen en technieken die voldoen aan actuele eisen op het gebied van energie, isolatie en levensduur.'},
          {_key: 'iconText-5', _type: 'iconText', icon: 'shield', text: 'Met DRO Bouwgroep kiest u voor duidelijkheid, structuur en een uitvoering die klopt.'},
        ],
      },
      {
        _key: 'aboutTeamBlock-1',
        _type: 'aboutTeamBlock',
        teamEyebrow: 'Kernteam',
        teamTitle: 'De mensen die u spreekt.',
        coreTeam: [
          {
            _key: 'team-0',
            name: 'Therab',
            role: 'Eerste aanspreekpunt',
            image: {_type: 'cmsImage', externalImageUrl: '/therab-eerste-aanspreekpunt.jpg'},
            text: 'Kijkt met u mee vanaf het eerste contact en zorgt dat alles duidelijk blijft.',
          },
          {
            _key: 'team-1',
            name: 'Jarek',
            role: 'Hoofd uitvoering',
            image: {_type: 'cmsImage', externalImageUrl: '/jarek-hoofd-uitvoering.jpg'},
            text: 'Stuurt de uitvoering aan en zorgt dat alles loopt zoals afgesproken.',
          },
          {
            _key: 'team-2',
            name: 'Scott',
            role: 'Klantcontact & kantoor',
            image: {_type: 'cmsImage', externalImageUrl: '/scott-klantcontact.png'},
            text: 'Is dagelijks op kantoor, houdt klanten duidelijk op de hoogte van updates en neemt zijn oog voor interieur en afwerking mee in elk gesprek.',
          },
        ],
        teamBanner: 'U heeft contact met ons, wij regelen de rest.',
      },
      {
        _key: 'aboutTeamImageBlock-2',
        _type: 'aboutTeamImageBlock',
        teamImageEyebrow: 'Ons team',
        teamImageTitle: 'Vaste vakmensen, dagelijks samen aan het werk.',
        teamImage: {_type: 'cmsImage', externalImageUrl: '/dro-renovaties-team.jpg'},
      },
    ],
  },

  // ─── Werkwijze ────────────────────────────────────────────────────────────
  {
    _id: 'page-werkwijze',
    _type: 'page',
    title: 'Werkwijze',
    slug: {_type: 'slug', current: 'werkwijze'},
    contentBlocks: [
      {
        _key: 'processHeaderBlock-0',
        _type: 'processHeaderBlock',
        eyebrow: 'Werkwijze',
        titlePrefix: 'Zo werkt het als u met ons',
        titleHighlight: 'samenwerkt.',
        intro: 'U hoeft niks uit te zoeken.\nWij regelen het van begin tot eind.',
        note: 'Tijdens het traject nemen wij u indien mogelijk mee naar een lopend project, zodat u precies weet wat u kunt verwachten.',
        sideNote: 'U spreekt met de mensen die uw project ook echt uitvoeren.',
        steps: [
          {_key: 'step-0', icon: 'idea', title: 'Idee', text: 'U heeft een idee of wens. Wij denken direct met u mee.', note: 'Alles begint met uw idee'},
          {_key: 'step-1', icon: 'talk', title: 'Gesprek', text: 'We bespreken uw situatie en geven eerlijk advies.', note: 'Open en eerlijk advies'},
          {_key: 'step-2', icon: 'checklist', title: 'Plan', text: 'U ontvangt een duidelijk plan en een transparante offerte.', note: 'Duidelijk plan, geen verrassingen'},
          {_key: 'step-3', icon: 'tools', title: 'Uitvoering', text: 'Ons team voert het werk uit volgens planning en afspraak.', note: 'Vaste teams, strakke uitvoering'},
          {_key: 'step-4', icon: 'delivery', title: 'Oplevering', text: 'We leveren netjes op. Alles gecontroleerd en afgerond.', note: 'Oplevering met aandacht'},
        ],
      },
      {
        _key: 'processBenefitsBlock-1',
        _type: 'processBenefitsBlock',
        benefits: [
          {_key: 'iconText-0', _type: 'iconText', icon: 'contact', title: 'Eén aanspreekpunt'},
          {_key: 'iconText-1', _type: 'iconText', icon: 'planning', title: 'Duidelijke planning'},
          {_key: 'iconText-2', _type: 'iconText', icon: 'handshake', title: 'Korte communicatie'},
          {_key: 'iconText-3', _type: 'iconText', icon: 'shield', title: 'Geen verrassingen'},
          {_key: 'iconText-4', _type: 'iconText', icon: 'tools', title: 'Strak resultaat'},
        ],
      },
      {
        _key: 'processTrustBlock-2',
        _type: 'processTrustBlock',
        trustPoints: [
          {_key: 'iconText-0', _type: 'iconText', icon: 'checklist', title: 'VCA gecertificeerd', text: 'Onze monteurs zijn VCA gecertificeerd.'},
          {_key: 'iconText-1', _type: 'iconText', icon: 'shield', title: 'Goed verzekerd', text: 'Ons bedrijf beschikt over een CAR- en aansprakelijkheidsverzekering.'},
          {_key: 'iconText-2', _type: 'iconText', icon: 'quality', title: 'Verantwoord uitgevoerd', text: 'Zo weet u dat wij altijd kwalitatief en verantwoord werk leveren.'},
        ],
      },
      {
        _key: 'partnersBlock-3',
        _type: 'partnersBlock',
        eyebrow: 'Partners',
        title: 'Vaste partners voor materiaal, sanitair en keukens.',
        text: 'Wij werken met herkenbare leveranciers zodat keuzes, levertijden en kwaliteit beter te controleren zijn.',
      },
      {
        _key: 'processFaqBlock-4',
        _type: 'processFaqBlock',
        faqEyebrow: 'FAQ',
        faqTitle: 'U heeft nog vragen. Dat begrijpen we.',
        faqIntro: 'Een verbouwing is geen kleine beslissing. Daarom beantwoorden we hieronder de vragen die wij bijna altijd krijgen, kort en eerlijk.',
        faqs: faqRefs,
      },
      {
        _key: 'processIntakeBannerBlock-5',
        _type: 'processIntakeBannerBlock',
        intakeBannerTitle: 'Twijfelt u nog? Plan gewoon een intake.',
        intakeBannerText: 'Na één gesprek weet u direct of wij bij u passen.',
        buttonLabel: 'Start intake',
        buttonLink: internal('page-contact'),
      },
    ],
  },

  // ─── Zakelijk ─────────────────────────────────────────────────────────────
  {
    _id: 'page-zakelijk',
    _type: 'page',
    title: 'Zakelijk',
    slug: {_type: 'slug', current: 'zakelijk'},
    contentBlocks: [
      {
        _key: 'pageHeroBlock-0',
        _type: 'pageHeroBlock',
        hero: {
          backgroundImage: {
            _type: 'cmsImage',
            externalImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
          },
          eyebrow: 'Zakelijk',
          title: 'Een uitvoeringspartner voor projecten en volume.',
          text: 'Voor opdrachtgevers die capaciteit, structuur en betrouwbare uitvoering zoeken.',
          primaryLabel: 'Start intake',
          primaryLink: internal('page-contact'),
          secondaryLabel: 'Bespreek uw project met ons',
          secondaryLink: external('tel:+31850871814'),
        },
      },
      {
        _key: 'businessContentBlock-1',
        _type: 'businessContentBlock',
        positionEyebrow: 'Positionering',
        positionTitle: 'Wij functioneren als verlengstuk van uw organisatie.',
        positionText: 'We nemen uitvoering, coördinatie en bezetting onder één verantwoordelijkheid. Daardoor blijft het traject helder voor u en representatief richting uw klant.',
        positionBanner: 'Eén partij. Volledige uitvoering. Volledige controle.',
        capacity: ['Meerdere projecten tegelijk', 'Opschalen mogelijk', 'Vaste teams', 'Gestructureerde uitvoering'],
        cards: [
          {
            _key: 'card-0',
            eyebrow: 'Afbouw / capability',
            title: 'Complete afbouw onder één verantwoordelijkheid.',
            items: ['Metselwerk', 'Tegelwerk', 'Wanden en plafonds', 'Afwerking', 'Timmerwerk'],
          },
          {
            _key: 'card-1',
            eyebrow: 'Geschikt voor',
            title: 'Herhaalbare projecten en uitvoering op schaal.',
            items: ['Projectmatige renovaties', 'Seriematige afbouw', 'Mutatiewoningen', 'Schaalbare processen'],
          },
        ],
      },
      {
        _key: 'ctaBannerBlock-2',
        _type: 'ctaBannerBlock',
        cta: {
          eyebrow: 'Start vandaag',
          title: 'Plan een kennismaking',
          text: 'Bespreek uw project, volume en gewenste uitvoering met ons.',
          buttons: [
            btn('btn-intake', 'Start intake', external('/contact'),          'primary'),
            btn('btn-call',   'Bel direct',   external('tel:+31850871814'), 'outlined'),
          ],
        },
      },
    ],
  },
]

async function main() {
  for (const page of pages) {
    await upsertById(page)
  }
  console.log(`\n✅ Done — ${pages.length} pages seeded.`)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
