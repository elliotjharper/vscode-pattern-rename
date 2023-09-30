import * as vscode from 'vscode';
import { runCommandLineScript } from './run-command-line-script';

export async function readNxProjects(): Promise<string[]> {
    vscode.window.showInformationMessage(`Reading projects`);

    const projectsJson = await runCommandLineScript(`nx show projects --json`);

    const projects = JSON.parse(projectsJson) as string[];

    return projects.sort();
}
