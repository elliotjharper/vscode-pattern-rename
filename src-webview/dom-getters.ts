import { assertNotNullish } from '../src-shared/utils/assert-not-nullish';

export function getMatchTypeElements(): HTMLInputElement[] {
    return Array.from(document.querySelectorAll('input[type="radio"][name="match-type"]'));
}

export function getMatchPatternElement(): HTMLInputElement {
    const element = document.getElementById('match-pattern');
    assertNotNullish(element);
    return element as HTMLInputElement;
}

export function getReplacementElement(): HTMLInputElement {
    const element = document.getElementById('replacement');
    assertNotNullish(element);
    return element as HTMLInputElement;
}

export function getConfirmElement(): HTMLButtonElement {
    const element = document.getElementById('confirm');
    assertNotNullish(element);
    return element as HTMLButtonElement;
}

export function getCancelElement(): HTMLButtonElement {
    const element = document.getElementById('cancel');
    assertNotNullish(element);
    return element as HTMLButtonElement;
}

export function getFilesTableBody(): HTMLTableElement {
    const element = document.getElementById('files-table-body');
    assertNotNullish(element);
    return element as HTMLTableElement;
}
