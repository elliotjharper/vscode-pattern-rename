export interface IFileItem {
    fsPath: string;
    currentFileName: string;
    newFileName: string | null;
}

export interface IFileListMessage {
    files: IFileItem[];
    matchPatternError?: number;
    replacementError?: number;
}
