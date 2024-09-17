import {
    getCancelElement,
    getConfirmElement,
    getMatchPatternElement,
    getMatchTypeElements,
    getReplacementElement,
} from './dom-getters';
import { cancel, confirmChanges, getFileList } from './extension-messaging';

export function setupDomListeners() {
    const matchPattern = getMatchPatternElement();
    const replacement = getReplacementElement();

    for (const input of [matchPattern, replacement, ...getMatchTypeElements()]) {
        input.addEventListener('input', () => {
            //TODO: debounce calls to getFileList
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
