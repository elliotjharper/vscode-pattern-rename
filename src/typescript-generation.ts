import * as vscode from 'vscode';
import { openFileInNewEditor, triggerFormatDocument } from './editor-utils';
import { writeFileAtPath } from './file-utils';

export async function createNewTypescriptFileAndOpen(
    targetFileFolder: string,
    targetFileName: string,
    targetFileContent: string
): Promise<vscode.TextEditor> {
    vscode.window.showInformationMessage('Creating new typescript file...');

    // write a new template file with the selection
    const newPath = `${targetFileFolder}/${targetFileName}`;
    await writeFileAtPath(newPath, targetFileContent);

    const newEditor = await openFileInNewEditor(newPath);

    await triggerFormatDocument(newEditor);

    return newEditor;
}
