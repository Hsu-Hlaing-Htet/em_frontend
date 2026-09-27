import { formatCurrency, getStatusLabel } from '@/utils/formatter';
import { formatProjectMonthYear } from '@/utils/timezone';

export function formatUtilityReference({ billing_month, room_number, id }) {
    const month = billing_month?.slice(0, 7) || '0000-00';

    return `UTL-${month}-${room_number || id}`;
}

export function formatPaymentReference(paymentNumberOrId) {
    if (typeof paymentNumberOrId === 'string' && paymentNumberOrId.startsWith('PAY-')) {
        return paymentNumberOrId;
    }

    return `PAY-${String(paymentNumberOrId).padStart(6, '0')}`;
}

export function formatBillingMonthLabel(billingMonth) {
    if (!billingMonth) {
        return '-';
    }

    return formatProjectMonthYear(billingMonth) || billingMonth;
}

export function formatReading(value) {
    const number = Number(value);

    return Number.isFinite(number) ? number.toFixed(2) : '-';
}

export { formatCurrency, getStatusLabel };
