import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'elltg-right-click-to-angular-component.extractToComponent',
        async () => {
            /**
             * step 1: read the projects and allow picking of a project
             *
             * step 2: read the targets for that project and allow picking
             */

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showInformationMessage('No active editor. Exiting...');
                return;
            }

            if (!editor.selection) {
                vscode.window.showInformationMessage('No active selection. Exiting...');
                return;
            }

            // get the selected text from the active editor
            const selectedText = editor.document.getText(editor.selection);

            // ask user for a name for new component

            // ask user for folder to create the component under

            // invoke the ng cli to create the component

            // replace the html file content with the selection

            // remove the selected text
            await editor.edit((editBuilder) => {
                editBuilder.delete(editor.selection);
            });

            vscode.window.showInformationMessage('Extension not complete. Exiting...');

            // let nxProjects: string[];
            // try {
            //     nxProjects = await readNxProjects();
            // } catch (err) {
            //     vscode.window.showInformationMessage(`Failed to read nx projects. ${err}`);
            //     return;
            // }

            // const selectedNxProject = await vscode.window.showQuickPick(nxProjects);

            // if (!selectedNxProject) {
            //     vscode.window.showInformationMessage(
            //         'You did not select an nx project. Exiting...'
            //     );
            //     return;
            // }

            // const nxProjectTargets = await readNxProjectTargets(selectedNxProject);

            // const selectedTarget = await vscode.window.showQuickPick(nxProjectTargets);

            // if (!selectedTarget) {
            //     vscode.window.showInformationMessage(
            //         'You did not select an nx project target. Exiting...'
            //     );
            //     return;
            // }

            // const activeTerminal = vscode.window.activeTerminal;
            // if (activeTerminal) {
            //     activeTerminal.show();
            //     activeTerminal.sendText(`nx run ${selectedNxProject}:${selectedTarget}`);
            // } else {
            //     vscode.window.showInformationMessage('No active terminal. Exiting...');
            // }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
