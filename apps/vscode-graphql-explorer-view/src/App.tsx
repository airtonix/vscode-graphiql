import React, { useEffect, useState } from 'react';
import './App.css';
import { VscodeGraphQLExplorer } from './components/VscodeGraphQLExplorer';
import { MessageStates } from '@vscodegraphqlexplorer/lib-message-states';
import { SetSchemaMessage } from '@vscodegraphqlexplorer/lib-types';
import type { SetSchemaMessageKind } from '@vscodegraphqlexplorer/lib-types';
import { vscode } from './services/VscodeApi';

const App = () => {
  const [state, setState] = useState<SetSchemaMessageKind['payload']>({
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

        if (SetSchemaMessage.guard(data)) {
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
      <VscodeGraphQLExplorer
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
