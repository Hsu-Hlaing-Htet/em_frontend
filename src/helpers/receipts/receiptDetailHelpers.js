import { formatInvoiceMeterValue } from '@/helpers/invoices/invoiceDetailHelpers';
import { formatPaymentMethodTypeLabel } from '@/helpers/payments/paymentListHelpers';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

export function mapReceiptLineItemRows(state, currencyFormatter = formatCurrency) {
    const items = Array.isArray(state?.items) ? state.items : [];
    const shared = {
        invoice_amount: currencyFormatter(state?.invoice_amount),
        paid_amount: currencyFormatter(state?.paid_amount ?? state?.payment_amount ?? state?.amount),
        balance: currencyFormatter(state?.balance),
        payment_method_type: formatPaymentMethodTypeLabel(state?.payment_method_type),
        payment_date: formatDate(state?.payment_date) || '—',
        payment_method_name: state?.payment_method_name || '—',
    };

    if (!items.length) {
        return [{
            id: 'receipt-summary',
            description: '—',
            usage: '—',
            unit_price: '—',
            ...shared,
        }];
    }

    return items.map((item) => {
        const isMetered = Boolean(item?.is_metered);
        const unitPrice = item?.unit_price;

        return {
            id: item.id,
            description: item.description || '—',
            usage: isMetered ? formatInvoiceMeterValue(item.usage) : '—',
            unit_price: unitPrice === null || unitPrice === undefined || unitPrice === ''
                ? '—'
                : currencyFormatter(unitPrice),
            ...shared,
        };
    });
}

export function buildReceiptCustomerInfo(state) {
    return {
        name: state.customer_name,
        lines: [
            state.customer_email,
            state.customer_phone,
            state.building_name,
            state.room_number,
        ].filter((value) => hasBillingValue(value)),
    };
}

export function buildReceiptSummaryNote(state) {
    if (hasBillingValue(state.invoice_number)) {
        return `Receipt for invoice ${state.invoice_number}.`;
    }

    return '';
}
