import * as vscode from 'vscode';

let _editor: vscode.TextEditor | undefined = undefined;

export function activeEditor(): vscode.TextEditor {
    _editor = _editor || vscode.window.activeTextEditor;

    if (!_editor) {
        throw new Error('No active editor. Exiting...');
    }

    return _editor;
}

export function getUserSelectionStartPosition(): number {
    const editor = activeEditor();
    const document = editor.document;
    const position = editor.selection.active;

    const offset = document.offsetAt(position);

    return offset;
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
