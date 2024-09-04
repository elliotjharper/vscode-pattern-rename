import * as vscode from 'vscode';
import { NodeObject } from './parser/actual-types';

export function activeEditor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        throw new Error('No active editor. Exiting...');
    }

    return editor;
}

export async function focusEditor(targetEditor: vscode.TextEditor): Promise<void> {
    // try to focus the editor that we want to trigger formatDocument on
    await vscode.window.showTextDocument(targetEditor.document);
}

export async function triggerFormatDocument(targetEditor: vscode.TextEditor): Promise<void> {
    await focusEditor(targetEditor);

    // this command will just run on whatever is the currently focused editor so you must focus it first
    await vscode.commands.executeCommand('editor.action.formatDocument');
}

export async function openFileInNewEditor(path: string): Promise<vscode.TextEditor> {
    const fileUri = vscode.Uri.file(path);
    const newEditor = await vscode.window.showTextDocument(fileUri);
    return newEditor;
}

export async function replaceSelectionInEditor(
    editor: vscode.TextEditor,
    selection: vscode.Position | vscode.Range | vscode.Selection,
    replacementText: string
): Promise<void> {
    await focusEditor(editor);

    await editor.edit((editBuilder) => {
        editBuilder.replace(selection, replacementText);
    });
}
