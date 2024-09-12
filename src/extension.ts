import * as vscode from 'vscode';
import { keyPluck } from './array-pluck';
import { getExplorerSelectionFilesList } from './file-utils';
import { ViewHost } from './rename-view/host';
import { sortArray } from './sorting';

// async function extractRawSelection(): Promise<void> {
//     try {
//         const initialEditorHelper = new ActiveEditorHelper();
//         const initialSelection = initialEditorHelper.getUserSelection();
//         const initialSelectionStart = initialEditorHelper.getUserSelectionStartPosition();
//         const selectedTemplateText = initialEditorHelper.getUserSelectedText();
//         const initialEditorFilePath = initialEditorHelper.document.fileName;
//         const initialEditorFileFolder = dirname(initialEditorFilePath);

//         // prompt for new .ts file name
//         const newTypescriptFileName: string = await askForTypescriptName();

//         // remove selection from the original file
//         await replaceSelectionInEditor(initialEditorHelper.editor, initialSelection, '');

//         // reformat the original file now content was removed
//         await triggerFormatDocument(initialEditorHelper.editor);

//         // create the new file using the users selectoutput from the located declaration
//         // const newFileEditor = await createNewTypescriptFileAndOpen(
//         //     initialEditorFileFolder,
//         //     newTypescriptFileName,
//         //     selectedTemplateText
//         // );

//         vscode.window.showInformationMessage(
//             'Finished creating new typescript file with selected content. Exiting...'
//         );
//     } catch (err) {
//         vscode.window.showInformationMessage(`Error whilst extracting typescript: ${err}`);
//     }
// }

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
