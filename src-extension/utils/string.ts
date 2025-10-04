import { sortArray } from '../../src-shared/utils/sorting';

export function longestCommonSubstring(
    inputStrings: string[],
    minStringLength: number = 4
): string {
    if (!inputStrings.length) {
        return '';
    }

    const potentialMatches: Map<string, number> = new Map<string, number>();

    for (let inputStringIndex = 0; inputStringIndex < inputStrings.length; inputStringIndex++) {
        const inputString = inputStrings[inputStringIndex];
        const restOfInputStrings = inputStrings.filter((v, i) => i !== inputStringIndex);
        let sampleLength = minStringLength;
        while (inputString.substring(0, sampleLength)?.length === sampleLength) {
            for (let position = 0; position < inputString.length; position++) {
                const sample = inputString.substring(position, sampleLength);
                if (sample.length < sampleLength) {
                    break;
                }
                const existsInOtherInputString = restOfInputStrings.some((other) =>
                    other.includes(sample)
                );
                if (existsInOtherInputString) {
                    if (!potentialMatches.has(sample)) {
                        potentialMatches.set(sample, 0);
                    }
                    potentialMatches.set(sample, potentialMatches.get(sample)! + 1);
                }
            }
            sampleLength++;
        }
    }

    if (potentialMatches.size === 0) {
        return '';
    }

    const orderedByMatchLength = sortArray(
        Array.from(potentialMatches.entries()),
        (match) => match[0].length,
        false,
        (match) => match[1],
        false
    );
    return orderedByMatchLength[0][0];
}
