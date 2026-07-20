import { createDocumentActions } from './createDocumentActions';

export function createBillingDocumentActions({
    state,
    getDocument,
    getFilename,
    printDocument,
    exportDocument,
    downloadDocument,
    sendDocumentEmail,
    messages = {},
}) {
    const resolveDocument = typeof getDocument === 'function'
        ? getDocument
        : () => getDocument?.value;

    return createDocumentActions({
        getDocument: resolveDocument,
        getFilename: () => getFilename(state),
        printDocument,
        exportDocument,
        downloadDocument,
        sendEmail: () => sendDocumentEmail(state),
        messages,
    });
}
