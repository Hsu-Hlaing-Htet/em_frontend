import * as XLSX from 'xlsx';
import { downloadBlob, downloadTextFile } from './downloadFile';

function formatExportValue(row, column) {
    const value = column.format ? column.format(row) : (row[column.field] ?? '');

    return value ?? '';
}

export function buildCsvContent(rows, columns) {
    const header = columns.map((column) => column.header).join(',');
    const body = rows.map((row) => columns.map((column) => {
        const value = formatExportValue(row, column);

        return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','));

    return [header, ...body].join('\n');
}

export function downloadCsv(filename, rows, columns) {
    downloadTextFile(filename, buildCsvContent(rows, columns), 'text/csv;charset=utf-8;');
}

export function downloadXlsx(filename, rows, columns) {
    const sheetData = [
        columns.map((column) => column.header),
        ...rows.map((row) => columns.map((column) => formatExportValue(row, column))),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    downloadBlob(filename, new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }));
}
