import { Literal, Optional, Record, String, Union } from 'runtypes';
import type { Static } from 'runtypes';

import { MessageStates } from '@vscodegraphiql/message-states';

export const SetSchemaMessageNoConnection = Record({
  command: Literal(MessageStates.EXPLORE_SCHEMA),
  payload: Record({
    schema: String,
  }),
});
export type SetSchemaMessageNoConnectionKind = Static<
  typeof SetSchemaMessageNoConnection
>;

export const SetSchemaMessageWithHostConnection = SetSchemaMessageNoConnection.extend(
  {
    payload: SetSchemaMessageNoConnection.fields.payload.extend({
      connection: Optional(
        Record({
          host: String,
          token: Optional(String),
        })
      ),
    }),
  }
);
export type SetSchemaMessageWithHostConnectionKind = Static<
  typeof SetSchemaMessageWithHostConnection
>;

export const SetSchemaMessage = Union(
  SetSchemaMessageNoConnection,
  SetSchemaMessageWithHostConnection
);

export type SetSchemaMessageKind = Static<typeof SetSchemaMessage>;
