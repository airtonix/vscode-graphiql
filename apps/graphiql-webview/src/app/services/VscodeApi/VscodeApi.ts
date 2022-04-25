import type { WebviewApi } from 'vscode-webview';

export class VscodeApi<TState> implements WebviewApi<TState> {
  private _api!: WebviewApi<TState>;

  private get api() {
    if (!this._api) {
      this._api = acquireVsCodeApi();
    }
    return this._api;
  }

  constructor(private state: TState) {}

  postMessage(message: unknown): void {
    this.api.postMessage(message);
  }

  onMessage(callback: (message: any) => void): () => void {
    window.addEventListener('message', callback);
    return () => window.removeEventListener('message', callback);
  }

  getState(): TState | undefined {
    return {
      ...this.state,
      ...this.api.getState(),
    };
  }

  setState<TNewState extends TState | undefined>(
    newState: Partial<TNewState>
  ): TNewState {
    const state = { ...this.state, ...newState } as TNewState;
    this.api.setState(state);
    return state;
  }
}

export const vscode = new VscodeApi({
  schema: '',
  query: '',
  connection: {
    host: '',
    token: '',
  },
});
