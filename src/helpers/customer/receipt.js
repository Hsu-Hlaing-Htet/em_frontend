import {
    formatProjectDate,
    formatProjectDateTimeParts,
    parseProjectDateTimeParts,
} from '@/utils/timezone';

export function mapCustomerReceipt(row = {}) {
    const payment = row.payment || {};
    const invoiceNumber = payment.invoice_number ?? row.invoice_number ?? null;
    const paymentAmount = payment.amount ?? row.payment_amount ?? row.amount ?? null;

    return {
        ...row,
        payment_amount: paymentAmount,
        invoice_number: invoiceNumber,
        receipt_date: row.issued_at ?? row.receipt_date ?? payment.payment_date ?? row.payment_date ?? null,
        payment_date: payment.payment_date ?? row.payment_date ?? null,
        payment_method_name: payment.payment_method_name ?? row.payment_method_name ?? null,
        building_name: payment.building_name ?? row.building_name ?? null,
        room_number: payment.room_number ?? row.room_number ?? null,
        display_status: row.display_status ?? row.status ?? null,
    };
}

/** Customer-facing date: "09 Jun 2026" — omits meaningless midnight times. */
export function formatCustomerReceiptDate(value) {
    if (!value) {
        return null;
    }

    const parts = parseProjectDateTimeParts(value);

    if (!parts) {
        return String(value).trim();
    }

    if (parts.dateOnly) {
        return formatProjectDate(value);
    }

    const hasMeaningfulTime = !(parts.hour === 0 && parts.minute === 0 && (parts.second || 0) === 0);

    if (!hasMeaningfulTime) {
        return formatProjectDate(value);
    }

    return formatProjectDateTimeParts(value)?.display ?? formatProjectDate(value);
}
