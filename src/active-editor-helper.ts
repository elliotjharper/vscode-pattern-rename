import * as vscode from 'vscode';
import { activeEditor } from './editor-utils';

export class ActiveEditorHelper {
    public editor: vscode.TextEditor;
    public document: vscode.TextDocument;

    constructor(editor?: vscode.TextEditor) {
        this.editor = editor ?? activeEditor();
        this.document = this.editor.document;
    }

    public getUserSelection(): vscode.Selection {
        return this.editor.selection;
    }

    public getUserSelectedText(): string {
        const selectedText = this.document.getText(this.getUserSelection());

        return selectedText;
    }

    public getUserSelectionStartPosition(): number {
        const position = this.editor.selection.active;

        const offset = this.document.offsetAt(position);

        return offset;
    }

    public getPositionFromOffset(offset: number): vscode.Position {
        return this.document.positionAt(offset);
    }
}
