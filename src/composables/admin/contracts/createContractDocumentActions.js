import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';

export function createContractDocumentActions({
    scope,
    getContractId,
    getContractNo,
    getCustomerEmail,
    getDocument,
    fallbackName,
    downloadDocument,
    exportDocument,
    printDocument,
    viewDocument,
    sendDocumentEmail,
}) {
    const fallbackHtmlFilename = () => `${getContractNo() || fallbackName}.html`;

    const downloadPdf = async () => {
        const id = getContractId();
        const document = getDocument();

        if (!id || !document) {
            return;
        }

        try {
            await downloadDocument(document);

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Contract document downloaded.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to download contract document.');
        }
    };

    const exportPdf = async () => {
        const document = getDocument();

        if (!document) {
            return;
        }

        try {
            exportDocument(document, fallbackHtmlFilename());

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Contract document exported.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to export contract document.');
        }
    };

    const printContract = () => {
        const document = getDocument();

        if (!document) {
            return;
        }

        printDocument(document);
    };

    const viewContract = () => {
        const document = getDocument();

        if (document) {
            viewDocument(document);
        }
    };

    const sendEmail = async () => {
        const id = getContractId();

        if (!id) {
            return;
        }

        try {
            const response = await sendDocumentEmail(scope, id, {
                email: getCustomerEmail() || undefined,
            });

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || 'Contract document sent by email.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to send contract document.');
        }
    };

    return {
        downloadPdf,
        exportPdf,
        printContract,
        viewContract,
        sendEmail,
    };
}

export function useContractDocumentActions({
    scope,
    state,
    getDocument,
    fallbackName,
    downloadDocument,
    exportDocument,
    printDocument,
    viewDocument,
    sendDocumentEmail,
}) {
    const resolveDocument = typeof getDocument === 'function'
        ? getDocument
        : () => getDocument?.value;

    return createContractDocumentActions({
        scope,
        getContractId: () => state.id,
        getContractNo: () => state.contract_no,
        getCustomerEmail: () => state.customer_email,
        getDocument: resolveDocument,
        fallbackName,
        downloadDocument,
        exportDocument,
        printDocument,
        viewDocument,
        sendDocumentEmail,
    });
}
