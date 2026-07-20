import logoUrl from '@/assets/images/logo-dark.jpg';
import { downloadBlob } from '@/utils/downloadFile';
import { renderDocumentPage } from './documentLayout';
import {
    getContractDocumentMeta,
    renderContractDocumentBody,
    renderContractDocumentLead,
} from './renderContractDocument';
import {
    getRentContractDocumentMeta,
    renderRentContractDocumentBody,
    renderRentContractDocumentLead,
} from './renderRentContractDocument';
import {
    getBillingDocumentMeta,
    renderInvoiceDocumentBody,
    renderInvoiceDocumentLead,
    renderReceiptDocumentBody,
    renderReceiptDocumentLead,
    renderUtilityDocumentBody,
    renderUtilityDocumentLead,
    renderPaymentDocumentBody,
    renderPaymentDocumentLead,
} from './renderBillingDocument';
import { renderListDocumentBody } from './renderListDocument';

function createBillingDocumentHandlers(renderPage) {
    return {
        print: (document) => printDocumentHtml(renderPage(document)),
        export: (document, filename) => {
            const html = renderPage(document);

            if (!exportDocumentHtml(html)) {
                downloadDocumentHtml(html, filename);
            }

            return true;
        },
        download: (document, filename) => downloadDocumentHtml(renderPage(document), filename),
    };
}

export { logoUrl as DOCUMENT_LOGO_URL };

export function renderContractDocumentPage(document) {
    const contractNo = document?.header?.contractNo || 'sale-contract';

    return renderDocumentPage({
        pageTitle: `Property Sale Agreement ${contractNo}`,
        documentTitle: 'Property Sale Agreement',
        meta: getContractDocumentMeta(document),
        leadHtml: renderContractDocumentLead(),
        bodyHtml: renderContractDocumentBody(document),
        logoSrc: logoUrl,
    });
}

export function renderListDocumentPage({ title, columns, rows }) {
    const generatedAt = new Date().toLocaleString();

    return renderDocumentPage({
        pageTitle: title,
        documentTitle: title,
        meta: [{ label: 'Generated', value: generatedAt }],
        bodyHtml: renderListDocumentBody({ columns, rows }),
        logoSrc: logoUrl,
    });
}

function openHtmlWindow(html, { print = false } = {}) {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        return false;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    if (!print) {
        return true;
    }

    const closePrintWindow = () => {
        printWindow.close();
    };

    if ('onafterprint' in printWindow) {
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = closePrintWindow;
        };
    } else {
        printWindow.onload = () => {
            printWindow.print();
            window.setTimeout(closePrintWindow, 500);
        };
    }

    return true;
}

export function printDocumentHtml(html) {
    return openHtmlWindow(html, { print: true });
}

export function exportDocumentHtml(html) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const exportWindow = window.open(url, '_blank');

    if (!exportWindow) {
        return false;
    }

    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);

    return true;
}

export function downloadDocumentHtml(html, filename) {
    downloadBlob(
        filename,
        new Blob([html], { type: 'text/html;charset=utf-8' }),
    );
}

export function printContractDocument(document) {
    return printDocumentHtml(renderContractDocumentPage(document));
}

export function exportContractDocument(document, filename) {
    const html = renderContractDocumentPage(document);

    if (!exportDocumentHtml(html)) {
        downloadDocumentHtml(html, filename);
    }

    return true;
}

export function downloadContractDocument(document, filename) {
    downloadDocumentHtml(renderContractDocumentPage(document), filename);
}

export function renderRentContractDocumentPage(document) {
    const contractNo = document?.header?.contractNo || 'rent-contract';

    return renderDocumentPage({
        pageTitle: `Property Rent Agreement ${contractNo}`,
        documentTitle: 'Property Rent Agreement',
        meta: getRentContractDocumentMeta(document),
        leadHtml: renderRentContractDocumentLead(),
        bodyHtml: renderRentContractDocumentBody(document),
        logoSrc: logoUrl,
    });
}

export function printRentContractDocument(document) {
    return printDocumentHtml(renderRentContractDocumentPage(document));
}

