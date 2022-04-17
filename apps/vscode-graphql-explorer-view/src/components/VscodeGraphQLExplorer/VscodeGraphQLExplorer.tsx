import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import classNames from 'classnames';
import GraphiQL from 'graphiql';
import { parse } from 'graphql';
//@ts-ignore
import GraphiQLExplorer from 'graphiql-explorer';
import 'graphiql/graphiql.min.css';
import 'graphiql-with-extensions/graphiqlWithExtensions.css';

import { ConnectionConfigPanel } from '../ConnectionConfig';
import type { ConnectionConfigFormData } from '../ConnectionConfig';
import { NoSchemaError } from '../NoSchemaError';

import { useSchema } from './useSchema';
import { useFetch } from './useFetch';
import styles from './VscodeGraphQLExplorer.module.css';

const isGraphiQL = (thing: GraphiQL | null): thing is GraphiQL => {
  return thing instanceof GraphiQL;
};

type VscodeGraphQLExplorerProps = Omit<
  ComponentProps<typeof GraphiQL>,
  'schema' | 'fetcher'
> & {
  disableExplorer?: boolean;
  disableConnectionEditor?: boolean;
  schema: string;
};

type VscodeGraphQLExplorerState = {
  query?: string;
  disableExplorer?: boolean;
  explorerIsOpen?: boolean;
  codeExporterIsOpen?: boolean;
  connectionConfigIsOpen?: boolean;
  connectionToken?: string;
  connectionUrl?: string;
};

export const VscodeGraphQLExplorer = ({
  schema,
  defaultQuery,
  disableExplorer,
  disableConnectionEditor,
  onEditOperationName,
  onEditQuery,
  onEditVariables,
}: VscodeGraphQLExplorerProps) => {
  const [state, setState] = useState<VscodeGraphQLExplorerState>({
    query: defaultQuery,
    disableExplorer,
    explorerIsOpen: true,
    codeExporterIsOpen: false,
    connectionConfigIsOpen: false,
  });
  const GqlSchema = useSchema(schema);
  const fetcher = useFetch({
    token: state.connectionToken,
    url: state.connectionUrl,
  });

  const isReady = !!schema && !!fetcher;

  const handleInspectOperation = useCallback(
    (cm: any, mousePos: { line: Number; ch: Number }) => {
      let parsedQuery;
      try {
        parsedQuery = parse(state.query || '');
      } catch (error) {
        console.error('Error parsing query: ', error);
        return;
      }
      if (!parsedQuery) {
        console.error("Couldn't parse query document");
        return null;
      }

      var token = cm.getTokenAt(mousePos);
      var start = { line: mousePos.line, ch: token.start };
      var end = { line: mousePos.line, ch: token.end };
      var relevantMousePos = {
        start: cm.indexFromPos(start),
        end: cm.indexFromPos(end),
      };

      var position = relevantMousePos;

      var def = parsedQuery.definitions.find((definition) => {
        if (!definition.loc) {
          console.log('Missing location information for definition');
          return false;
        }

        const { start, end } = definition.loc;
        return start <= position.start && end >= position.end;
      });

      if (!def) {
        console.error(
          'Unable to find definition corresponding to mouse position'
        );
        return null;
      }

      var operationKind =
        def.kind === 'OperationDefinition'
          ? def.operation
          : def.kind === 'FragmentDefinition'
          ? 'fragment'
          : 'unknown';

      var operationName =
        def.kind === 'OperationDefinition' && !!def.name
          ? def.name.value
          : def.kind === 'FragmentDefinition' && !!def.name
          ? def.name.value
          : 'unknown';

      var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

      var el = document.querySelector(selector);
      el && el.scrollIntoView();
    },
    []
  );

  const graphiQLRef = useRef<GraphiQL>(null);
  const withGraphiQL = () => {
    if (!isGraphiQL(graphiQLRef.current)) throw new Error('Not a GRAPHIQL');
    return graphiQLRef.current;
  };

  useEffect(() => {
    if (!graphiQLRef.current) return;
    const graphiql = graphiQLRef.current;

    const editor = graphiql.getQueryEditor();
    if (!editor) return;

    editor.setOption('extraKeys', {
      ...(editor.options.extraKeys || {}),
      'Shift-Alt-LeftClick': handleInspectOperation,
    });
  }, [graphiQLRef.current]);

  const handlePrettifyClick = () => {
    withGraphiQL().handlePrettifyQuery();
  };

  const handleToggleHistoryClick = () => {
    withGraphiQL().handleToggleHistory();
  };

  const handleEditQuery = (query?: string) => {
    setState({ ...state, query });
    if (typeof onEditQuery === 'function') onEditQuery(query);
  };

  const handleToggleExplorer = () => {
    setState({ ...state, explorerIsOpen: !state.explorerIsOpen });
  };

  const handleToggleCodeExporter = () => {
    setState({
      ...state,
      codeExporterIsOpen: !state.codeExporterIsOpen,
    });
  };
  const handleToggleConnectionConfig = () => {
    setState({
      ...state,
      connectionConfigIsOpen: !state.connectionConfigIsOpen,
    });
  };
  const handleSaveConnectionConfig = (data: ConnectionConfigFormData) => {
    setState({
      ...state,
      connectionToken: data.token,
      connectionUrl: data.uri,
      connectionConfigIsOpen: false,
    });
  };

  return (
    <div className={classNames(styles.block)}>
      {!isReady || disableExplorer ? null : (
        <div className={classNames(styles.explorer)}>
          <GraphiQLExplorer
            schema={GqlSchema}
            query={state.query}
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
      {!!schema ? null : <NoSchemaError />}
      {!isReady ? null : (
        <GraphiQL
          ref={graphiQLRef}
          fetcher={fetcher}
          schema={GqlSchema}
          query={state.query}
          onEditQuery={handleEditQuery}
          onEditVariables={onEditVariables}
          onEditOperationName={onEditOperationName}
          shouldPersistHeaders={true}
          docExplorerOpen={true}
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
