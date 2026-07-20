export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function renderMetaItems(items = []) {
    return items.map((item) => `
        <div class="pdf-meta-item">
            <span class="pdf-meta-label">${escapeHtml(item.label)}</span>
            <span class="pdf-meta-value">${escapeHtml(item.value ?? '—')}</span>
        </div>
    `).join('');
}

export function renderFieldRows(items = []) {
    return items.map((item) => `
        <dt>${escapeHtml(item.label)}</dt>
        <dd>${escapeHtml(item.value ?? '—')}</dd>
    `).join('');
}

export function renderDataTable({ columns = [], rows = [], emptyMessage = 'No records found.' }) {
    const header = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('');
    const body = rows.length
        ? rows.map((row) => `
            <tr>
                ${columns.map((column) => `<td>${escapeHtml(row[column.key] ?? '—')}</td>`).join('')}
            </tr>
        `).join('')
        : `<tr><td colspan="${columns.length}">${escapeHtml(emptyMessage)}</td></tr>`;

    return `
        <div class="doc-table-wrap">
            <table class="doc-table">
                <thead><tr>${header}</tr></thead>
                <tbody>${body}</tbody>
            </table>
        </div>
    `;
}