export function exportRentContractDocument(document, filename) {
    const html = renderRentContractDocumentPage(document);

    if (!exportDocumentHtml(html)) {
        downloadDocumentHtml(html, filename);
    }

    return true;
}

export function downloadRentContractDocument(document, filename) {
    downloadDocumentHtml(renderRentContractDocumentPage(document), filename);
}

export function renderInvoiceDocumentPage(document) {
    const referenceNo = document?.header?.referenceNo || 'invoice';

    return renderDocumentPage({
        pageTitle: `Tax Invoice ${referenceNo}`,
        documentTitle: 'Tax Invoice',
        meta: getBillingDocumentMeta(document, 'Invoice No.'),
        leadHtml: renderInvoiceDocumentLead(),
        bodyHtml: renderInvoiceDocumentBody(document),
        logoSrc: logoUrl,
    });
}

export function renderReceiptDocumentPage(document) {
    const referenceNo = document?.header?.referenceNo || 'receipt';

    return renderDocumentPage({
        pageTitle: `Payment Receipt ${referenceNo}`,
        documentTitle: 'Payment Receipt',
        meta: getBillingDocumentMeta(document, 'Receipt No.'),
        leadHtml: renderReceiptDocumentLead(),
        bodyHtml: renderReceiptDocumentBody(document),
        logoSrc: logoUrl,
    });
}

const invoiceDocumentHandlers = createBillingDocumentHandlers(renderInvoiceDocumentPage);
const receiptDocumentHandlers = createBillingDocumentHandlers(renderReceiptDocumentPage);

export function printInvoiceDocument(document) {
    return invoiceDocumentHandlers.print(document);
}

export function exportInvoiceDocument(document, filename) {
    return invoiceDocumentHandlers.export(document, filename);
}

export function downloadInvoiceDocument(document, filename) {
    return invoiceDocumentHandlers.download(document, filename);
}

export function printReceiptDocument(document) {
    return receiptDocumentHandlers.print(document);
}

export function exportReceiptDocument(document, filename) {
    return receiptDocumentHandlers.export(document, filename);
}

export function downloadReceiptDocument(document, filename) {
    return receiptDocumentHandlers.download(document, filename);
}

export function renderUtilityDocumentPage(document) {
    const referenceNo = document?.header?.referenceNo || 'utility-bill';

    return renderDocumentPage({
        pageTitle: `Utility Bill ${referenceNo}`,
        documentTitle: 'Utility Bill',
        meta: getBillingDocumentMeta(document, 'Bill No.'),
        leadHtml: renderUtilityDocumentLead(),
        bodyHtml: renderUtilityDocumentBody(document),
        logoSrc: logoUrl,
    });
}

export function renderPaymentDocumentPage(document) {
    const referenceNo = document?.header?.referenceNo || 'payment';

    return renderDocumentPage({
        pageTitle: `Payment Confirmation ${referenceNo}`,
        documentTitle: 'Payment Confirmation',
        meta: getBillingDocumentMeta(document, 'Payment Ref.'),
        leadHtml: renderPaymentDocumentLead(),
        bodyHtml: renderPaymentDocumentBody(document),
        logoSrc: logoUrl,
    });
}

const utilityDocumentHandlers = createBillingDocumentHandlers(renderUtilityDocumentPage);
const paymentDocumentHandlers = createBillingDocumentHandlers(renderPaymentDocumentPage);

export function printUtilityDocument(document) {
    return utilityDocumentHandlers.print(document);
}

export function exportUtilityDocument(document, filename) {
    return utilityDocumentHandlers.export(document, filename);
}

export function downloadUtilityDocument(document, filename) {
    return utilityDocumentHandlers.download(document, filename);
}

export function printPaymentDocument(document) {
    return paymentDocumentHandlers.print(document);
}

export function exportPaymentDocument(document, filename) {
    return paymentDocumentHandlers.export(document, filename);
}

export function downloadPaymentDocument(document, filename) {
    return paymentDocumentHandlers.download(document, filename);
}

export function printListDocument({ title, columns, rows }) {
    return printDocumentHtml(renderListDocumentPage({ title, columns, rows }));
}
