import * as vscode from 'vscode';

export function isDarkMode(): boolean {
    const currentColorKind: vscode.ColorThemeKind = vscode.window.activeColorTheme.kind;
    
    const darkColorKinds: vscode.ColorThemeKind[] = [vscode.ColorThemeKind.Dark, vscode.ColorThemeKind.HighContrast];

    return darkColorKinds.includes(currentColorKind);
}