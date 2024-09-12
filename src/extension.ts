import * as vscode from 'vscode';
import { keyPluck } from './array-pluck';
import { getExplorerSelectionFilesList } from './file-utils';
import { ViewHost } from './rename-view/host';
import { sortArray } from './sorting';

export function activate(context: vscode.ExtensionContext) {
    let extractRawCommand = vscode.commands.registerCommand(
        'elltg-pattern-rename.beginPatternRename',
        async (_: unknown, selections: vscode.Uri[]) => {
            let targetFiles = await getExplorerSelectionFilesList(selections);

            if (!targetFiles.length) {
                vscode.window.showInformationMessage('No files in selection.');
                return;
            }

            targetFiles = sortArray(targetFiles, keyPluck('fsPath'), true);
            const viewHost = new ViewHost(targetFiles);
        }
    );
    context.subscriptions.push(extractRawCommand);
}

export function deactivate() {}
