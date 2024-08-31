import * as vscode from 'vscode';
import {
    activeEditor,
    getUserSelectedText,
    getUserSelection,
    openFileInNewEditor,
    replaceSelectionInEditor,
    triggerFormatDocument,
} from './editor-utils';
import { writeFileAtPath } from './file-utils';
import { dirname } from 'path';

async function askForTypescriptName(initialEditor: vscode.TextEditor): Promise<string> {
    if (!initialEditor.selection) {
        throw new Error('No active selection. Exiting...');
    }

    // ask user for a name for new component
    let typescriptFileName = await vscode.window.showInputBox({
        placeHolder: 'Type the new typescript file name (.ts is optional)',
        validateInput: (userValue): string | undefined => {
            if (!userValue) {
                return 'Typescript file name required';
            }

            if (userValue.endsWith('.')) {
                return 'Typescript file name shouldnt end with .';
            }
        },
    });
    if (!typescriptFileName) {
        throw new Error('No Typescript file name provided. Exiting...');
    }

    if (!typescriptFileName.toLowerCase().endsWith('.ts')) {
        typescriptFileName += '.ts';
    }

    return typescriptFileName;
}

async function createNewTypescriptFileAndOpen(
    targetFileFolder: string,
    targetFileName: string,
    targetFileContent: string
): Promise<void> {
    vscode.window.showInformationMessage('Creating new typescript file...');

    // write a new template file with the selection
    const newPath = `${targetFileFolder}/${targetFileName}`;
    await writeFileAtPath(newPath, targetFileContent);
    await openFileInNewEditor(newPath);
    await triggerFormatDocument();
}

async function extractTypescriptMain(): Promise<void> {
    try {
        const initialEditor = activeEditor();
        const initialSelection = getUserSelection();
        const selectedTemplateText = getUserSelectedText();
        const initialEditorFilePath = initialEditor.document.fileName;
        const initialEditorFileFolder = dirname(initialEditorFilePath);

        const newTypescriptFileName: string = await askForTypescriptName(initialEditor);

        // remove selection from the original file
        await replaceSelectionInEditor(initialEditor, initialSelection, '');
        // reformat the original file now content was removed
        await triggerFormatDocument();

        await createNewTypescriptFileAndOpen(
            initialEditorFileFolder,
            newTypescriptFileName,
            selectedTemplateText
        );

        vscode.window.showInformationMessage(
            'Finished creating new typescript file with selected content. Exiting...'
        );
    } catch (err) {
        vscode.window.showInformationMessage(`Error whilst extracting typescript: ${err}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    let extractToComponentCommand = vscode.commands.registerCommand(
        'elltg-right-click-to-extract-typescript.extractTypescript',
        async () => {
            extractTypescriptMain();
        }
    );
    context.subscriptions.push(extractToComponentCommand);
}

export function deactivate() {}
