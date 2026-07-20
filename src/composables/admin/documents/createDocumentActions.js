import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';

export function createDocumentActions({
    getDocument,
    getFilename,
    printDocument,
    exportDocument,
    downloadDocument,
    sendEmail,
    messages = {},
}) {
    const {
        downloadSuccess = 'Document downloaded.',
        exportSuccess = 'Document exported.',
        emailSuccess = 'Document sent by email.',
        downloadError = 'Unable to download document.',
        exportError = 'Unable to export document.',
        emailError = 'Unable to send document.',
    } = messages;

    const downloadPdf = async () => {
        const document = getDocument();

        if (!document) {
            return;
        }

        try {
            downloadDocument(document, getFilename());

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: downloadSuccess,
            });
        } catch (error) {
            showApiErrorToast(error, downloadError);
        }
    };

    const exportPdf = async () => {
        const document = getDocument();

        if (!document) {
            return;
        }

        try {
            exportDocument(document, getFilename());

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: exportSuccess,
            });
        } catch (error) {
            showApiErrorToast(error, exportError);
        }
    };

    const printPdf = () => {
        const document = getDocument();

        if (!document) {
            return;
        }

        printDocument(document);
    };

    const sendDocumentEmail = async () => {
        try {
            const response = await sendEmail();

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response?.message || emailSuccess,
            });
        } catch (error) {
            showApiErrorToast(error, emailError);
        }
    };

    return {
        downloadPdf,
        exportPdf,
        printPdf,
        sendEmail: sendDocumentEmail,
    };
}
