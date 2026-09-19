export function mapCustomerReceipt(row = {}) {
    const payment = row.payment || {};

    return {
        ...row,
        payment_amount: payment.amount ?? row.payment_amount ?? null,
        invoice_number: payment.invoice_number ?? row.invoice_number ?? null,
        receipt_date: row.issued_at ?? row.receipt_date ?? payment.payment_date ?? row.payment_date ?? null,
        payment_date: payment.payment_date ?? row.payment_date ?? null,
        payment_method_name: payment.payment_method_name ?? row.payment_method_name ?? null,
        building_name: payment.building_name ?? row.building_name ?? null,
        room_number: payment.room_number ?? row.room_number ?? null,
    };
}
