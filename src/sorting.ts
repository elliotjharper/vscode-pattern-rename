export function nonNumericSort<T>(a: T, b: T, keyProp: keyof T): number {
    const aVal = a[keyProp];
    const bVal = b[keyProp];

    if (aVal < bVal) {
        return -1;
    } else if (aVal > bVal) {
        return 1;
    } else {
        return 0;
    }
}

export function numericSort<T>(a: T, b: T, keyProp: keyof T): number {
    const aVal = a[keyProp] as unknown as number;
    const bVal = b[keyProp] as unknown as number;

    return aVal - bVal;
}

export function simpleSortArray<T1, T2>(
    arr: T1[],
    propFunc: (item: T1) => T2,
    compFunc: (itemA: T2, itemB: T2) => number
): T1[] {
    return [...arr].sort((itemA, itemB) => {
        const valA = propFunc(itemA);
        const valB = propFunc(itemB);
        return compFunc(valA, valB);
    });
}

function sortValues<T1, T2>(
    a: T1,
    b: T1,
    sortingAsc: boolean,
    tieBreak: boolean = false,
    tieA?: T2,
    tieB?: T2,
    tieSortingAsc?: boolean
): number {
    if (a === b) {
        // if tieBreak has been chosen then try to sort 'thenBy' the tie break values
        if (tieBreak) {
            // 1 = B then A
            // -1 = A then B
            const tieResult = sortValues(tieA, tieB, tieSortingAsc ?? sortingAsc);
            return tieResult;
        }
        // 0 same place in sorting
        return 0;
    }

    if (a === undefined || a === null) {
        // nulls last but has to flip if we flip sort order
        return sortingAsc ? 1 : -1;
    }

    if (b === undefined || b === null) {
        // nulls last but has to flip if we flip sort order
        return sortingAsc ? -1 : 1;
    }

    // 1 = B then A
    // -1 = A then B
    const aIsLargerOrLater = a > b;
    if (sortingAsc) {
        return aIsLargerOrLater ? 1 : -1;
    } else {
        return aIsLargerOrLater ? -1 : 1;
    }
}

/**
 * Use this function to sort an array
 * @param propSelector Provide a function that takes in an item from the array
 * and returns the property/value that we should sort on.
 * (note: could use this to sort on a calculated value)
 * @param tiePropSelector Provide a function that takes in an item from the array
 * and returns the property/value that should be used to sort 'thenBy'
 * to resolve ties/perform sub sorting
 */
export function sortArray<TArrayItem, TItemProperty, TTieItemProperty>(
    array: TArrayItem[],
    propSelector: (arrayItem: TArrayItem) => TItemProperty,
    sortingAsc: boolean = true,
    tiePropSelector?: (arrayItem: TArrayItem) => TTieItemProperty,
    tieSortingAsc?: boolean
): TArrayItem[] {
    return [...array].sort((a: TArrayItem, b: TArrayItem) => {
        const aProp = propSelector(a);
        const bProp = propSelector(b);
        const aTieProp = tiePropSelector ? tiePropSelector(a) : undefined;
        const bTieProp = tiePropSelector ? tiePropSelector(b) : undefined;
        const fixedTieSortingAsc = tieSortingAsc ?? sortingAsc;

        const result = sortValues(
            aProp,
            bProp,
            sortingAsc,
            tiePropSelector ? true : false,
            aTieProp,
            bTieProp,
            fixedTieSortingAsc
        );

        return result;
    });
}
