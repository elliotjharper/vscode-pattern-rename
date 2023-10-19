import * as vscode from 'vscode';
import { runCommandLineScript } from './run-command-line-script';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'elltg-right-click-to-angular-component.extractToComponent',
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showInformationMessage('No active editor. Exiting...');
                return;
            }

            if (!editor.selection) {
                vscode.window.showInformationMessage('No active selection. Exiting...');
                return;
            }

            // capture the current selection
            const selectionAtActivation = editor.selection;

            // get the selected text from the active editor
            const selectedText = editor.document.getText(selectionAtActivation);

            // ask user for a name for new component
            const componentName = await vscode.window.showInputBox({
                placeHolder: 'Type the name to be used for the new component (no spaces)',
                validateInput: (userValue): string | undefined => {
                    if (!userValue) {
                        return 'Component name required';
                    }

                    if (userValue.includes(' ')) {
                        return 'Component name cannot include spaces';
                    }
                },
            });
            if (!componentName) {
                vscode.window.showInformationMessage('No component name provided. Exiting...');
                return;
            }

            // ask user for folder to create the component under
            const folderSelection = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
            });
            const targetFolder = folderSelection?.[0]?.fsPath;
            if (!targetFolder) {
                vscode.window.showInformationMessage('No targetFolder provided. Exiting...');
                return;
            }

            const workspaceRootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

            if (!workspaceRootPath) {
                vscode.window.showInformationMessage(
                    'Could not determine workspace folder. Exiting...'
                );
                return;
            }

            const selectedFolderWithinWorkspace = targetFolder.includes(workspaceRootPath);
            if (!selectedFolderWithinWorkspace) {
                vscode.window.showInformationMessage(
                    'Selected folder was not within the workspace. Seems like a bad selection? Aborting for safety! Exiting...'
                );
                return;
            }

            // create the desired component
            vscode.window.showInformationMessage('Scaffolding new component...');
            try {
                await runCommandLineScript(targetFolder, `ng generate component ${componentName}`);
            } catch (err) {
                vscode.window.showInformationMessage(
                    `ERROR: Failed to generate new component. ${err}`
                );
                return;
            }

            // remove the selected text
            await editor.edit((editBuilder) => {
                editBuilder.delete(selectionAtActivation);
            });

            // open the newly generated component in an editor
            // replace the content with the selection
            const newComponentTemplatePath = vscode.Uri.file(
                `${targetFolder}\\${componentName}\\${componentName}.component.html`
            );
            const newComponentEditor = await vscode.window.showTextDocument(
                newComponentTemplatePath
            );

            await newComponentEditor.edit((editBuilder) => {
                const entireFileRange = new vscode.Range(
                    0,
                    0,
                    newComponentEditor.document.lineCount,
                    0
                );
                editBuilder.replace(entireFileRange, selectedText);
            });

            vscode.window.showInformationMessage(
                'Finished creating new component with selected content. Exiting...'
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
