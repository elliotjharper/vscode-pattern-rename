import { writeFile, access, mkdir, lstat } from 'fs/promises';
import { getWorkspaceRootPath } from './workspace-utils';
import { dirname } from 'path';
import { Uri, workspace } from 'vscode';

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

export async function assertFileDoesNotAlreadyExist(path: string): Promise<void> {
    let couldAccess: boolean;
    try {
        await access(path);
        couldAccess = true;
    } catch (err) {
        couldAccess = false;
    }

    if (couldAccess) {
        throw new Error(`File already exists at path: ${path}`);
    }
}

export async function writeFileAtPath(path: string, content: string): Promise<void> {
    await assertPathIsWithinWorkspace(path);

    await ensurePathExists(path);

    await assertFileDoesNotAlreadyExist(path);

    await writeFile(path, content);
}

export async function isFile(uri: Uri): Promise<boolean> {
    const stats = await lstat(uri.fsPath);
    return stats.isFile();
}

/**
 *
 * @param rawUris
 * @returns
 * if files were right clicked return that list
 *
 * if a folder was right right clicked, return the list of files in the folder
 */
export async function getExplorerSelectionFilesList(rawUris: Uri[]): Promise<Uri[]> {
    if (!rawUris.length) {
        throw new Error('');
    }

    if (rawUris.length === 1) {
        const singleUri = rawUris[0];
        if (await isFile(singleUri)) {
            return [singleUri];
        } else {
            // is a folder selection
            const relativeFolderPath = workspace.asRelativePath(singleUri);
            const filesInFolder = await workspace.findFiles(`${relativeFolderPath}/*.*`);
            return filesInFolder;
        }
    }

    return rawUris;
}
