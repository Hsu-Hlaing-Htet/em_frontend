export const utilityReadingColumns = [
    { label: 'Utility Type', key: 'utility_type_name', align: 'left' },
    { label: 'Previous Unit', key: 'previous_reading', align: 'right' },
    { label: 'Current Unit', key: 'current_reading', align: 'right' },
    { label: 'Usage', key: 'usage', align: 'right' },
    { label: 'Unit Price', key: 'unit_price', align: 'right' },
    { label: 'Amount', key: 'amount', align: 'right' },
];

export const invoiceLineItemColumns = [
    { label: 'Description', key: 'description', align: 'left' },
    { label: 'Charge Type', key: 'charge_type_name', align: 'left' },
    { label: 'Amount', key: 'amount', align: 'right' },
];

export const invoicePaymentHistoryColumns = [
    { label: 'Payment ID', key: 'id', align: 'left' },
    { label: 'Payment Date', key: 'payment_date', align: 'left' },
    { label: 'Amount', key: 'amount', align: 'right' },
    { label: 'Method', key: 'payment_method_name', align: 'left' },
    { label: 'Status', key: 'status', align: 'left' },
];

export const paymentDetailColumns = [
    { label: 'Invoice No', key: 'invoice_number', align: 'left' },
    { label: 'Payment Date', key: 'payment_date', align: 'left' },
    { label: 'Payment Method', key: 'payment_method_name', align: 'left' },
    { label: 'Paid Amount', key: 'amount', align: 'right' },
    { label: 'Reference No', key: 'reference_number', align: 'left' },
    { label: 'Status', key: 'status', align: 'left' },
];
