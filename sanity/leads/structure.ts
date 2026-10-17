import {EnvelopeIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

// Workspace "Aanvragen" toont uitsluitend de aanvragen.
export const leadsStructure: StructureResolver = (S) =>
  S.list()
    .title('Aanvragen')
    .items([S.documentTypeListItem('formSubmission').title('Aanvragen').icon(EnvelopeIcon)])
