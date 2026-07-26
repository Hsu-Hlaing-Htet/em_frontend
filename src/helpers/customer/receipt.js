export function mapCustomerReceipt(row = {}) {
    const payment = row.payment || {};

    return {
        ...row,
        payment_amount: payment.amount ?? row.payment_amount ?? null,
        payment_number: payment.payment_number ?? row.payment_number ?? null,
        payment_date: payment.payment_date ?? row.payment_date ?? null,
        payment_method_name: payment.payment_method_name ?? row.payment_method_name ?? null,
        building_name: payment.building_name ?? row.building_name ?? null,
        room_number: payment.room_number ?? row.room_number ?? null,
    };
}
