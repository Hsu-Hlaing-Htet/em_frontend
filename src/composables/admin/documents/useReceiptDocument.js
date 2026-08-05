import { computed } from 'vue';
import { COMPANY_INFO } from '@/helpers/documents/companyInfo';
import {
    formatInvoiceMeterValue,
    mapInvoiceLineItemRow,
} from '@/helpers/invoices/invoiceDetailHelpers';
import {
    buildReceiptCustomerInfo,
    buildReceiptSummaryNote,
} from '@/helpers/receipts/receiptDetailHelpers';

function formatReceiptCurrency(value, decimals = 0) {
    const amount = Number(value || 0);

    if (!Number.isFinite(amount)) {
        return '—';
    }

    return `MMK ${amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}

function formatDisplayDate(value) {
    if (!value) {
        return '—';
    }

    const raw = typeof value === 'string' && !value.includes('T') && value.length <= 10
        ? `${value.slice(0, 10)}T00:00:00`
        : value;
    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function buildNotes(invoiceNumber, paymentMethod, paymentDate) {
    return `Payment received for invoice ${invoiceNumber || '—'} via ${paymentMethod || '—'} on ${paymentDate || '—'}. Thank you for your payment.`;
}

export function useReceiptDocument(state) {
    const document = computed(() => {
        const receiptNumber = state.receipt_number || '—';
        const invoiceNumber = state.invoice_number || '—';
        const issueDate = formatDisplayDate(state.issued_at || state.created_at);
        const paymentDate = formatDisplayDate(state.payment_date);
        const paymentMethod = state.payment_method_name || '—';
        const paidAmount = state.paid_amount ?? state.payment_amount ?? state.amount;
        const invoiceTotal = Number(state.invoice_amount || 0);
        const amountReceived = formatReceiptCurrency(paidAmount);

        return {
            title: 'RECEIPT',
            company: {
                name: COMPANY_INFO.name,
                tagline: COMPANY_INFO.tagline,
                address: COMPANY_INFO.address,
                phone: COMPANY_INFO.phone,
                email: COMPANY_INFO.email,
                website: COMPANY_INFO.website,
            },
            billTo: {
                name: state.customer_name || '—',
                email: state.customer_email || '—',
                phone: state.customer_phone || '—',
            },
            property: {
                building: state.building_name || '—',
                room: state.room_number || '—',
            },
            summary: {
                receipt_number: receiptNumber,
                issue_date: issueDate,
                invoice_number: invoiceNumber,
                payment_date: paymentDate,
                amount_received: amountReceived,
            },
            items: (state.items || []).map((item) => {
                const isMetered = Boolean(item?.is_metered);
                const row = mapInvoiceLineItemRow(item, (value) => formatReceiptCurrency(value));

                return {
                    description: row.description,
                    previous_reading: isMetered
                        ? formatInvoiceMeterValue(item.previous_reading)
                        : '—',
                    current_reading: isMetered
                        ? formatInvoiceMeterValue(item.current_reading)
                        : '—',
                    usage: row.usage,
                    unit_price: isMetered
                        ? (item?.unit_price === null || item?.unit_price === undefined || item?.unit_price === ''
                            ? '—'
                            : formatReceiptCurrency(item.unit_price, 2))
                        : '—',
                    amount: row.amount,
                };
            }),
            totals: {
                invoice_total: formatReceiptCurrency(invoiceTotal),
                amount_received: amountReceived,
                balance: formatReceiptCurrency(state.balance),
            },
            notes: buildNotes(invoiceNumber, paymentMethod, paymentDate),
            confidentialNotice: 'This receipt is intended solely for the named recipient and may contain confidential information.',
            // Legacy fields used by ShowReceipt helpers / actions.
            header: {
                referenceNo: state.receipt_number,
                issuedDate: state.issued_at || state.created_at || '',
            },
            customerInfo: buildReceiptCustomerInfo(state),
            summaryNote: buildReceiptSummaryNote(state),
            amountReceived: {
                label: 'Amount Received',
                amount: amountReceived,
            },
        };
    });

    return { document };
}
