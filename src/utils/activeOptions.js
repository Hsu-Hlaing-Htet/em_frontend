export function toActiveOptions(items, selectedId, toOption) {
    const mapOption = toOption || ((item) => ({ label: item.name, value: item.id }));

    return items
        .filter((item) => item.status === 'active' || item.id === selectedId)
        .map(mapOption);
}
