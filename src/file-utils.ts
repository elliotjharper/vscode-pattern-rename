import { writeFile, access, mkdir } from 'fs/promises';
import { getWorkspaceRootPath } from './workspace-utils';
import { dirname } from 'path';

export async function assertPathIsWithinWorkspace(path: string): Promise<void> {
    const workspaceRoot = await getWorkspaceRootPath();
    if (!path.includes(workspaceRoot)) {
        throw new Error(`Target path "${path}" was not within workspace path "${workspaceRoot}"`);
    }
}

/**
 * recursive function that will create path if it does not exist
 * starts at the most nested folder and if it cannot be accessed it will invoke itself at one folder up
 */
export async function ensurePathExists(path: string): Promise<void> {
    const currentFolder = dirname(path);

    try {
        await access(currentFolder);
    } catch (err) {
        const parentFolder = dirname(path);

        await ensurePathExists(parentFolder);

        await mkdir(currentFolder);
    }
}

export async function writeFileAtPath(path: string, content: string): Promise<void> {
    await assertPathIsWithinWorkspace(path);

    await ensurePathExists(path);

    await writeFile(path, content);
}
