import {documentSchemaTypes} from './documents'
import {objectSchemaTypes} from './objects'

export const schemaTypes = [...objectSchemaTypes, ...documentSchemaTypes]
