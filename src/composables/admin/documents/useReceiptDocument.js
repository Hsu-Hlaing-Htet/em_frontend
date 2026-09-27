import { computed } from 'vue';
import { formatProjectDate, formatProjectDateTime, formatProjectMonthYear } from '@/utils/timezone';
import { COMPANY_INFO } from '@/helpers/documents/companyInfo';
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
    return formatProjectDate(value) || '—';
}

function extractUtilityType(description = '') {
    if (typeof description === 'string' && description.includes('—')) {
        const name = description.split('—').slice(1).join('—').trim();

        return name || null;
    }

    return null;
}

function resolveItemDescription(item = {}) {
    const slug = item.charge_type_slug;

    if (slug === 'monthly-rent') {
        return 'Rent';
    }

    if (slug === 'utility-charges') {
        return extractUtilityType(item.description) || item.charge_type_name || 'Utility';
    }

    return extractUtilityType(item.description)
        || item.charge_type_name
        || item.description
        || 'Charge';
}

function buildPaymentFor(state) {
    if (state.payment_for) {
        return state.payment_for;
    }

    const monthRaw = state.billing_month;
    let monthLabel = '';

    if (monthRaw) {
        monthLabel = formatProjectMonthYear(monthRaw);
    }

    const items = Array.isArray(state.items) ? state.items : [];
    let hasRent = false;
    let hasUtility = false;
    const otherLabels = [];

    items.forEach((item) => {
        const slug = item.charge_type_slug;

        if (slug === 'late-fee') {
            return;
        }

        if (slug === 'monthly-rent') {
            hasRent = true;

            return;
        }

        if (slug === 'utility-charges' || extractUtilityType(item.description)) {
            hasUtility = true;

            return;
        }

        const label = item.charge_type_name || item.description;

        if (label) {
            otherLabels.push(label);
        }
    });

    const parts = [];

    if (hasRent) {
        parts.push('Rent');
    }

    if (hasUtility) {
        parts.push('Utility');
    }

    if (!parts.length && otherLabels.length) {
        parts.push(otherLabels[0]);
    }

    if (!parts.length) {
        parts.push(
            state.payment_type === 'sale'
                ? 'Sale'
                : state.payment_type === 'utility'
                    ? 'Utility'
                    : state.payment_type === 'rent'
                        ? 'Rent'
                        : 'Charges',
        );
    }

    const joined = parts.join(' & ');

    return monthLabel ? `${monthLabel} ${joined}` : joined;
}

function buildChargeItems(items = []) {
    return items
        .filter((item) => item.charge_type_slug !== 'late-fee')
        .map((item) => ({
            description: resolveItemDescription(item),
            amount: formatReceiptCurrency(item.amount),
        }))
        .filter((item) => item.description);
}

export function useReceiptDocument(state) {
    const document = computed(() => {
        const receiptNumber = state.receipt_number || '—';
        const invoiceNumber = state.invoice_number || '—';
        const receiptDate = formatDisplayDate(state.issued_at || state.created_at);
        const paymentDate = formatDisplayDate(state.payment_date);
        const paymentMethod = state.payment_method_name || '—';
        const summary = state.financial_summary || null;
        const lateFee = Number(
            summary?.late_fee
            ?? state.late_fee
            ?? 0,
        );
        const subtotal = Number(
            summary?.subtotal
            ?? state.invoice_base_amount
            ?? (Number(state.invoice_amount || 0) - lateFee),
        );
        const totalAmount = Number(
            summary?.total
            ?? (
                Number.isFinite(subtotal)
                    ? Math.max(subtotal, 0) + Math.max(lateFee, 0)
                    : Number(state.invoice_amount || 0)
            ),
        );
        const paidAmount = Number(
            summary?.paid
            ?? state.amount_received
            ?? state.paid_amount
            ?? state.payment_amount
            ?? state.amount
            ?? 0,
        );
        const showChange = summary
            ? Boolean(summary.show_change)
            : Number(state.refund_amount || 0) > 0;
        const changeAmount = showChange
            ? Number(summary?.change ?? state.refund_amount ?? 0)
            : 0;
        const balanceAmount = showChange
            ? null
            : Number(summary?.balance ?? 0);
        const building = state.building_name || '';
        const room = state.room_number || '';
        const propertyRoom = building && room
            ? `${building} / ${room}`
            : (building || room || '—');

        return {
            title: 'PAYMENT RECEIPT',
            subtitle: 'THANK YOU FOR YOUR PAYMENT',
            company: {
                name: COMPANY_INFO.name,
                tagline: COMPANY_INFO.tagline,
                address: COMPANY_INFO.address,
                phone: COMPANY_INFO.phone,
                email: COMPANY_INFO.email,
                website: COMPANY_INFO.website,
            },
            header: {
                receipt_number: receiptNumber,
                date: receiptDate,
            },
            info: {
                customer_name: state.customer_name || '—',
                property_room: propertyRoom,
                invoice_number: invoiceNumber,
                payment_for: buildPaymentFor(state),
                receipt_number: receiptNumber,
                receipt_date: receiptDate,
                payment_method: paymentMethod,
                payment_date: paymentDate,
            },
            items: buildChargeItems(state.items || []),
            totals: {
                subtotal: formatReceiptCurrency(Number.isFinite(subtotal) ? Math.max(subtotal, 0) : 0),
                late_fee: formatReceiptCurrency(Math.max(lateFee, 0)),
                total: formatReceiptCurrency(totalAmount),
                paid: formatReceiptCurrency(paidAmount),
                show_change: showChange,
                change: showChange ? formatReceiptCurrency(changeAmount) : null,
                balance: showChange ? null : formatReceiptCurrency(balanceAmount ?? 0),
            },
            confirmation: {
                title: 'Payment received successfully.',
                message: 'This receipt confirms that the payment has been recorded successfully.',
            },
            footer: {
                left: COMPANY_INFO.name,
                right: 'System-generated receipt • No signature required',
            },
            customerInfo: buildReceiptCustomerInfo(state),
            summaryNote: buildReceiptSummaryNote(state),
            amountReceived: {
                label: 'Paid',
                amount: formatReceiptCurrency(paidAmount),
            },
        };
    });

    return { document };
}
