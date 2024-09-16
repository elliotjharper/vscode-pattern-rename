import * as vscode from 'vscode';
import { keyPluck } from '../src-shared/utils/array-pluck';
import { sortArray } from '../src-shared/utils/sorting';
import { getExplorerSelectionFilesList } from './utils/file';
import { isDarkMode } from './utils/window';
import { ViewHost } from './view-host/host';

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
            
            new ViewHost(targetFiles, isDarkMode());
        }
    );
    context.subscriptions.push(extractRawCommand);
}

export function deactivate() {}
