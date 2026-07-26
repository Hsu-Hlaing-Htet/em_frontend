import { createBillingDocumentActions } from './createBillingDocumentActions';
import {
    downloadInvoiceDocument,
    exportInvoiceDocument,
    printInvoiceDocument,
    downloadReceiptDocument,
    exportReceiptDocument,
    printReceiptDocument,
    downloadPaymentDocument,
    exportPaymentDocument,
    printPaymentDocument,
    downloadUtilityDocument,
    exportUtilityDocument,
    printUtilityDocument,
} from '@/helpers/documents/documentOutput';
import { formatPaymentReference, formatUtilityReference } from '@/helpers/documents/billingDocumentHelpers';

export function useInvoiceDocumentActions(state, getDocument, service) {
    return createBillingDocumentActions({
        state,
        getDocument,
        getFilename: (current) => `${current.invoice_number || 'invoice'}.html`,
        printDocument: printInvoiceDocument,
        exportDocument: exportInvoiceDocument,
        downloadDocument: downloadInvoiceDocument,
        sendDocumentEmail: (current) => service.sendDocumentEmail({
            id: current.id,
            email: current.customer_email || undefined,
        }),
        messages: {
            downloadSuccess: 'Invoice document downloaded.',
            exportSuccess: 'Invoice document exported.',
            emailSuccess: 'Invoice document sent by email.',
            downloadError: 'Unable to download invoice document.',
            exportError: 'Unable to export invoice document.',
            emailError: 'Unable to send invoice document.',
        },
    });
}

export function useReceiptDocumentActions(state, getDocument, service) {
    return createBillingDocumentActions({
        state,
        getDocument,
        getFilename: (current) => `${current.receipt_number || 'receipt'}.html`,
        printDocument: printReceiptDocument,
        exportDocument: exportReceiptDocument,
        downloadDocument: downloadReceiptDocument,
        sendDocumentEmail: (current) => service.sendDocumentEmail({
            id: current.id,
            email: current.customer_email || undefined,
        }),
        messages: {
            downloadSuccess: 'Receipt document downloaded.',
            exportSuccess: 'Receipt document exported.',
            emailSuccess: 'Receipt document sent by email.',
            downloadError: 'Unable to download receipt document.',
            exportError: 'Unable to export receipt document.',
            emailError: 'Unable to send receipt document.',
        },
    });
}

export function usePaymentDocumentActions(state, getDocument, service) {
    return createBillingDocumentActions({
        state,
        getDocument,
        getFilename: (current) => `${current.payment_number || formatPaymentReference(current.id) || 'payment'}.html`,
        printDocument: printPaymentDocument,
        exportDocument: exportPaymentDocument,
        downloadDocument: downloadPaymentDocument,
        sendDocumentEmail: (current) => service.sendDocumentEmail({
            id: current.id,
            email: current.customer_email || undefined,
        }),
        messages: {
            downloadSuccess: 'Payment confirmation downloaded.',
            exportSuccess: 'Payment confirmation exported.',
            emailSuccess: 'Payment confirmation sent by email.',
            downloadError: 'Unable to download payment confirmation.',
            exportError: 'Unable to export payment confirmation.',
            emailError: 'Unable to send payment confirmation.',
        },
    });
}

export function useUtilityDocumentActions(state, getDocument, service) {
    return createBillingDocumentActions({
        state,
        getDocument,
        getFilename: (current) => `${formatUtilityReference(current) || 'utility-bill'}.html`,
        printDocument: printUtilityDocument,
        exportDocument: exportUtilityDocument,
        downloadDocument: downloadUtilityDocument,
        sendDocumentEmail: (current) => service.sendDocumentEmail({
            id: current.id,
            email: current.customer_email || undefined,
        }),
        messages: {
            downloadSuccess: 'Utility bill downloaded.',
            exportSuccess: 'Utility bill exported.',
            emailSuccess: 'Utility bill sent by email.',
            downloadError: 'Unable to download utility bill.',
            exportError: 'Unable to export utility bill.',
            emailError: 'Unable to send utility bill.',
        },
    });
}
