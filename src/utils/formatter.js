const formatDate = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        return value;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
};

export function filterContracts(contracts, { search, status, dateFrom, dateTo, dateField = 'created_at' }) {
    let result = [...contracts];

    if (search) {
        const keyword = search.toLowerCase();

        result = result.filter((item) => (
            item.contract_no?.toLowerCase().includes(keyword)
            || item.customer_name?.toLowerCase().includes(keyword)
            || item.building_name?.toLowerCase().includes(keyword)
            || item.room_number?.toLowerCase().includes(keyword)
        ));
    }

    if (status) {
        result = result.filter((item) => item.status === status);
    }

    if (dateFrom || dateTo) {
        result = result.filter((item) => {
            const value = parseDate(item[dateField]);

            if (!value) {
                return false;
            }

            if (dateFrom) {
                const from = new Date(dateFrom);
                from.setHours(0, 0, 0, 0);

                if (value < from) {
                    return false;
                }
            }

            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);

                if (value > to) {
                    return false;
                }
            }

            return true;
        });
    }

    return result;
}

export function paginateList(items, { page = 0, rows = 10 }) {
    const start = page * rows;

    return {
        data: items.slice(start, start + rows),
        total: items.length,
        first: start,
    };
}

export function exportContractsToCsv(contracts, columns) {
    const header = columns.map((column) => column.header).join(',');
    const rows = contracts.map((item) => columns.map((column) => {
        const value = item[column.field] ?? '';

        return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','));

    return [header, ...rows].join('\n');
}

export function downloadCsv(filename, content) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

export function formatCurrency(value) {
    if (value === null || value === undefined) {
        return '-';
    }

    return new Intl.NumberFormat('en-MM', {
        style: 'currency',
        currency: 'MMK',
        maximumFractionDigits: 0,
    }).format(value);
}

export function getStatusLabel(status) {
    const labels = {
        draft: 'Draft',
        pending_approval: 'Pending Approval',
        rejected: 'Rejected',
        active: 'Active',
        completed: 'Completed',
        cancelled: 'Cancelled',
    };

    return labels[status] || status;
}

export { formatDate, parseDate };
