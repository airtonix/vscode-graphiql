import { Record, Literal, String } from 'runtypes';
import type { Static } from 'runtypes';
import { MessageStates } from '@vscodegraphqlexplorer/lib-message-states';

export const SetSchemaMessage = Record({
  command: Literal(MessageStates.EXPLORE_SCHEMA),
  payload: Record({
    schema: String,
    connection: Record({
      host: String,
      token: String,
    }),
  }),
});
export type SetSchemaMessageKind = Static<typeof SetSchemaMessage>;
