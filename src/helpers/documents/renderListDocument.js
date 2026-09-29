import { escapeHtml } from './htmlUtils';

function columnClassName(column) {
    const fieldSlug = String(column.field).replace(/[^a-z0-9_-]/gi, '-');
    const classes = ['list-col', `list-col--${fieldSlug}`];

    if (column.align === 'center' || column.align === 'right') {
        classes.push(`list-col--align-${column.align}`);
    }

    if (column.nowrap) {
        classes.push('list-col--nowrap');
    }

    return classes.join(' ');
}

function columnStyle(column) {
    return column.width ? `width: ${escapeHtml(String(column.width))};` : '';
}

export function renderListDocumentBody({ columns, rows }) {
    const tableHead = columns.map((column) => {
        const style = columnStyle(column);

        return `
        <th class="${columnClassName(column)}"${style ? ` style="${style}"` : ''}>${escapeHtml(column.header)}</th>
    `;
    }).join('');

    const tableBody = rows.map((row) => {
        const cells = columns.map((column) => {
            const value = column.format ? column.format(row) : (row[column.field] ?? '');

            return `<td class="${columnClassName(column)}">${escapeHtml(String(value ?? ''))}</td>`;
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
