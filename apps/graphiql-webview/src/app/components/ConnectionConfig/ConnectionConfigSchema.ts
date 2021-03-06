import { object, string } from 'yup';
import type { InferType, SchemaOf } from 'yup';

export const ConnectionConfigSchema = object({
  uri: string().required(),
  token: string(),
}).required();

export type ConnectionConfigSchemaKind = SchemaOf<
  typeof ConnectionConfigSchema
>;
export type ConnectionConfigFormData = InferType<typeof ConnectionConfigSchema>;
