import { WebviewApi } from 'vscode-webview';

export let vsCodeApi: WebviewApi<unknown>;

export function initVsCodeApi(): void {
    vsCodeApi = acquireVsCodeApi();
}
