import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {media} from 'sanity-plugin-media'

import {
  isSingletonSchemaType,
  singletonSchemaTypes,
  structure,
} from '@/sanity/desk/structure'
import {leadsStructure} from '@/sanity/leads/structure'
import {leadsSchemaTypes, productionSchemaTypes} from '@/sanity/schemaTypes'
import {dashboardPlugin} from '@/sanity/plugins/dashboard'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cwblo9lu'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const homePageActions = new Set(['publish', 'discardChanges'])

function normalizeDocumentId(documentId: string | undefined) {
  return documentId?.replace(/^drafts\./, '')
}

function isHomepageDocument(schemaType: string, documentId: string | undefined) {
  return schemaType === 'page' && normalizeDocumentId(documentId) === 'home'
}

const productionWorkspace = defineConfig({
  name: 'default',
  title: 'DRO Renovaties',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    dashboardPlugin(),
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
        },
      },
    }),
    media(),
  ],
  document: {
    actions: (prev, context) => {
      if (isHomepageDocument(context.schemaType, context.documentId)) {
        return prev.filter((action) => action.action && homePageActions.has(action.action))
      }

      if (isSingletonSchemaType(context.schemaType)) {
        return prev.filter((action) => action.action && singletonActions.has(action.action))
      }

      return prev
    },
    newDocumentOptions: (prev, context) => {
      if (context.creationContext.type !== 'global') {
        return prev
      }

      return prev.filter(
        (templateItem) =>
          !singletonSchemaTypes.some((schemaType) => schemaType === templateItem.templateId),
      )
    },
  },
  schema: {
    types: productionSchemaTypes,
  },
})

// Aanvragen bevatten persoonsgegevens en staan in de private dataset "leads".
// Vaste project/dataset (geen env-terugval), inloggen via de Studio-gebruiker:
// er komt geen token in de browser. Aanmaken van documenten is hier uit; de
// aanvragen komen via /api/submit-request binnen.
const leadsWorkspace = defineConfig({
  name: 'aanvragen',
  title: 'Aanvragen',
  projectId: 'cwblo9lu',
  dataset: 'leads',
  basePath: '/studio-aanvragen',
  plugins: [structureTool({structure: leadsStructure})],
  document: {
    newDocumentOptions: () => [],
  },
  schema: {
    types: leadsSchemaTypes,
    // Geen templates: ook via een directe URL (?template=formSubmission) kan hier
    // dan geen nieuwe aanvraag worden gestart.
    templates: () => [],
  },
})

export default [productionWorkspace, leadsWorkspace]
