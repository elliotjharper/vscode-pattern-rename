export type Nullish<T> = T | null | undefined;

export function isNotNullish<T>(value: Nullish<T>): value is T {
    return value !== undefined && value !== null;
}

export function assertNotNullish<T>(
    value: T | null | undefined,
    valueName: string = 'Value'
): asserts value is T {
    if (!isNotNullish(value)) {
        throw new Error(`${valueName} was null or undefined!`);
    }
}
