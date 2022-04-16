import { buildSchema } from 'graphql';
import { useMemo } from 'react';

export const useSchema = (schema: string) => {
  return useMemo(() => {
    if (!schema) return;
    return buildSchema(schema);
  }, [schema]);
};
