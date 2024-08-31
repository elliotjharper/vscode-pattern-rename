import * as vscode from 'vscode';

export function getWorkspaceRootPath(): string {
    const workspaceRootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceRootPath) {
        throw new Error('Could not determine workspace folder. Exiting...');
    }

    return workspaceRootPath;
}

export async function askForTargetFolder(): Promise<string> {
    // ask user for folder to create the component under
    const folderSelection = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
    });

    const targetFolder = folderSelection?.[0]?.fsPath;

    if (!targetFolder) {
        throw new Error('No targetFolder provided. Exiting...');
    }

    const selectedFolderWithinWorkspace = targetFolder.includes(getWorkspaceRootPath());
    if (!selectedFolderWithinWorkspace) {
        throw new Error(
            'Selected folder was not within the workspace. Seems like a bad selection? Aborting for safety! Exiting...'
        );
    }

    return targetFolder;
}
