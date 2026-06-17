export function multisortConvert(multiSortMeta = []) {
    if (!multiSortMeta.length) {
        return null;
    }

    return multiSortMeta
        .map((item) => `${item.field}|${item.order === -1 ? 'desc' : 'asc'}`)
        .join(',');
}
