import { formatCurrency, getStatusLabel } from '@/utils/formatter';

export function formatUtilityReference({ billing_month, room_number, id }) {
    const month = billing_month?.slice(0, 7) || '0000-00';

    return `UTL-${month}-${room_number || id}`;
}

export function formatPaymentReference(id) {
    return `PAY-${String(id).padStart(5, '0')}`;
}

export function formatBillingMonthLabel(billingMonth) {
    if (!billingMonth) {
        return '-';
    }

    const date = new Date(billingMonth);

    return Number.isNaN(date.getTime())
        ? billingMonth
        : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatReading(value) {
    const number = Number(value);

    return Number.isFinite(number) ? number.toFixed(2) : '-';
}

export { formatCurrency, getStatusLabel };
