export const PAYMENT_TYPE_LABELS = {
    rent: 'Rent',
    utility: 'Utility',
    maintenance: 'Maintenance',
    sale: 'Sale',
    other: 'Other',
};

export function formatPaymentTypeLabel(type) {
    if (!type) {
        return '—';
    }

    return PAYMENT_TYPE_LABELS[type] ?? type;
}

export function formatPaymentMethodTypeLabel(type) {
    if (!type) {
        return '—';
    }

    return String(type)
        .split(/[_-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function formatPropertyUnit(item) {
    if (item?.property_unit) {
        return item.property_unit;
    }

    const building = item?.building_name;
    const room = item?.room_number;

    if (building && room) {
        return `${building} · ${room}`;
    }

    return building || room || '—';
}

export function resolvePaymentListStatus(item) {
    return item?.display_status || item?.status || 'pending';
}
