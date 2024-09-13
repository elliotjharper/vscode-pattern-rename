export function keyPluck<TItem, TKey extends keyof TItem>(key: TKey): (item: TItem) => TItem[TKey] {
    return (item) => item[key];
}
