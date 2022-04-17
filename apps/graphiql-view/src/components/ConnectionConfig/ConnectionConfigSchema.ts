import { object, number, string } from 'yup';
import type { SchemaOf, TypeOf } from 'yup';

export const ConnectionConfigSchema = object({
  uri: string().required(),
  token: string(),
}).required();

export type ConnectionConfigSchemaKind = SchemaOf<
  typeof ConnectionConfigSchema
>;
export type ConnectionConfigFormData = TypeOf<typeof ConnectionConfigSchema>;
