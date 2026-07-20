import EventBus from '@/libs/AppEventBus';
import { downloadCsv, downloadXlsx } from '@/utils/export';
import { printListDocument } from '@/helpers/documents/documentOutput';
import { fetchAllListItems } from '@/helpers/contracts/fetchAllListItems';

export function useContractListExport({
    listType,
    title,
    filenameBase,
    emptyMessage,
    getVisibleRows,
    getFetchParams,
    fetchPage,
    mapItem,
    applyFilters,
    exportColumnsByList,
}) {
    const columns = exportColumnsByList[listType];

    const notify = (severity, detail) => {
        EventBus.emit('show-toast', {
            severity,
            summary: '',
            detail,
        });
    };

    const resolveRows = async ({ useVisibleRowsOnly = false } = {}) => {
        if (useVisibleRowsOnly) {
            return getVisibleRows();
        }

        const params = getFetchParams();
        let rows = await fetchAllListItems(fetchPage, params, mapItem);

        if (applyFilters) {
            rows = applyFilters(rows);
        }

        return rows;
    };

    const ensureRows = (rows) => {
        if (!rows.length) {
            notify('warn', emptyMessage);

            return false;
        }

        return true;
    };

    const downloadList = async () => {
        const rows = await resolveRows();

        if (!ensureRows(rows)) {
            return;
        }

        downloadCsv(`${filenameBase}.csv`, rows, columns);
        notify('success', `${title} downloaded as CSV.`);
    };

    const exportCsv = async () => {
        await downloadList();
    };

    const exportExcel = async () => {
        const rows = await resolveRows();

        if (!ensureRows(rows)) {
            return;
        }

        downloadXlsx(`${filenameBase}.xlsx`, rows, columns);
        notify('success', `${title} exported to Excel.`);
    };

    const printListView = async () => {
        const rows = await resolveRows();

        if (!ensureRows(rows)) {
            return;
        }

        const printed = printListDocument({
            title,
            columns,
            rows,
        });

        if (printed) {
            notify('success', `${title} sent to printer.`);
        }
    };

    return {
        downloadList,
        exportCsv,
        exportExcel,
        printList: printListView,
    };
}
