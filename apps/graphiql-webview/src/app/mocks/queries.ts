import { buildSchema } from 'graphql';
import { addResolversToSchema } from '@graphql-tools/schema';
import { mockServer } from '@graphql-tools/mock';
import { schema } from './schema';

const MockedSchema = addResolversToSchema(buildSchema(schema));

export const server = mockServer(MockedSchema, {});
