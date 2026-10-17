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

// De verwijzing van een legacy-aanvraag (intakeFormRef) wijst naar een
// intakeForm in "production". In de dataset "leads" bestaat dat document niet,
// dus de Studio zou hier alleen "Document unavailable" tonen. In deze workspace
// verbergen we het veld (de waarde blijft ongewijzigd in het document staan).
export const leadsSchemaTypes = schemaTypes
  .filter((type) => leadsTypeNames.has(type.name))
  .map((type) => {
    if (type.name !== 'formSubmission' || !('fields' in type) || !Array.isArray(type.fields)) return type
    return {
      ...type,
      fields: type.fields.map((field) =>
        field.name === 'intakeFormRef' ? {...field, hidden: true} : field,
      ),
    } as typeof type
  })
