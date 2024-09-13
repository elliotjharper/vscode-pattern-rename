import * as vscode from 'vscode';

export function getWorkspaceRootPath(): string {
    const workspaceRootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceRootPath) {
        throw new Error('Could not determine workspace folder. Exiting...');
    }

    return workspaceRootPath;
}
