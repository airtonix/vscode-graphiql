import React, { useEffect, useState } from 'react';

import { MessageStates } from '@vscodegraphiql/message-states';
import * as types from '@vscodegraphiql/message-types';

import './App.css';
import { GraphiQLApp } from './components/GraphiQLApp';
import { vscode } from './services/VscodeApi';

type SetSchemaMessageKindPayload = types.SetSchemaMessageKind['payload'];

const App = () => {
  const [state, setState] = useState<SetSchemaMessageKindPayload>({
    schema: '',
    connection: {
      host: '',
      token: '',
    },
  });

  useEffect(() => {
    if (!window) return;
    window.addEventListener(
      'message',
      ({ data, origin }) => {
        if (!origin.startsWith('vscode-webview://')) return;
        const { command, payload } = data;
        if (!command) return;

        if (types.SetSchemaMessage.guard(data)) {
          setState({
            ...state,
            ...data.payload,
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
        }}
      />
    </div>
  );
};

export default App;
