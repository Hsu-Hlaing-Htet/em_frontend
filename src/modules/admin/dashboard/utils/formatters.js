export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value ?? 0);
}

export function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDetailRecord(item) {
    if (!item) {
        return null;
    }

    return Object.fromEntries(
        Object.entries(item).map(([key, value]) => {
            const label = key.replaceAll('_', ' ');

            if (['amount', 'price', 'value', 'rent'].includes(key) && typeof value === 'number') {
                return [label, formatCurrency(value)];
            }

            if (key.endsWith('_at') || key.endsWith('_date')) {
                return [label, formatDate(value)];
            }

            if (typeof value === 'boolean') {
                return [label, value ? 'Yes' : 'No'];
            }

            return [label, String(value ?? '-')];
        }),
    );
}
