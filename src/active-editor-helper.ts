import * as vscode from 'vscode';
import { NodeObject } from './parser/actual-types';
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

    public getRangeForNode(node: NodeObject): vscode.Range {
        const nodeStartPosition = this.getPositionFromOffset(node.pos);
        const nodeEndPosition = this.getPositionFromOffset(node.end);
        const nodeRange = new vscode.Range(nodeStartPosition, nodeEndPosition);
        return nodeRange;
    }
}
