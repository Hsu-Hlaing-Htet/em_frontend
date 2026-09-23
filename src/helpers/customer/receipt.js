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

    const raw = String(value).trim();
    const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const dateTime = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);

    let date;
    let includeTime = false;

    if (dateOnly) {
        date = new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T00:00:00`);
    } else if (dateTime) {
        date = new Date(
            Number(dateTime[1]),
            Number(dateTime[2]) - 1,
            Number(dateTime[3]),
            Number(dateTime[4]),
            Number(dateTime[5]),
            Number(dateTime[6] || 0),
        );
        const hours = Number(dateTime[4]);
        const minutes = Number(dateTime[5]);
        const seconds = Number(dateTime[6] || 0);
        includeTime = !(hours === 0 && minutes === 0 && seconds === 0);
    } else {
        date = new Date(raw);
    }

    if (Number.isNaN(date.getTime())) {
        return raw;
    }

    const dayPart = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    if (!includeTime) {
        return dayPart;
    }

    const timePart = date.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return `${dayPart} · ${timePart}`;
}
