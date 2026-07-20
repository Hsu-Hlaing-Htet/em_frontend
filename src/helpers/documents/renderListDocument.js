import { escapeHtml } from './htmlUtils';

export function renderListDocumentBody({ columns, rows }) {
    const tableHead = columns.map((column) => `
        <th>${escapeHtml(column.header)}</th>
    `).join('');

    const tableBody = rows.map((row) => {
        const cells = columns.map((column) => {
            const value = column.format ? column.format(row) : (row[column.field] ?? '');

            return `<td>${escapeHtml(String(value ?? ''))}</td>`;
        }).join('');

        return `<tr>${cells}</tr>`;
    }).join('');

    return `
        <section class="pdf-block">
            <div class="doc-table-wrap">
                <table class="doc-table">
                    <thead><tr>${tableHead}</tr></thead>
                    <tbody>${tableBody}</tbody>
                </table>
            </div>
        </section>
    `;
}
