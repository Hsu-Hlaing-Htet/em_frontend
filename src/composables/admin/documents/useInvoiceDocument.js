import { computed } from 'vue';
import { formatCurrency as formatAppCurrency } from '@/helpers/documents/billingDocumentHelpers';
import { COMPANY_INFO } from '@/helpers/documents/companyInfo';
import { getStatusLabel } from '@/utils/formatter';
import {
    formatBillingPeriod,
    mapInvoiceLineItemRow,
} from '@/helpers/invoices/invoiceDetailHelpers';
import { buildInvoiceCustomerInfo } from '@/helpers/documents/renderInvoiceDocument';

function formatInvoiceCurrency(value, decimals = 0) {
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

    const raw = typeof value === 'string' && !value.includes('T')
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
    }).replace(/ /g, ' ');
}

function buildNotes(invoiceNumber, dueDate) {
    return `Please reference ${invoiceNumber || '—'} when making payment. Payment is due by ${dueDate || '—'}. Late fees may apply after the due date.`;
}

export function useInvoiceDocument(state) {
    const totalDueAmount = computed(() => (
        Number(state.total_amount || 0) + Number(state.late_fee || 0)
    ));

    const lateFeeAmount = computed(() => Number(state.late_fee || 0));

    const document = computed(() => {
        const invoiceNumber = state.invoice_number || '—';
        const issueDate = formatDisplayDate(state.issued_date || state.created_at);
        const dueDate = formatDisplayDate(state.due_date);
        const amountDue = formatInvoiceCurrency(totalDueAmount.value);

        return {
            title: 'INVOICE',
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
                invoice_number: invoiceNumber,
                issue_date: issueDate,
                due_date: dueDate,
                billing_period: formatBillingPeriod(state),
                status: getStatusLabel(state.status || state.payment_status || state.display_status),
                amount_due: amountDue,
            },
            items: (state.items || []).map((item) => {
                const isMetered = Boolean(item?.is_metered);
                const row = mapInvoiceLineItemRow(item, (value) => formatInvoiceCurrency(value));

                return {
                    description: row.description,
                    previous_reading: row.previous_reading,
                    current_reading: row.current_reading,
                    usage: row.usage,
                    unit_price: isMetered
                        ? (item?.unit_price === null || item?.unit_price === undefined || item?.unit_price === ''
                            ? '—'
                            : formatInvoiceCurrency(item.unit_price, 2))
                        : '—',
                    amount: row.amount,
                };
            }),
            totals: {
                subtotal: formatInvoiceCurrency(state.total_amount),
                overdue_days: Number(state.overdue_days || 0),
                late_fee: formatInvoiceCurrency(lateFeeAmount.value),
                amount_due: amountDue,
            },
            notes: buildNotes(invoiceNumber, dueDate),
            confidentialNotice: 'This invoice is intended solely for the named recipient and may contain confidential information.',
            header: {
                referenceNo: state.invoice_number,
                issuedDate: state.issued_date || state.created_at || '',
            },
            customerInfo: buildInvoiceCustomerInfo(state),
            totalDue: {
                label: 'Amount Due',
                amount: amountDue,
            },
            amountSummary: [
                Number(state.paid_amount) > 0
                    ? { label: 'Paid', value: formatAppCurrency(state.paid_amount) }
                    : null,
                Number(state.remaining_balance) > 0
                    ? { label: 'Balance', value: formatAppCurrency(state.remaining_balance) }
                    : null,
            ].filter(Boolean),
        };
    });

    return { document };
}
