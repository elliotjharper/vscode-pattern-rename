import * as vscode from 'vscode';

export function activeEditor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        throw new Error('No active editor. Exiting...');
    }

    return editor;
}

export function getUserSelection(): vscode.Selection {
    return activeEditor().selection;
}

export function getUserSelectedText(): string {
    const selectedText = activeEditor().document.getText(getUserSelection());

    return selectedText;
}

/** IMPORTANT: This will apply to whatever is the active editor  */
export async function triggerFormatDocument(): Promise<void> {
    await vscode.commands.executeCommand('editor.action.formatDocument');
}

export async function openFileInNewEditor(path: string): Promise<vscode.TextEditor> {
    const fileUri = vscode.Uri.file(path);
    const newEditor = await vscode.window.showTextDocument(fileUri);
    return newEditor;
}

export async function replaceSelectionInEditor(
    editor: vscode.TextEditor,
    selection: vscode.Selection,
    replacementText: string
): Promise<void> {
    await editor.edit((editBuilder) => {
        editBuilder.replace(selection, replacementText);
    });
}
