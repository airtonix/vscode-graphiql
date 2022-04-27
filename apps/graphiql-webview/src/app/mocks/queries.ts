import { buildSchema } from 'graphql';
import { addResolversToSchema } from '@graphql-tools/schema';
import { mockServer } from '@graphql-tools/mock';

import { schema } from './schema';
const executableSchema = buildSchema(schema);

const MockedSchema = addResolversToSchema(executableSchema);

export const server = mockServer(MockedSchema, {});
