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

async function upsert(doc) {
  const existing = await client.fetch(`*[_type == $type][0]{ _id }`, {type: doc._type})
  if (existing?._id) {
    const id = existing._id.replace(/^drafts\./, '')
    const result = await client.patch(id).set(doc).commit({returnDocuments: true})
    console.log(`✅ Updated ${doc._type}:`, result._id)
  } else {
    const result = await client.create(doc)
    console.log(`✅ Created ${doc._type}:`, result._id)
  }
}

async function main() {
  await upsert({
    _type: 'servicesIndex',
    title: 'Our Services',
    contentBlocks: [],
    listingSettings: {
      layout: 'grid',
    },
  })

  await upsert({
    _type: 'projectsIndex',
    title: 'Our Projects',
    contentBlocks: [],
    listingSettings: {
      layout: 'grid',
    },
  })
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
