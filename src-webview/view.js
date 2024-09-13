let vscode;

function getFilesTableBody() {
    return document.getElementById('files-table-body');
}

function clearFilesTable() {
    const tbody = getFilesTableBody();
    tbody.replaceChildren();
}

function createFileCell(text) {
    const td = document.createElement('td');
    td.innerText = text;
    td.classList.add('is-size-7');
    return td;
}

function addFileRow(tbody, file) {
    const tr = document.createElement('tr');

    tr.appendChild(createFileCell(file.currentFileName));
    tr.appendChild(createFileCell(file.newFileName ?? '-'));

    tbody.appendChild(tr);
}

function applyFileList(files) {
    clearFilesTable();

    const tbody = getFilesTableBody();
    for (const file of files) {
        addFileRow(tbody, file);
    }
}

function setupMessageListener() {
    window.addEventListener('message', (event) => {
        console.log(`[From Host] message received`);
        console.log(event);
        const message = event.data;

        switch (message.type) {
            case 'newFileList':
                applyFileList(message.files);
                break;

            default:
                break;
        }
    });
}

function getMatchTypeElements() {
    return document.querySelectorAll('input[type="radio"][name="match-type"]');
}

function getMatchType() {
    for (const radio of getMatchTypeElements()) {
        if (radio.checked) {
            return radio.value;
        }
    }
    throw new Error('No radio checked?');
}

function getMatchPatternElement() {
    return document.getElementById('match-pattern');
}

function getMatchPattern() {
    const input = getMatchPatternElement();
    return input.value;
}

function getReplacementElement() {
    return document.getElementById('replacement');
}

function getReplacement() {
    const input = getReplacementElement();
    return input.value;
}

function getFileList() {
    vscode.postMessage({
        type: 'getFileList',
        matchType: getMatchType(),
        matchPattern: getMatchPattern(),
        replacement: getReplacement(),
    });
}

function confirmChanges() {
    vscode.postMessage({
        type: 'confirm',
        matchType: getMatchType(),
        matchPattern: getMatchPattern(),
        replacement: getReplacement(),
    });
}

function cancel() {
    vscode.postMessage({
        type: 'cancel',
    });
}

function setupDomListeners() {
    const matchPattern = getMatchPatternElement();
    const replacement = getReplacementElement();

    for (const input of [matchPattern, replacement, ...getMatchTypeElements()]) {
        input.addEventListener('input', () => {
            this.getFileList();
        });
    }

    document.getElementById('confirm').addEventListener('click', () => {
        confirmChanges();
    });

    document.getElementById('cancel').addEventListener('click', () => {
        cancel();
    });
}

function startRenameApp() {
    vscode = acquireVsCodeApi();
    setupMessageListener();
    setupDomListeners();
    getFileList();
}

window.onload = startRenameApp();
