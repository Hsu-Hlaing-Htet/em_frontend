const PAYMENT_TYPE_LABELS = {
    rent: 'Rent',
    utility: 'Utility',
    maintenance: 'Maintenance',
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

export function mapDashboardPaymentRow(item) {
    return {
        ...item,
        payment_id: item.invoice_number || item.reference,
        customer_name: item.customer_name || item.client,
        property_unit: item.property_unit || formatPropertyUnit(item),
        invoice_number: item.invoice_number || item.invoice,
        payment_type: item.payment_type,
        invoice_amount: item.invoice_amount ?? item.amount,
        paid_amount: item.paid_amount ?? item.amount,
        balance: item.balance ?? 0,
        payment_date: item.payment_date || item.paid_at,
        payment_method_name: item.payment_method_name || item.method,
        display_status: resolvePaymentListStatus(item),
        reference_number: item.reference_number || item.invoice_number || item.reference,
        note: item.note || item.notes || '',
        receipt_id: item.receipt_id ?? null,
    };
}
