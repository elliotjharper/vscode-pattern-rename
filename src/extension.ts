import * as vscode from 'vscode';
import {
    focusEditor,
    openFileInNewEditor,
    replaceSelectionInEditor,
    triggerFormatDocument,
} from './editor-utils';
import { writeFileAtPath } from './file-utils';
import { dirname } from 'path';
import { findNodeInSourceAtPosition } from './parser/node-matching';
import { askForTypescriptName, askIsNameCorrect } from './user-prompts';
import { camelToKebabCase } from './string.utils';
import { ActiveEditorHelper } from './active-editor-helper';
import { createNewTypescriptFileAndOpen } from './typescript-generation';

async function extractRawSelection(): Promise<void> {
    try {
        const initialEditorHelper = new ActiveEditorHelper();
        const initialSelection = initialEditorHelper.getUserSelection();
        const initialSelectionStart = initialEditorHelper.getUserSelectionStartPosition();
        const selectedTemplateText = initialEditorHelper.getUserSelectedText();
        const initialEditorFilePath = initialEditorHelper.document.fileName;
        const initialEditorFileFolder = dirname(initialEditorFilePath);

        // prompt for new .ts file name
        const newTypescriptFileName: string = await askForTypescriptName();

        // remove selection from the original file
        await replaceSelectionInEditor(initialEditorHelper.editor, initialSelection, '');

        // reformat the original file now content was removed
        await triggerFormatDocument(initialEditorHelper.editor);

        // create the new file using the users selectoutput from the located declaration
        const newFileEditor = await createNewTypescriptFileAndOpen(
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

async function extractClosestNode(): Promise<void> {
    try {
        const initialEditorHelper = new ActiveEditorHelper();
        const initialSelectionStart = initialEditorHelper.getUserSelectionStartPosition();
        const initialEditorFilePath = initialEditorHelper.document.fileName;
        const initialEditorFileFolder = dirname(initialEditorFilePath);
        const sourceFileText = initialEditorHelper.document.getText();

        const matchingNode = findNodeInSourceAtPosition(sourceFileText, initialSelectionStart);

        // prompt if the located declaration was correct
        const functionName = matchingNode.name.escapedText.toString();
        if (!(await askIsNameCorrect(functionName))) {
            return;
        }

        // create file name based off located declaration
        const newTypescriptFileName = `${camelToKebabCase(functionName)}.ts`;

        // remove selection from the original file but using the positions from the AST node
        const nodeRange = initialEditorHelper.getRangeForNode(matchingNode);
        await replaceSelectionInEditor(initialEditorHelper.editor, nodeRange, '');

        // reformat the original file now content was removed
        await triggerFormatDocument(initialEditorHelper.editor);

        // create the new file using the output from the located declaration
        // TODO: mutate the declaration to force it to become an exported function
        const fullFunction = matchingNode.getFullText();
        const newFileEditor = await createNewTypescriptFileAndOpen(
            initialEditorFileFolder,
            newTypescriptFileName,
            fullFunction
        );

        vscode.window.showInformationMessage(
            'Finished creating new typescript file with selected content. Exiting...'
        );
    } catch (err) {
        vscode.window.showInformationMessage(`Error whilst extracting typescript: ${err}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    let extractRawCommand = vscode.commands.registerCommand(
        'elltg-right-click-to-extract-typescript.extractRawSelection',
        async (uri: vscode.Uri) => {
            extractRawSelection();
        }
    );
    context.subscriptions.push(extractRawCommand);

    let extractClosestCommand = vscode.commands.registerCommand(
        'elltg-right-click-to-extract-typescript.extractClosestNode',
        async (uri: vscode.Uri) => {
            extractClosestNode();
        }
    );
    context.subscriptions.push(extractClosestCommand);
}

export function deactivate() {}
