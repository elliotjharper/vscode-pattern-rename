import * as vscode from 'vscode';
import {
    activeEditor,
    getUserSelectedText,
    getUserSelection,
    getUserSelectionStartPosition,
    openFileInNewEditor,
    replaceSelectionInEditor,
    triggerFormatDocument,
} from './editor-utils';
import { writeFileAtPath } from './file-utils';
import { dirname } from 'path';
import { findNodeInSourceAtPosition } from './parser/node-matching';

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
        const initalDocument = initialEditor.document;
        const initialSelection = getUserSelection();
        const initialSelectionStart = getUserSelectionStartPosition();
        //const selectedTemplateText = getUserSelectedText();

        const initialEditorFilePath = initalDocument.fileName;
        const initialEditorFileFolder = dirname(initialEditorFilePath);

        const sourceFileText = initialEditor.document.getText();

        const matchingNode = findNodeInSourceAtPosition(sourceFileText, initialSelectionStart);

        throw new Error('jtyffjty');

        // TODO: prompt if the located declaration was correct

        // TODO: create file name based off located declaration

        // remove selection from the original file
        await replaceSelectionInEditor(initialEditor, initialSelection, '');

        // reformat the original file now content was removed
        await triggerFormatDocument();

        // TODO: create the new file using the output from the located declaration
        // TODO: mutate the declaration to force it to become an exported function
        // await createNewTypescriptFileAndOpen(
        //     initialEditorFileFolder,
        //     newTypescriptFileName,
        //     selectedTemplateText
        // );

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
        async (uri: vscode.Uri) => {
            extractTypescriptMain();
        }
    );
    context.subscriptions.push(extractToComponentCommand);
}

export function deactivate() {}
