import { ExecOptions, exec } from 'child_process';

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
