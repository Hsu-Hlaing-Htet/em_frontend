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
    { label: 'Previous Unit', key: 'previous_reading', align: 'right' },
    { label: 'Current Unit', key: 'current_reading', align: 'right' },
    { label: 'Usage', key: 'usage', align: 'right' },
    { label: 'Unit Price', key: 'unit_price', align: 'right' },
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
    { label: 'Invoice Amount', key: 'invoice_amount', align: 'right' },
    { label: 'Previously Paid', key: 'paid_amount', align: 'right' },
    { label: 'Current Balance', key: 'balance', align: 'right' },
    { label: 'Paid Amount', key: 'entered_paid_amount', align: 'right' },
    { label: 'Remaining Balance', key: 'remaining_balance', align: 'right' },
    { label: 'Payment Type', key: 'payment_method_type', align: 'left' },
    { label: 'Payment Date', key: 'payment_date', align: 'left' },
    { label: 'Payment Method', key: 'payment_method_name', align: 'left' },
];

export const receiptLineItemColumns = [
    { label: 'Description', key: 'description', align: 'left', width: '12%' },
    { label: 'Usage', key: 'usage', align: 'right', width: '7%' },
    { label: 'Unit Price', key: 'unit_price', align: 'right', width: '9%' },
    { label: 'Invoice Amount', key: 'invoice_amount', align: 'right', width: '11%' },
    { label: 'Paid Amount', key: 'paid_amount', align: 'right', width: '10%' },
    { label: 'Balance', key: 'balance', align: 'right', width: '9%' },
    { label: 'Payment Type', key: 'payment_method_type', align: 'left', width: '10%' },
    { label: 'Payment Date', key: 'payment_date', align: 'left', width: '14%' },
    { label: 'Payment Method', key: 'payment_method_name', align: 'left', width: '18%' },
];

export const receiptLineItemRowspanKeys = [
    'invoice_amount',
    'paid_amount',
    'balance',
    'payment_method_type',
    'payment_date',
    'payment_method_name',
];
