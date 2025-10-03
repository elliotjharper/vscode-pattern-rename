/**
 * Replaces tokens in a string with their corresponding values.
 * Supported tokens:
 * - $DD: Day of month (01-31)
 * - $MM: Month (01-12)
 * - $YYYY: Full year (e.g., 2024)
 * - $YY: Two-digit year (e.g., 24)
 * - $HH: Hours (00-23)
 * - $MIN: Minutes (00-59)
 * - $SS: Seconds (00-59)
 */
export function replaceTokens(input: string): string {
    const now = new Date();
    
    const tokens: { [key: string]: string } = {
        '$YYYY': now.getFullYear().toString(),
        '$YY': now.getFullYear().toString().slice(-2),
        '$MM': String(now.getMonth() + 1).padStart(2, '0'),
        '$DD': String(now.getDate()).padStart(2, '0'),
        '$HH': String(now.getHours()).padStart(2, '0'),
        '$MIN': String(now.getMinutes()).padStart(2, '0'),
        '$SS': String(now.getSeconds()).padStart(2, '0'),
    };
    
    let result = input;
    for (const [token, value] of Object.entries(tokens)) {
        result = result.replace(new RegExp(token.replace('$', '\\$'), 'g'), value);
    }
    
    return result;
}
