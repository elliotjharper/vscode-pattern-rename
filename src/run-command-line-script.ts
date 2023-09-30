import { ExecOptions, exec } from 'child_process';
import * as vscode from 'vscode';

function getWorkspacePath(): string {
    const path = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
    if (!path) {
        throw new Error('Could not read a path to look for monorepo!');
    }
    return path;
}

export function runCommandLineScript(script: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        console.log('Going to start running');

        const config: ExecOptions = {
            cwd: getWorkspacePath(),
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

export function runCommandLineScriptCrap(script: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        console.log('Going to start running');
        exec(script, (error, stdout, stderr) => {
            console.log(`hitting callback. stdout: ${stdout}`);

            if (error) {
                console.log(`entering error: ${error}`);
                reject(error);
                return;
            }

            if (stderr) {
                // Handle any error messages here
                console.error('Script Error:', stderr);
            }

            // The script executed successfully, and the output is available in stdout
            resolve(stdout);
        });
    });
}
