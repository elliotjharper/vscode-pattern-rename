import { ExecOptions, exec } from 'child_process';
import * as vscode from 'vscode';

export function getWorkspacePath(): string {
    const path = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
    if (!path) {
        throw new Error('Could not read a path to look for monorepo!');
    }
    return path;
}

export function runCommandLineScript(dir: string, script: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        console.log('Going to start running');

        const config: ExecOptions = {
            cwd: dir,
        };

        exec(script, config, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
                return;
            }

            resolve(stdout);
        });
    });
}
