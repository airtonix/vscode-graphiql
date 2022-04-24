import React, { useEffect, useState } from 'react';

import { MessageStates } from '@vscodegraphiql/message-states';
import { SetSchemaMessageWithHostConnection } from '@vscodegraphiql/message-types';
import type { SetSchemaMessageWithHostConnectionKind } from '@vscodegraphiql/message-types';

import './App.css';
import { GraphiQLApp } from './components/GraphiQLApp';
import { vscode } from './services/VscodeApi';

type SetSchemaMessageWithHostConnectionKindPayload = SetSchemaMessageWithHostConnectionKind['payload'];

const App = () => {
  const [state, setState] = useState<SetSchemaMessageWithHostConnectionKindPayload>({
    schema: '',
  });

  useEffect(() => {
    if (!window) return;
    window.addEventListener(
      'message',
      ({ data, origin }) => {
        if (!origin.startsWith('vscode-webview://')) return;
        const { command, payload } = data;
        if (!command) return;
        const isSchemaMessage = SetSchemaMessageWithHostConnection.guard(data);

        if (isSchemaMessage) {
          setState({
            ...state,
            ...payload,
          });
        }
      },
      false
    );
  }, []);

  return (
    <div className="App">
      <GraphiQLApp
        schema={state.schema}
        host={state.connection?.host}
        token={state.connection?.token}
        onSaveConnectionClick={async (connection) => {
          vscode.postMessage({
            command: MessageStates.SAVE_CONNECTION,
            payload: connection,
          });
          setState({
            ...state,
            connection,
          });
        }}
      />
    </div>
  );
};

export default App;
