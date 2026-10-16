import {documentSchemaTypes} from './documents'
import {objectSchemaTypes} from './objects'

export const schemaTypes = [...objectSchemaTypes, ...documentSchemaTypes]

// Aanvragen (persoonsgegevens) staan in de private dataset "leads" en horen
// niet meer in de publieke Studio-workspace op "production": zo kan daar ook
// niets nieuws als aanvraag worden aangemaakt of bewerkt.
export const productionSchemaTypes = schemaTypes.filter((type) => type.name !== 'formSubmission')

// Workspace "Aanvragen": alleen de aanvraag zelf, plus de typen waar een
// legacy-aanvraag naar verwijst (intakeForm en faq), zodat de weergave niet
// op onbekende typen stukloopt. Die typen zijn niet aanmaakbaar in deze workspace.
const leadsTypeNames = new Set(['formSubmission', 'intakeForm', 'faq'])
export const leadsSchemaTypes = schemaTypes.filter((type) => leadsTypeNames.has(type.name))
