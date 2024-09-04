import * as vscode from 'vscode';

export async function askIsNameCorrect(name: string): Promise<boolean> {
    const pick = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Is "${name}" the right token?`,
    });
    return pick === 'Yes';
}

export async function askForTypescriptName(): Promise<string> {
    // ask user for a name for new component
    let typescriptFileName = await vscode.window.showInputBox({
        placeHolder: 'Type the new typescript file name (.ts is optional)',
        validateInput: (userValue): string | undefined => {
            if (!userValue) {
                return 'Typescript file name required';
            }

            if (userValue.endsWith('.')) {
                return 'Typescript file name shouldnt end with .';
            }
        },
    });
    if (!typescriptFileName) {
        throw new Error('No Typescript file name provided. Exiting...');
    }

    if (!typescriptFileName.toLowerCase().endsWith('.ts')) {
        typescriptFileName += '.ts';
    }

    return typescriptFileName;
}
