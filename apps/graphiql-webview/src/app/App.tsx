/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';

import { MessageStates } from '@vscodegraphiql/message-states';

import { GraphiQLApp } from './components/GraphiQLApp';
import { vscode } from './services/VscodeApi';
import { LoadingDots } from './components/LoadingDots';
import styles from './App.module.css';

const App = () => {
  const [state, setState] = useState({
    schema: '',
    query: '',
    variables: '',
    headers: '',
    connection: {
      host: '',
      token: '',
    },
    isLoading: true,
  });

  const handleMessage = useCallback(({ data, origin }) => {
    if (!origin.startsWith('vscode-webview://')) return;
    if (!data.command) return;

    if (data.payload) {
      setState({
        isLoading: false,
        ...data.payload,
      });
    }
  }, []);

  useEffect(() => {
    if (!window) return;
    window.addEventListener('message', handleMessage, false);

    if (state.isLoading) {
      vscode.postMessage({
        command: MessageStates.RESTORE_STATE,
      });
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage, state]);

  return (
    <div className={styles.block}>
      {!state.isLoading ? (
        <GraphiQLApp
          schema={state.schema}
          query={state.query}
          host={state.connection?.host}
          token={state.connection?.token}
          variables={state.variables}
          onEditHeaders={async (headers) => {
            vscode.postMessage({
              command: MessageStates.SAVE_STATE,
              payload: {
                ...state,
                headers,
              },
            });
            setState({ ...state, headers });
          }}
          onEditVariables={async (variables) => {
            vscode.postMessage({
              command: MessageStates.SAVE_STATE,
              payload: {
                ...state,
                variables,
              },
            });
            setState({ ...state, variables });
          }}
          onEditQuery={async (query) => {
            vscode.postMessage({
              command: MessageStates.SAVE_STATE,
              payload: {
                ...state,
                query,
              },
            });
            setState({ ...state, query: query || '' });
          }}
          onSaveConnectionClick={async (connection) => {
            vscode.postMessage({
              command: MessageStates.SAVE_CONNECTION,
              payload: connection,
            });
            setState({
              ...state,
              connection: {
                host: connection.host,
                token: connection.token || '',
              },
            });
          }}
        />
      ) : (
        <LoadingDots />
      )}
    </div>
  );
};

export default App;
