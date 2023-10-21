function isCharacterUppercase(character: string): boolean {
    if (character.length !== 1) {
        throw new Error('Input must be a single character');
    }

    return /[A-Z]/.test(character);
}

function isCharacterLowercase(character: string): boolean {
    if (character.length !== 1) {
        throw new Error('Input must be a single character');
    }

    return /[a-z]/.test(character);
}

function convertWordBoundaryToKebabCase(wordBoundary: string): string {
    if (wordBoundary.length !== 2) {
        throw new Error(
            'Input must be a word boundary from a Pascal or Camel case string. That will always be 2 characters.'
        );
    }

    if (!isCharacterLowercase(wordBoundary[0])) {
        throw new Error('End of previous word was not lower?');
    }

    if (!isCharacterUppercase(wordBoundary[1])) {
        throw new Error('Start of next word was not upper?');
    }

    return `${wordBoundary[0]}-${wordBoundary[1].toLowerCase()}`;
}

function convertWordBoundariesToKebab(input: string): string {
    const wordBoundariesRegex = new RegExp('[a-z][A-Z]', 'g');

    return input.replace(wordBoundariesRegex, convertWordBoundaryToKebabCase);
}

export function toKebabCase(input: string): string {
    const isFirstCharacterUppercase = isCharacterUppercase(input[0]);
    if (isFirstCharacterUppercase) {
        input = `${input[0].toLowerCase()}${input.substring(1)}`;
    }

    input = convertWordBoundariesToKebab(input);

    return input;
}
