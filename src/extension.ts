import * as vscode from 'vscode';
import { runCommandLineScript } from './run-command-line-script';
import { toKebabCase } from './to-kebab-case';

function activeEditor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        throw new Error('No active editor. Exiting...');
    }

    return editor;
}

function getUserSelection(): vscode.Selection {
    return activeEditor().selection;
}

function getUserSelectedText(): string {
    const selectedText = activeEditor().document.getText(getUserSelection());

    return selectedText;
}

async function askForComponentName(initialEditor: vscode.TextEditor): Promise<string> {
    if (!initialEditor.selection) {
        throw new Error('No active selection. Exiting...');
    }

    // ask user for a name for new component
    let componentName = await vscode.window.showInputBox({
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
        throw new Error('No component name provided. Exiting...');
    }

    return toKebabCase(componentName);
}

function getWorkspaceRootPath(): string {
    const workspaceRootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceRootPath) {
        throw new Error('Could not determine workspace folder. Exiting...');
    }

    return workspaceRootPath;
}

async function askForTargetFolder(): Promise<string> {
    // ask user for folder to create the component under
    const folderSelection = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
    });

    const targetFolder = folderSelection?.[0]?.fsPath;

    if (!targetFolder) {
        throw new Error('No targetFolder provided. Exiting...');
    }

    const selectedFolderWithinWorkspace = targetFolder.includes(getWorkspaceRootPath());
    if (!selectedFolderWithinWorkspace) {
        throw new Error(
            'Selected folder was not within the workspace. Seems like a bad selection? Aborting for safety! Exiting...'
        );
    }

    return targetFolder;
}

async function scaffoldNewComponent(
    componentName: string,
    targetFolder: string,
    skipModuleImport: boolean
): Promise<void> {
    // create the desired component
    vscode.window.showInformationMessage('Scaffolding new component...');
    try {
        let generateComponentCommand = `ng generate component ${componentName} --skip-tests`;
        if (skipModuleImport) {
            generateComponentCommand += `${generateComponentCommand} --skip-import`;
        }
        await runCommandLineScript(targetFolder, generateComponentCommand);
    } catch (err) {
        vscode.window.showInformationMessage(`ERROR: Failed to generate new component. ${err}`);
        return;
    }
}

async function replaceSelectionWithNewComponent(
    initialEditor: vscode.TextEditor,
    componentName: string,
    initialSelection: vscode.Selection
): Promise<void> {
    await initialEditor.edit((editBuilder) => {
        const newComponentSelector = `app-${componentName}`;

        editBuilder.replace(
            initialSelection,
            `<${newComponentSelector}></${newComponentSelector}>`
        );
    });

    // TODO: format the document after making the change
    // ??????
}

async function populateNewComponentWithSelection(
    targetFolder: string,
    componentName: string,
    initialSelectedText: string
): Promise<void> {
    // open the newly generated component in an editor
    // replace the content with the selection
    const newComponentTemplatePath = vscode.Uri.file(
        `${targetFolder}\\${componentName}\\${componentName}.component.html`
    );
    const newComponentEditor = await vscode.window.showTextDocument(newComponentTemplatePath);

    await newComponentEditor.edit((editBuilder) => {
        const entireFileRange = new vscode.Range(0, 0, newComponentEditor.document.lineCount, 0);
        editBuilder.replace(entireFileRange, initialSelectedText);
    });
    // TODO: format the document after making the change
    // ??????
}

async function extractComponentMain(skipModuleImport: boolean): Promise<void> {
    try {
        const initialEditor = activeEditor();
        const initialSelection = getUserSelection();
        const initialSelectedText = getUserSelectedText();

        const componentName: string = await askForComponentName(initialEditor);

        const targetFolder: string = await askForTargetFolder();

        await scaffoldNewComponent(componentName, targetFolder, skipModuleImport);

        await replaceSelectionWithNewComponent(initialEditor, componentName, initialSelection);

        await populateNewComponentWithSelection(targetFolder, componentName, initialSelectedText);

        vscode.window.showInformationMessage(
            'Finished creating new component with selected content. Exiting...'
        );
    } catch (err) {
        vscode.window.showInformationMessage(`Error whilst extracting component: ${err}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    let extractToComponentCommand = vscode.commands.registerCommand(
        'elltg-right-click-to-angular-component.extractToComponent',
        async () => {
            extractComponentMain(false);
        }
    );
    context.subscriptions.push(extractToComponentCommand);

    let extractToComponentSkipModuleImportCommand = vscode.commands.registerCommand(
        'elltg-right-click-to-angular-component.extractToComponentSkipModuleImport',
        async () => {
            extractComponentMain(true);
        }
    );
    context.subscriptions.push(extractToComponentSkipModuleImportCommand);
}

export function deactivate() {}
