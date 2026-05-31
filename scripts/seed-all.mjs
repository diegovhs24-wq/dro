/**
 * Master seed script — runs every seed file in dependency order.
 *
 * Execution order (each step waits for the previous to finish):
 *   1. seed-faqs          — standalone FAQ documents (no deps)
 *   2. seed-intake-form   — intake form + its own post-submission FAQs (refs FAQs)
 *   3. seed-services      — service documents with page content (no page deps)
 *   4. seed-projects      — project documents (no deps)
 *   5. seed-index-pages   — servicesIndex + projectsIndex singletons (no deps)
 *   6. seed-pages         — all page documents (refs FAQs, intake form, services)
 *   7. seed-site-settings — global nav/footer (refs services + pages)
 */

import {execFileSync} from 'child_process'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const steps = [
  {name: 'FAQs',          file: 'seed-faqs.mjs'},
  {name: 'Intake form',   file: 'seed-intake-form.mjs'},
  {name: 'Services',      file: 'seed-services.mjs'},
  {name: 'Projects',      file: 'seed-projects.mjs'},
  {name: 'Index pages',   file: 'seed-index-pages.mjs'},
  {name: 'Pages',         file: 'seed-pages.mjs'},
  {name: 'Site settings', file: 'seed-site-settings.mjs'},
]

const total = steps.length

for (let i = 0; i < steps.length; i++) {
  const {name, file} = steps[i]
  const label = `[${i + 1}/${total}] ${name}`

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`▶  ${label}`)
  console.log('─'.repeat(50))

  try {
    execFileSync(process.execPath, [resolve(__dirname, file)], {
      stdio: 'inherit',
      env: process.env,
    })
    console.log(`✅ ${label} — done`)
  } catch (err) {
    console.error(`\n❌ ${label} — FAILED`)
    console.error(err.message)
    process.exit(1)
  }
}

console.log(`\n${'═'.repeat(50)}`)
console.log(`✅ All ${total} seed steps completed successfully.`)
console.log('═'.repeat(50))
