import { getMatchPatternElement, getMatchTypeElements, getReplacementElement } from './dom-getters';

export function getMatchType(): string {
    for (const radio of getMatchTypeElements()) {
        if (radio.checked) {
            return radio.value;
        }
    }
    throw new Error('No radio checked?');
}

export function getMatchPattern(): string {
    const input = getMatchPatternElement();
    return input.value;
}

export function getReplacement(): string {
    const input = getReplacementElement();
    return input.value;
}
