import * as vscode from 'vscode';
import { askForTargetFolder } from './workspace-utils';
import {
    activeEditor,
    getUserSelectedText,
    getUserSelection,
    openFileInNewEditor,
    replaceSelectionInEditor,
    triggerFormatDocument,
} from './editor-utils';
import { writeFileAtPath } from './file-utils';
import { isCharacterUppercase, kebabToPascalCase, pascalToKebabCase } from './string.utils';

async function askForComponentName(initialEditor: vscode.TextEditor): Promise<string> {
    if (!initialEditor.selection) {
        throw new Error('No active selection. Exiting...');
    }

    // ask user for a name for new component
    let componentName = await vscode.window.showInputBox({
        placeHolder: 'Type the new component ClassName. For example "MyNewComponent"',
        validateInput: (userValue): string | undefined => {
            if (!userValue) {
                return 'Component class name required';
            }

            if (userValue.includes(' ')) {
                return 'Component class name cannot include spaces';
            }

            if (userValue.includes('-')) {
                return 'Component class name cannot include hyphens';
            }

            if (!isCharacterUppercase(userValue[0])) {
                return 'Component class name should be PascalCase';
            }
        },
    });
    if (!componentName) {
        throw new Error('No component name provided. Exiting...');
    }

    return pascalToKebabCase(componentName);
}

async function replaceSelectionWithNewComponent(
    initialEditor: vscode.TextEditor,
    componentName: string,
    initialSelection: vscode.Selection
): Promise<void> {
    const newComponentSelector = `app-${componentName}`;
    const newComponentUsage = `<${newComponentSelector}></${newComponentSelector}>`;
    await replaceSelectionInEditor(initialEditor, initialSelection, newComponentUsage);
    await triggerFormatDocument();
}

const componentClassTemplate = `import { Component } from '@angular/core';

@Component({
    selector: '{Selector}',
    templateUrl: '{TemplatePath}'
})
export class {ClassName} {}
`;

function buildComponentClass(selector: string, templatePath: string, className: string): string {
    let file = componentClassTemplate;

    file = file.replace('{Selector}', selector);
    file = file.replace('{TemplatePath}', templatePath);
    file = file.replace('{ClassName}', className);

    return file;
}

async function createNewComponentWithSelectionAndOpen(
    targetFolder: string,
    componentName: string,
    selectedTemplateText: string
): Promise<void> {
    vscode.window.showInformationMessage('Creating new component...');

    // write a new template file with the selection
    const templateFilePath = `${targetFolder}\\${componentName}\\${componentName}.component.html`;
    await writeFileAtPath(templateFilePath, selectedTemplateText);
    await openFileInNewEditor(templateFilePath);

    // write the component class file
    const componentFilePath = `${targetFolder}\\${componentName}\\${componentName}.component.ts`;
    const newComponentClass = buildComponentClass(
        `app-${componentName}`,
        `${componentName}.component.html`,
        kebabToPascalCase(componentName)
    );
    await writeFileAtPath(componentFilePath, newComponentClass);
    await openFileInNewEditor(componentFilePath);
    await triggerFormatDocument();
}

async function extractComponentMain(): Promise<void> {
    try {
        const initialEditor = activeEditor();
        const initialSelection = getUserSelection();
        const selectedTemplateText = getUserSelectedText();

        const componentName: string = await askForComponentName(initialEditor);

        const targetFolder: string = await askForTargetFolder();

        await replaceSelectionWithNewComponent(initialEditor, componentName, initialSelection);

        await createNewComponentWithSelectionAndOpen(
            targetFolder,
            componentName,
            selectedTemplateText
        );

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
            extractComponentMain();
        }
    );
    context.subscriptions.push(extractToComponentCommand);
}

export function deactivate() {}
