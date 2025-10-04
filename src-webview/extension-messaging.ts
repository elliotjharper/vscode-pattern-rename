import { applyIsDarkMode } from './dom-manipulations';
import { applyFileList, applyInitialMatchText } from './files-table';
import { getMatchPattern, getMatchType, getReplacement } from './form-controls';
import { vsCodeApi } from './vs-code-api';

export function setupMessageListener() {
    window.addEventListener('message', (event) => {
        const message = event.data;

        console.log(`[From Host] message received of type = ${message.type}`);

        switch (message.type) {
            case 'newInitialMatchText':
                applyInitialMatchText(message.initialMatchText);
                break;

            case 'newFileList':
                applyFileList(message.files);
                break;

            case 'sendIsDarkMode':
                applyIsDarkMode(message.isDarkMode);
                break;

            default:
                break;
        }
    });
}

export function getInitialMatchText() {
    vsCodeApi.postMessage({
        type: 'getInitialMatchText',
    });
}

export function getFileList() {
    vsCodeApi.postMessage({
        type: 'getFileList',
        matchType: getMatchType(),
        matchPattern: getMatchPattern(),
        replacement: getReplacement(),
    });
}

export function getIsDarkMode() {
    vsCodeApi.postMessage({
        type: 'getIsDarkMode',
    });
}

export function confirmChanges() {
    vsCodeApi.postMessage({
        type: 'confirm',
        matchType: getMatchType(),
        matchPattern: getMatchPattern(),
        replacement: getReplacement(),
    });
}

export function cancel() {
    vsCodeApi.postMessage({
        type: 'cancel',
    });
}
