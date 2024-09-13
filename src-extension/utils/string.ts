export function isCharacterUppercase(character: string): boolean {
    if (character.length !== 1) {
        throw new Error('Input must be a single character');
    }

    return /[A-Z]/.test(character);
}

export function isCharacterLowercase(character: string): boolean {
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

function convertWordBoundariesToKebabCase(input: string): string {
    const wordBoundariesRegex = new RegExp('[a-z][A-Z]', 'g');

    return input.replace(wordBoundariesRegex, convertWordBoundaryToKebabCase);
}

export function camelToKebabCase(input: string): string {
    // handle the word boundaries (to handle everything after that point)
    input = convertWordBoundariesToKebabCase(input);

    return input;
}

export function pascalToCamelCase(input: string): string {
    const isFirstCharacterUppercase = isCharacterUppercase(input[0]);
    if (!isFirstCharacterUppercase) {
        throw new Error('input does not appear to be PascalCase');
    }

    // handle beginning of the first word
    input = `${input[0].toLowerCase()}${input.substring(1)}`;

    return input;
}

export function pascalToKebabCase(input: string): string {
    const camelCased = pascalToCamelCase(input);

    const kebabCased = camelToKebabCase(camelCased);

    return kebabCased;
}

function convertWordBoundaryToPascalCase(wordBoundary: string): string {
    if (wordBoundary.length !== 3) {
        throw new Error(
            'Input must be a word boundary from a kebab case string. That will always be 3 characters.'
        );
    }

    if (!isCharacterLowercase(wordBoundary[0])) {
        throw new Error('End of previous word was not lower?');
    }

    if (!isCharacterLowercase(wordBoundary[2])) {
        throw new Error('Start of next word was not lower?');
    }

    return `${wordBoundary[0]}${wordBoundary[2].toUpperCase()}`;
}

function convertWordBoundariesToPascalCase(input: string): string {
    const wordBoundariesRegex = new RegExp('[a-z]-[a-z]', 'g');

    return input.replace(wordBoundariesRegex, convertWordBoundaryToPascalCase);
}

export function kebabToPascalCase(input: string): string {
    const isFirstCharacterLowercase = isCharacterLowercase(input[0]);
    if (!isFirstCharacterLowercase) {
        throw new Error('input does not appear to be kebab-case');
    }

    // handle beginning of the first word
    input = `${input[0].toUpperCase()}${input.substring(1)}`;

    // handle the word boundaries (to handle everything after that point)
    input = convertWordBoundariesToPascalCase(input);

    return input;
}
