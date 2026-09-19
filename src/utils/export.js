import * as XLSX from 'xlsx';
import { downloadBlob, downloadTextFile } from './downloadFile';
import { formatDate } from './formatter';

function formatExportValue(row, column) {
    if (column.format) {
        return column.format(row) ?? '';
    }

    const value = row[column.field] ?? '';

    if (column.type === 'date' && value) {
        return formatDate(value) || String(value);
    }

    return value ?? '';
}

function cellType(column, value) {
    if (column.type === 'number' || column.type === 'currency') {
        const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));

        return Number.isFinite(numeric) ? numeric : value;
    }

    if (column.type === 'date' && value) {
        return formatDate(value) || String(value);
    }

    return value == null ? '' : value;
}

export function buildCsvContent(rows, columns) {
    const header = columns.map((column) => column.header).join(',');
    const body = rows.map((row) => columns.map((column) => {
        const value = formatExportValue(row, column);

        return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','));

    // UTF-8 BOM so Excel opens CSV correctly
    return `\uFEFF${[header, ...body].join('\n')}`;
}

export function downloadCsv(filename, rows, columns) {
    downloadTextFile(filename, buildCsvContent(rows, columns), 'text/csv;charset=utf-8;');
}

export function downloadXlsx(filename, rows, columns) {
    const sheetData = [
        columns.map((column) => column.header),
        ...rows.map((row) => columns.map((column) => {
            const raw = formatExportValue(row, column);

            return cellType(column, raw);
        })),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const colWidths = columns.map((column) => {
        const headerLen = String(column.header || '').length;
        const sampleLen = Math.max(
            ...rows.slice(0, 50).map((row) => String(formatExportValue(row, column) ?? '').length),
            headerLen,
        );

        return { wch: Math.min(Math.max(sampleLen + 2, 12), 40) };
    });

    worksheet['!cols'] = colWidths;
    worksheet['!autofilter'] = {
        ref: XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: Math.max(rows.length, 0), c: Math.max(columns.length - 1, 0) },
        }),
    };
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' };

    // SheetJS community: freeze via workbook views on write is limited; set pane hint.
    if (!worksheet['!views']) {
        worksheet['!views'] = [{ state: 'frozen', ySplit: 1, topLeftCell: 'A2', activeCell: 'A2' }];
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    downloadBlob(filename, new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }));
}
