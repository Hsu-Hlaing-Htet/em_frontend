import { useListExport } from '@/composables/admin/useListExport';

/**
 * Backward-compatible wrapper for contract list exports.
 */
export function useContractListExport({
    listType,
    title,
    filenameBase,
    emptyMessage,
    getFetchParams,
    fetchPage,
    mapItem,
    applyFilters,
    getFilterSummary,
    exportColumnsByList,
    hasData,
    landscape = true,
}) {
    const columns = exportColumnsByList[listType];

    return useListExport({
        title,
        filenameBase,
        columns,
        emptyMessage,
        getFetchParams,
        fetchPage,
        mapItem,
        applyFilters,
        getFilterSummary,
        landscape,
        hasData,
    });
}
