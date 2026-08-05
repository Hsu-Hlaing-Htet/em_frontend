export async function fetchAllListItems(fetchPage, params, mapItem) {
    const preview = await fetchPage({
        ...params,
        page: 1,
        per_page: 1,
    });

    const total = preview?.data?.total ?? 0;

    if (total === 0) {
        return [];
    }

    const response = await fetchPage({
        ...params,
        page: 1,
        per_page: total,
    });

    return (response?.data?.data ?? [])
        .map(mapItem)
        .filter(Boolean);
}
