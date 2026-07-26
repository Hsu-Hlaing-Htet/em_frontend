const CURRENCY_LOCALE = 'en-MM';
const CURRENCY_CODE = 'MMK';

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

export function formatCurrency(value) {
    if (value === null || value === undefined) {
        return '-';
    }

    return new Intl.NumberFormat(CURRENCY_LOCALE, {
        style: 'currency',
        currency: CURRENCY_CODE,
        maximumFractionDigits: 0,
    }).format(value);
}

export { CURRENCY_CODE, CURRENCY_LOCALE };

export function getPaymentTypeLabel(type) {
    const labels = {
        full: 'Full',
        installment: 'Installment',
    };

    return labels[type] || type || '-';
}

export { getStatusLabel } from '@/config/statusColors';

export { formatDate, parseDate };
