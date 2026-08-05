import { ref, computed, unref } from 'vue';
import EventBus from '@/libs/AppEventBus';
import { downloadCsv, downloadXlsx } from '@/utils/export';
import { downloadPdfResponse, PDF_DOWNLOAD_HEADERS } from '@/utils/downloadPdfResponse';
import { printListDocument } from '@/helpers/documents/documentOutput';
import { fetchAllListItems } from '@/helpers/lists/fetchAllListItems';
import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

function resolveCurrentAdminName() {
    try {
        const raw = localStorage.getItem('user');
        if (!raw) {
            return 'Admin';
        }

        const user = JSON.parse(raw);

        return user?.name || user?.email || 'Admin';
    } catch {
        return 'Admin';
    }
}

function serializeRows(rows, columns) {
    return rows.map((row) => {
        const out = {};

        columns.forEach((column) => {
            const value = column.format ? column.format(row) : (row[column.field] ?? '');
            out[column.field] = value == null ? '' : String(value);
        });

        return out;
    });
}

/**
 * Shared list export: PDF / CSV / Excel / Print.
 * Reuses the page's list API filters + sorting via getFetchParams + fetchPage.
 */
export function useListExport({
    title,
    filenameBase,
    columns,
    emptyMessage = 'No records available to export.',
    getFetchParams,
    fetchPage,
    mapItem = (item) => item,
    applyFilters,
    getFilterSummary = () => [],
    landscape = true,
    hasData,
}) {
    const isExporting = ref(false);

    const canExport = computed(() => {
        if (isExporting.value) {
            return false;
        }

        const flag = unref(hasData);

        return flag === undefined ? true : Boolean(flag);
    });

    const notify = (severity, detail) => {
        EventBus.emit('show-toast', {
            severity,
            summary: '',
            detail,
        });
    };

    const resolveRows = async () => {
        const params = getFetchParams?.() || {};
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

    const withExport = async (action) => {
        if (!canExport.value && unref(hasData) === false) {
            notify('warn', emptyMessage);

            return;
        }

        isExporting.value = true;

        try {
            await action();
        } catch (error) {
            const detail = error?.data?.message
                || error?.message
                || 'Unable to export list.';
            notify('error', detail);
            throw error;
        } finally {
            isExporting.value = false;
        }
    };

    const downloadList = async () => {
        await withExport(async () => {
            const rows = await resolveRows();

            if (!ensureRows(rows)) {
                return;
            }

            const response = await api.post(
                endpoint.listExportPdf,
                {
                    title,
                    filename: `${filenameBase}.pdf`,
                    columns: columns.map((column) => ({
                        field: column.field,
                        header: column.header,
                    })),
                    rows: serializeRows(rows, columns),
                    filters: getFilterSummary(),
                    generated_by: resolveCurrentAdminName(),
                    landscape,
                },
                {
                    responseType: 'blob',
                    headers: PDF_DOWNLOAD_HEADERS,
                },
            );

            downloadPdfResponse(response, `${filenameBase}.pdf`);
            notify('success', `${title} downloaded as PDF.`);
        });
    };

    const exportCsv = async () => {
        await withExport(async () => {
            const rows = await resolveRows();

            if (!ensureRows(rows)) {
                return;
            }

            downloadCsv(`${filenameBase}.csv`, rows, columns);
            notify('success', `${title} exported to CSV.`);
        });
    };

    const exportExcel = async () => {
        await withExport(async () => {
            const rows = await resolveRows();

            if (!ensureRows(rows)) {
                return;
            }

            downloadXlsx(`${filenameBase}.xlsx`, rows, columns);
            notify('success', `${title} exported to Excel.`);
        });
    };

    const printList = async () => {
        await withExport(async () => {
            const rows = await resolveRows();

            if (!ensureRows(rows)) {
                return;
            }

            const printed = printListDocument({
                title,
                columns,
                rows,
                filters: getFilterSummary(),
                generatedBy: resolveCurrentAdminName(),
                landscape,
            });

            if (printed) {
                notify('success', `${title} sent to printer.`);
            }
        });
    };

    return {
        isExporting,
        canExport,
        downloadList,
        exportCsv,
        exportExcel,
        printList,
    };
}
