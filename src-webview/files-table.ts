import { IFileItem } from '../src-shared/models/models';
import { getFilesTableBody, getMatchPatternElement, getReplacementElement } from './dom-getters';

export function clearFilesTable(): void {
    const tbody = getFilesTableBody();
    tbody.replaceChildren();
}

export function createFileCell(text: string): HTMLTableCellElement {
    const td = document.createElement('td');
    td.innerText = text;
    td.classList.add('is-size-7');
    return td;
}

export function addFileRow(tbody: HTMLTableElement, file: IFileItem): void {
    const tr = document.createElement('tr');

    // before
    tr.appendChild(createFileCell(file.currentFileName));

    // will be changed
    tr.appendChild(createFileCell(file.newFileName ? 'Yes' : 'No'));

    // after
    tr.appendChild(createFileCell(file.newFileName ?? '-'));

    tbody.appendChild(tr);
}

export function applyInitialMatchText(initialMatchText: string): void {
    const matchPatternElement = getMatchPatternElement();
    matchPatternElement.value = initialMatchText;

    const replacementElement = getReplacementElement();
    replacementElement.value = initialMatchText;
}

export function applyFileList(files: IFileItem[]): void {
    clearFilesTable();

    const tbody = getFilesTableBody();
    for (const file of files) {
        addFileRow(tbody, file);
    }
}
