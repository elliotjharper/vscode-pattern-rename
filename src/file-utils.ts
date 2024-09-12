import { access, lstat } from 'fs/promises';
import { Uri, workspace } from 'vscode';

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
