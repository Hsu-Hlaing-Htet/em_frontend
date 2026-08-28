export const formatBillingMonth = (value) => {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-01`;
};

export const formatUtilityDate = (value) => {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return typeof value === 'string' ? value : null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const formatUnitValue = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number.toFixed(2) : '0.00';
};

export const formatOptionalUnitValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    return formatUnitValue(value);
};

export const recalcEntry = (entry) => {
    const usage = Math.max(0, Number(entry.current_reading) - Number(entry.previous_reading));
    entry.usage = Number(usage.toFixed(2));
    entry.amount = Number((usage * Number(entry.unit_price)).toFixed(2));
};

export const emptyUtilityItem = () => ({
    id: null,
    utility_type_id: null,
    previous_reading: 0,
    current_reading: 0,
    usage: 0,
    unit_price: null,
    amount: 0,
    rowError: '',
});
