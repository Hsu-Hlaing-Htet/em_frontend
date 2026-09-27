import { formatCurrency } from '@/utils/formatter';
import { formatProjectDateTime } from '@/utils/timezone';

export { formatCurrency };

export function formatNumber(value) {
    return new Intl.NumberFormat('en-MM').format(value ?? 0);
}

export function formatDate(value) {
    if (!value) {
        return '-';
    }

    return formatProjectDateTime(value) || '-';
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

            return [label, value];
        }),
    );
}
