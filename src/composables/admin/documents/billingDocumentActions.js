import { createDocumentActions } from './createDocumentActions';
import {
    printDocumentHtml,
    exportDocumentHtml,
    downloadDocumentHtml,
    exportReceiptDocument,
    printReceiptDocument,
    viewReceiptDocument,
    exportUtilityDocument,
    downloadUtilityDocumentPdf,
    printUtilityDocument,
    viewUtilityDocument,
} from '@/helpers/documents/documentOutput';
import { formatUtilityReference } from '@/helpers/documents/billingDocumentHelpers';
import { createBillingDocumentActions } from './createBillingDocumentActions';

export function useInvoiceDocumentActions(state, getHtml, service) {
    const resolveHtml = typeof getHtml === 'function'
        ? getHtml
        : () => getHtml?.value;

    return createDocumentActions({
        getDocument: resolveHtml,
        getFilename: () => `${state.invoice_number || 'invoice'}.html`,
        printDocument: printDocumentHtml,
        viewDocument: exportDocumentHtml,
        exportDocument: (html, filename) => {
            if (!exportDocumentHtml(html)) {
                downloadDocumentHtml(html, filename);
            }

            return true;
        },
        downloadDocument: () => service.downloadDocument({
            id: state.id,
            fallbackFilename: `${state.invoice_number || 'invoice'}.pdf`,
        }),
        sendEmail: () => service.sendDocumentEmail({
            id: state.id,
            email: state.customer_email || undefined,
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
        viewDocument: viewReceiptDocument,
        exportDocument: exportReceiptDocument,
        downloadDocument: (current) => service.downloadDocument({
            id: current.id,
            fallbackFilename: `${current.receipt_number || 'receipt'}.pdf`,
        }),
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

export function useUtilityDocumentActions(state, getDocument, service) {
    return createBillingDocumentActions({
        state,
        getDocument,
        getFilename: (current) => `${formatUtilityReference(current) || 'utility-bill'}.html`,
        printDocument: printUtilityDocument,
        viewDocument: viewUtilityDocument,
        exportDocument: exportUtilityDocument,
        downloadDocument: () => downloadUtilityDocumentPdf(getDocument()),
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
