import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import type { Editor } from 'codemirror';
import { GraphiQL } from 'graphiql';
import type { GraphiQLProps } from 'graphiql';
import { buildSchema, parse } from 'graphql';
import GraphiQLExplorer from 'graphiql-explorer';
import 'graphiql/graphiql.min.css';
import 'graphiql-with-extensions/graphiqlWithExtensions.css';

import { ConnectionConfigPanel } from '../ConnectionConfig';
import type { ConnectionConfigFormData } from '../ConnectionConfig';
import { NoSchemaError } from '../NoSchemaError';

import { useFetch } from './useFetch';
import styles from './GraphiQLApp.module.css';

const isGraphiQL = (thing: GraphiQL | null): thing is GraphiQL => {
  return thing instanceof GraphiQL;
};

type GraphiQLAppProps = Omit<GraphiQLProps, 'schema' | 'fetcher'> & {
  disableExplorer?: boolean;
  disableConnectionEditor?: boolean;
  schema: string;
  host?: string;
  token?: string;
  onSaveConnectionClick: (connection: {
    host: string;
    token?: string;
  }) => Promise<void>;
};
type GraphiQLAppState = {
  docExplorerOpen?: boolean;
  explorerIsOpen?: boolean;
  connectionConfigIsOpen?: boolean;
};

export const GraphiQLApp = ({
  schema,
  host,
  token,
  query,
  variables,
  disableExplorer,
  disableConnectionEditor,
  shouldPersistHeaders,
  onEditHeaders,
  onEditOperationName,
  onEditQuery,
  onEditVariables,
  onSaveConnectionClick,
}: GraphiQLAppProps) => {
  const [state, setState] = useState<GraphiQLAppState>({
    docExplorerOpen: false,
    explorerIsOpen: true,
    connectionConfigIsOpen: false,
  });

  const GqlSchema = useMemo(() => {
    if (!schema) return;
    return buildSchema(schema);
  }, [schema]);

  const fetcher = useFetch({
    token,
    url: host,
  });

  const isReady = !!schema && !!fetcher;

  const handleInspectOperation = useCallback(
    (instance: Editor, mousePos: { line: number; ch: number }): void => {
      let parsedQuery;

      try {
        parsedQuery = parse(query || '');
      } catch (error) {
        console.error('Error parsing query: ', error);
        return;
      }

      if (!parsedQuery) {
        console.error("Couldn't parse query document");
        return;
      }

      const token = instance.getTokenAt(mousePos);
      const start = { line: mousePos.line, ch: token.start };
      const end = { line: mousePos.line, ch: token.end };
      const relevantMousePos = {
        start: instance.indexFromPos(start),
        end: instance.indexFromPos(end),
      };

      const position = relevantMousePos;

      const def = parsedQuery.definitions.find((definition) => {
        if (!definition.loc) {
          console.warn('Missing location information for definition');
          return false;
        }

        const { start, end } = definition.loc;
        return start <= position.start && end >= position.end;
      });

      if (!def) {
        console.error(
          'Unable to find definition corresponding to mouse position'
        );
        return;
      }

      const operationKind =
        def.kind === 'OperationDefinition'
          ? def.operation
          : def.kind === 'FragmentDefinition'
          ? 'fragment'
          : 'unknown';

      const operationName =
        def.kind === 'OperationDefinition' && !!def.name
          ? def.name.value
          : def.kind === 'FragmentDefinition' && !!def.name
          ? def.name.value
          : 'unknown';

      const selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

      const el = document.querySelector(selector);
      el && el.scrollIntoView();
    },
    [query]
  );

  const graphiQLRef = useRef<GraphiQL>(null);
  const withGraphiQL = () => {
    if (!isGraphiQL(graphiQLRef.current)) throw new Error('Not a GRAPHIQL');
    return graphiQLRef.current;
  };

  useEffect(() => {
    if (!graphiQLRef.current) return;
    const graphiql = graphiQLRef.current;

    const editor = graphiql.getQueryEditor() as Editor;
    if (!editor) return;

    editor.setOption(
      'extraKeys',
      Object.assign({}, editor.getOption('extraKeys'), {
        'Shift-Alt-LeftClick': handleInspectOperation,
      })
    );
  }, [handleInspectOperation]);

  const handlePrettifyClick = () => {
    withGraphiQL().handlePrettifyQuery();
  };

  const handleToggleHistoryClick = () => {
    withGraphiQL().handleToggleHistory();
  };

  const handleEditQuery = (query?: string) => {
    if (typeof onEditQuery === 'function') onEditQuery(query);
  };

  const handleToggleExplorer = () => {
    setState({ ...state, explorerIsOpen: !state.explorerIsOpen });
  };

  const handleToggleConnectionConfig = () => {
    setState({
      ...state,
      connectionConfigIsOpen: !state.connectionConfigIsOpen,
    });
  };
  const handleSaveConnectionConfig = async (data: ConnectionConfigFormData) => {
    await onSaveConnectionClick({ host: data.uri, token: data.token });
    setState({
      ...state,
      connectionConfigIsOpen: false,
    });
  };

  return (
    <div className={classNames(styles.block)}>
      {!isReady || disableExplorer ? null : (
        <div className={classNames(styles.explorer)}>
          <GraphiQLExplorer
            schema={GqlSchema}
            query={query}
            onEdit={handleEditQuery}
            explorerIsOpen={state.explorerIsOpen}
            onToggleExplorer={handleToggleExplorer}
          />
        </div>
      )}
      {!schema || disableConnectionEditor ? null : (
        <ConnectionConfigPanel
          onSave={handleSaveConnectionConfig}
          canClose={!!fetcher}
          isOpen={!fetcher || state.connectionConfigIsOpen}
          onCloseClick={handleToggleConnectionConfig}
        />
      )}
      {schema ? null : <NoSchemaError />}
      {!isReady ? null : (
        <GraphiQL
          ref={graphiQLRef}
          fetcher={fetcher}
          schema={GqlSchema}
          query={query}
          variables={variables}
          onEditQuery={handleEditQuery}
          onEditVariables={onEditVariables}
          onEditOperationName={onEditOperationName}
          shouldPersistHeaders={shouldPersistHeaders}
          docExplorerOpen={state.docExplorerOpen}
          onEditHeaders={onEditHeaders}
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              onClick={handlePrettifyClick}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={handleToggleHistoryClick}
              label="History"
              title="Show History"
            />
            <GraphiQL.Button
              onClick={handleToggleConnectionConfig}
              label="Connection"
              title="Show Connection Config"
            />
            {disableExplorer ? null : (
              <GraphiQL.Button
                onClick={handleToggleExplorer}
                label="Explorer"
                title="Toggle Explorer"
              />
            )}
          </GraphiQL.Toolbar>
        </GraphiQL>
      )}
    </div>
  );
};
