import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {media} from 'sanity-plugin-media'

import {
  isSingletonSchemaType,
  singletonSchemaTypes,
  structure,
} from '@/sanity/desk/structure'
import {schemaTypes} from '@/sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lxi5ttc2'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const homePageActions = new Set(['publish', 'discardChanges'])

function normalizeDocumentId(documentId: string | undefined) {
  return documentId?.replace(/^drafts\./, '')
}

function isHomepageDocument(schemaType: string, documentId: string | undefined) {
  return schemaType === 'page' && normalizeDocumentId(documentId) === 'home'
}

export default defineConfig({
  name: 'default',
  title: 'DRO Renovaties',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
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
    types: schemaTypes,
  },
})
