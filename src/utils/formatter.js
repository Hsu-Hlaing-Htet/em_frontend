const CURRENCY_LOCALE = 'en-MM';
const CURRENCY_CODE = 'MMK';
const BACKEND_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function isRealDate(year, month, day) {
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day;
}

function toBackendDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDateParts(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    const backendMatch = trimmed.match(BACKEND_DATE_PATTERN);

    if (backendMatch) {
        const year = Number(backendMatch[1]);
        const month = Number(backendMatch[2]);
        const day = Number(backendMatch[3]);

        return isRealDate(year, month, day) ? { year, month, day } : null;
    }

    const displayMatch = trimmed.match(DISPLAY_DATE_PATTERN);

    if (displayMatch) {
        const day = Number(displayMatch[1]);
        const month = Number(displayMatch[2]);
        const year = Number(displayMatch[3]);

        return isRealDate(year, month, day) ? { year, month, day } : null;
    }

    return null;
}

const formatDate = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        const parts = parseDateParts(value);

        return parts ? toBackendDate(parts.year, parts.month, parts.day) : value;
    }

    if (Number.isNaN(value.getTime())) {
        return null;
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
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const parts = parseDateParts(value);

    if (parts) {
        return new Date(parts.year, parts.month - 1, parts.day);
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (BACKEND_DATE_PATTERN.test(trimmed) || DISPLAY_DATE_PATTERN.test(trimmed)) {
            return null;
        }
    }

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
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
