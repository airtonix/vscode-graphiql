import * as fs from 'fs';
import { join } from 'path';
import { window, Uri, ViewColumn, ExtensionMode, workspace } from 'vscode';
import type { ExtensionContext, WebviewPanel, Disposable } from 'vscode';

import { MessageStates } from '@vscodegraphqlexplorer/lib-message-states';

import {
  SECRETS_STORAGEKEY_CONNECTION_HOST,
  SECRETS_STORAGEKEY_CONNECTION_TOKEN,
  WEBVIEW_RESOURCE_PATH,
} from './constants';

/**
 * Manages react webview panels
 */
export class ExploreSchemaWebview {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ExploreSchemaWebview | undefined;

  private static readonly viewType = 'react';

  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private assetPath: string;
  public static createOrShow(
    extensionPath: string,
    filePath: string,
    context: ExtensionContext
  ) {
    const { activeTextEditor } = window;
    const column = activeTextEditor ? activeTextEditor.viewColumn : undefined;
    const file = Uri.parse(filePath);

    // If we already have a panel, show it.
    // Otherwise, create a new panel.
    if (ExploreSchemaWebview.currentPanel) {
      ExploreSchemaWebview.currentPanel.reveal(column, file);
    } else {
      ExploreSchemaWebview.currentPanel = new ExploreSchemaWebview(
        extensionPath,
        file,
        column || ViewColumn.One,
        context
      );
    }
  }

  private constructor(
    public extensionPath: string,
    public filePath: Uri,
    public column: ViewColumn,
    public context: ExtensionContext
  ) {
    this.assetPath = join(this.extensionPath, WEBVIEW_RESOURCE_PATH);

    // Create and show a new webview panel
    this._panel = window.createWebviewPanel(
      ExploreSchemaWebview.viewType,
      'React',
      column,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restric the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [Uri.file(this.assetPath)],
      }
    );

    if (context.extensionMode === ExtensionMode.Development) {
      this._panel.webview.html = this.developmentHtml();
    } else {
      // Set the webview's initial html content
      this.getWebviewContent('index.html').then(
        (content) => (this._panel.webview.html = content)
      );
    }

    this.exploreSchema(filePath);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case MessageStates.ALERT:
            window.showErrorMessage(message.text);
            return;
          case MessageStates.SAVE_CONNECTION:
            this.saveConnection(message.data);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  reveal(column: ViewColumn | undefined, filePath: Uri) {
    this._panel.reveal(column);
    this.exploreSchema(filePath);
  }

  saveConnection({
    connection,
  }: {
    connection: { host: string; token: string };
  }) {
    this.context.secrets.store(
      SECRETS_STORAGEKEY_CONNECTION_HOST,
      connection.host
    );
    this.context.secrets.store(
      SECRETS_STORAGEKEY_CONNECTION_TOKEN,
      connection.token
    );
  }

  async exploreSchema(filePath: Uri) {
    this._panel.webview.postMessage({
      command: MessageStates.IS_LOADING,
    });

    const readData = await workspace.fs.readFile(filePath);
    const schema = Buffer.from(readData).toString('utf8');
    const host = await this.context.secrets.get('connectionHost');
    const token = await this.context.secrets.get('connectionToken');

    this._panel.webview.postMessage({
      command: MessageStates.EXPLORE_SCHEMA,
      payload: {
        schema,
        connection: {
          host,
          token,
        },
      },
    });
  }

  dispose() {
    ExploreSchemaWebview.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  getWebviewUri(filepath: string) {
    return this._panel.webview
      .asWebviewUri(Uri.file(join(this.extensionPath, 'dist', filepath)))
      .toString();
  }

  getWebviewContent = async (htmlFilepath: string) => {
    const html = await fs.promises.readFile(
      join(this.extensionPath, htmlFilepath),
      'utf-8'
    );

    // 1. Get all link prefixed by href or src
    const matchLinks = /(href|src)="([^"]*)"/g;

    // 2. Transform the result of the regex into a vscode's URI format
    // 3. Replace the all link from the index.html into a URI format
    return html.replace(
      matchLinks,
      (_, prefix: 'href' | 'src', link: string) => {
        // For
        if (link === '#') {
          return `${prefix}="${link}"`;
        }
        return `${prefix}="${this.getWebviewUri(link)}"`;
      }
    );
  };

  developmentHtml = () => `
  <!DOCTYPE html>
  <html lang="en">
    <head>

      <script type="module" src="http://localhost:3000/@vite/client"></script>
      <script type="module">
        import RefreshRuntime from "http://localhost:3000/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>

      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="http://localhost:3000/favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>

    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="http://localhost:3000/index.tsx"></script>
    </body>
  </html>`;
}
