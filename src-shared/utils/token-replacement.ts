export interface TokenValues {
    day: string;
    month: string;
    year: string;
    shortYear: string;
    hours: string;
    mins: string;
    seconds: string;
}

/**
 * Gets current date/time values formatted for token replacement
 */
export function getCurrentTokenValues(): TokenValues {
    const now = new Date();

    return {
        day: now.getDate().toString().padStart(2, '0'),
        month: (now.getMonth() + 1).toString().padStart(2, '0'), // getMonth() is 0-based
        year: now.getFullYear().toString(),
        shortYear: now.getFullYear().toString().slice(-2),
        hours: now.getHours().toString().padStart(2, '0'),
        mins: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0'),
    };
}

/**
 * Replaces tokens in a string with current date/time values
 * Supported tokens: ${day}, ${month}, ${year}, ${shortYear}, ${hours}, ${mins}, ${seconds}
 */
export function replaceTokens(input: string): string {
    const tokens = getCurrentTokenValues();

    return input
        .replace(/\$\{day\}/g, tokens.day)
        .replace(/\$\{month\}/g, tokens.month)
        .replace(/\$\{year\}/g, tokens.year)
        .replace(/\$\{shortYear\}/g, tokens.shortYear)
        .replace(/\$\{hours\}/g, tokens.hours)
        .replace(/\$\{mins\}/g, tokens.mins)
        .replace(/\$\{seconds\}/g, tokens.seconds);
}
