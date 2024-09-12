import { rename } from 'fs/promises';
import * as vscode from 'vscode';
import { IFileItem } from './models';
import { startRenameView } from './start';
import path = require('path');

// log all messages
// once page loaded send message asking for data
// as the inputs change send message asking for up to date data
// on submit ask to apply the changes

export class ViewHost {
    public panel: vscode.WebviewPanel;

    constructor(public targetFiles: vscode.Uri[]) {
        this.panel = startRenameView();
        this.listenForMessages();
    }

    public sendMessage(): void {
        this.panel.webview.postMessage('[To View] message back');
    }

    private createReplacementItem(
        uri: vscode.Uri,
        matchType: string,
        matchPattern: string,
        replacement: string
    ): IFileItem {
        const currentFileName = path.basename(uri.fsPath);

        let newFileName: string | null = null;
        if (matchPattern && replacement && matchType === 'Plain') {
            const replaced = currentFileName.replace(matchPattern, replacement);
            if (replaced !== currentFileName) {
                newFileName = replaced;
            }
        }

        if (matchPattern && replacement && matchType === 'RegEx') {
            const replaced = currentFileName.replace(new RegExp(matchPattern), replacement);
            if (replaced !== currentFileName) {
                newFileName = replaced;
            }
        }

        const result: IFileItem = {
            fsPath: uri.fsPath,
            currentFileName,
            newFileName,
        };
        return result;
    }

    private buildAndSendFileList(
        matchType: string,
        matchPattern: string,
        replacement: string
    ): void {
        let filesList = this.targetFiles.map((targetFile) => {
            return this.createReplacementItem(targetFile, matchType, matchPattern, replacement);
        });

        // using the input and replacement produce the list
        this.panel.webview.postMessage({
            type: 'newFileList',
            files: filesList,
        });
    }

    private async confirm(
        matchType: string,
        matchPattern: string,
        replacement: string
    ): Promise<void> {
        for (const uri of this.targetFiles) {
            const replacementItem = this.createReplacementItem(
                uri,
                matchType,
                matchPattern,
                replacement
            );
            if (!replacementItem.newFileName) {
                continue;
            }

            const fileDir = path.dirname(replacementItem.fsPath);
            const newFsPath = path.join(fileDir, replacementItem.newFileName);
            try {
                await rename(replacementItem.fsPath, newFsPath);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to rename file: ${replacementItem.fsPath}`);
            }
        }

        this.panel.dispose();
    }

    private cancel(): void {
        this.panel.dispose();
    }

    private listenForMessages(): void {
        if (!this.panel) {
            throw new Error('panel was not created');
        }

        this.panel.webview.onDidReceiveMessage((message) => {
            console.log(`[From View] Type = ${message}`);

            switch (message.type) {
                case 'getFileList':
                    this.buildAndSendFileList(
                        message.matchType,
                        message.matchPattern,
                        message.replacement
                    );
                    return;

                case 'confirm':
                    this.confirm(message.matchType, message.matchPattern, message.replacement);
                    return;

                case 'cancel':
                    this.cancel();
                    return;

                default:
                    this.sendMessage();
                    return;
            }
        });
    }
}
