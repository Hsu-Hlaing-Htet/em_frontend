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
    const raw = String(item?.status || item?.display_status || '').toLowerCase();

    if (raw === 'approved' || raw === 'paid') {
        return 'paid';
    }

    if (raw === 'rejected') {
        return 'rejected';
    }

    if (raw === 'pending') {
        return 'pending';
    }

    // Never surface invoice statuses (e.g. overdue) on payment rows.
    return raw === 'overdue' || raw === 'partial' || raw === 'issued'
        ? 'paid'
        : (raw || 'pending');
}

/** UI label for payment transaction status (does not change stored backend values). */
export function formatPaymentStatusLabel(status) {
    const raw = String(status || '').toLowerCase();

    if (raw === 'approved' || raw === 'paid') {
        return 'Paid';
    }

    if (raw === 'rejected') {
        return 'Rejected';
    }

    if (raw === 'pending') {
        return 'Pending';
    }

    if (!raw) {
        return '—';
    }

    return raw
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toFiniteNumber(value) {
    if (value == null || value === '') {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}

/**
 * Shared row mapping for Admin Payment List and Payment Approval List.
 *
 * TOTAL = invoice_amount (subtotal + late fee)
 * PAID  = tendered/submitted for THIS payment (amount_received when set, else amount)
 * PAID BY = payment creator / submitter (created_by)
 */
export function mapPaymentListRow(item) {
    const applied = toFiniteNumber(item.amount);
    const paid = toFiniteNumber(item.paid)
        ?? toFiniteNumber(item.financial_summary?.paid)
        ?? toFiniteNumber(item.amount_received)
        ?? applied;

    const displayStatus = resolvePaymentListStatus(item);

    return {
        ...item,
        property_unit: item.property_unit || formatPropertyUnit(item),
        display_status: displayStatus,
        status_label: formatPaymentStatusLabel(displayStatus),
        amount: applied,
        paid,
        invoice_amount: toFiniteNumber(item.invoice_amount) ?? 0,
        payment_method_name: item.payment_method_name || '',
        customer_name: item.customer_name || '',
        paid_by: item.paid_by || item.submitted_by_name || item.created_by_name || '',
        invoice_number: item.invoice_number || '',
        payment_date: item.payment_date || '',
    };
}
