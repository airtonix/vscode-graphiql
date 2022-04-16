import React, { useEffect, useState } from 'react';
import './App.css';
import { VscodeGraphQLExplorer } from './components/VscodeGraphQLExplorer';
import { MessageStates } from '@vscodegraphqlexplorer/lib-message-states';

const App = () => {
  const [schema, setSchema] = useState('');

  useEffect(() => {
    if (!window) return;
    window.addEventListener(
      'message',
      ({ data, origin }) => {
        if (!origin.startsWith('vscode-webview://')) return;
        const { command, payload } = data;
        if (!command) return;

        switch (command) {
          case MessageStates.EXPLORE_SCHEMA:
            setSchema(payload);
            break;

          case MessageStates.IS_LOADING:
            break;

          default:
            break;
        }
      },
      false
    );
  }, []);

  return (
    <div className="App">
      <VscodeGraphQLExplorer schema={schema} />
    </div>
  );
};

export default App;
