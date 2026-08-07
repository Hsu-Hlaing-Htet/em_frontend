export const INVOICE_TYPE_LABELS = {
    rent: 'Rent',
    utility: 'Utility',
    maintenance: 'Maintenance',
    other: 'Other',
    sale: 'Sale',
};

export function formatInvoiceTypeLabel(type) {
    if (!type) {
        return '—';
    }

    return INVOICE_TYPE_LABELS[type] ?? type;
}

export function formatPropertyUnit(invoice) {
    if (invoice?.property_unit) {
        return invoice.property_unit;
    }

    const building = invoice?.building_name;
    const room = invoice?.room_number;

    if (building && room) {
        return `${building} · ${room}`;
    }

    return building || room || '—';
}

export function resolveInvoicePaymentStatus(invoice) {
    return invoice?.payment_status || invoice?.status || 'unpaid';
}

export function formatInvoiceNotes(invoice) {
    if (invoice?.notes) {
        return invoice.notes;
    }

    const descriptions = (invoice?.items || [])
        .map((item) => item.description)
        .filter(Boolean);

    return descriptions.length ? descriptions.join(' · ') : '—';
}

export function formatBillingPeriod(invoice) {
    if (invoice?.billing_period) {
        return invoice.billing_period;
    }

    if (invoice?.issued_date) {
        const normalized = invoice.issued_date.includes('T')
            ? invoice.issued_date
            : `${invoice.issued_date}T00:00:00`;

        return new Date(normalized).toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
        });
    }

    return '—';
}

export function formatInvoiceMeterValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const number = Number(value);

    return Number.isFinite(number) ? number.toFixed(2) : '—';
}

export function mapInvoiceLineItemRow(item, formatCurrency) {
    const isMetered = Boolean(item?.is_metered);
    const unitPrice = item?.unit_price;

    return {
        id: item.id,
        description: item.description || '—',
        previous_reading: isMetered ? formatInvoiceMeterValue(item.previous_reading) : '—',
        current_reading: isMetered ? formatInvoiceMeterValue(item.current_reading) : '—',
        usage: isMetered ? formatInvoiceMeterValue(item.usage) : '—',
        unit_price: unitPrice === null || unitPrice === undefined || unitPrice === ''
            ? '—'
            : formatCurrency(unitPrice),
        amount: formatCurrency(item.amount),
    };
}
