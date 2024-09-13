import { WebviewApi } from 'vscode-webview';
import { IFileItem } from '../src-shared/models/models';
import { assertNotNullish } from '../src-shared/utils/assert-not-nullish';

let vscodeapi: WebviewApi<unknown>;

function getFilesTableBody(): HTMLTableElement {
    const element = document.getElementById('files-table-body');
    assertNotNullish(element);
    return element as HTMLTableElement;
}

function clearFilesTable(): void {
    const tbody = getFilesTableBody();
    tbody.replaceChildren();
}

function createFileCell(text: string): HTMLTableCellElement {
    const td = document.createElement('td');
    td.innerText = text;
    td.classList.add('is-size-7');
    return td;
}

function addFileRow(tbody: HTMLTableElement, file: IFileItem): void {
    const tr = document.createElement('tr');

    tr.appendChild(createFileCell(file.currentFileName));
    tr.appendChild(createFileCell(file.newFileName ?? '-'));

    tbody.appendChild(tr);
}

function applyFileList(files: IFileItem[]): void {
    clearFilesTable();

    const tbody = getFilesTableBody();
    for (const file of files) {
        addFileRow(tbody, file);
    }
}

function setupMessageListener() {
    window.addEventListener('message', (event) => {
        const message = event.data;

        console.log(`[From Host] message received of type = ${message.type}`);

        switch (message.type) {
            case 'newFileList':
                applyFileList(message.files);
                break;

            default:
                break;
        }
    });
}

function getMatchTypeElements(): HTMLInputElement[] {
    return Array.from(document.querySelectorAll('input[type="radio"][name="match-type"]'));
}

function getMatchType(): string {
    for (const radio of getMatchTypeElements()) {
        if (radio.checked) {
            return radio.value;
        }
    }
    throw new Error('No radio checked?');
}

function getMatchPatternElement(): HTMLInputElement {
    const element = document.getElementById('match-pattern');
    assertNotNullish(element);
    return element as HTMLInputElement;
}

function getMatchPattern(): string {
    const input = getMatchPatternElement();
    return input.value;
}

function getReplacementElement(): HTMLInputElement {
    const element = document.getElementById('replacement');
    assertNotNullish(element);
    return element as HTMLInputElement;
}

function getReplacement(): string {
    const input = getReplacementElement();
    return input.value;
}

function getFileList() {
    vscodeapi.postMessage({
        type: 'getFileList',
        matchType: getMatchType(),
        matchPattern: getMatchPattern(),
        replacement: getReplacement(),
    });
}

function confirmChanges() {
    vscodeapi.postMessage({
        type: 'confirm',
        matchType: getMatchType(),
        matchPattern: getMatchPattern(),
        replacement: getReplacement(),
    });
}

function cancel() {
    vscodeapi.postMessage({
        type: 'cancel',
    });
}

function getConfirmElement(): HTMLButtonElement {
    const element = document.getElementById('confirm');
    assertNotNullish(element);
    return element as HTMLButtonElement;
}

function getCancelElement(): HTMLButtonElement {
    const element = document.getElementById('cancel');
    assertNotNullish(element);
    return element as HTMLButtonElement;
}

function setupDomListeners() {
    const matchPattern = getMatchPatternElement();
    const replacement = getReplacementElement();

    for (const input of [matchPattern, replacement, ...getMatchTypeElements()]) {
        input.addEventListener('input', () => {
            getFileList();
        });
    }

    getConfirmElement().addEventListener('click', () => {
        confirmChanges();
    });

    getCancelElement().addEventListener('click', () => {
        cancel();
    });
}

function startRenameApp() {
    vscodeapi = acquireVsCodeApi();
    setupMessageListener();
    setupDomListeners();
    getFileList();
}

startRenameApp();
