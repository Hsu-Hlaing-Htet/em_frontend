import {
    downloadContractDocument,
    downloadRentContractDocument,
    exportContractDocument,
    exportRentContractDocument,
    printContractDocument,
    printRentContractDocument,
} from '@/helpers/documents/documentOutput';
import { useContractDocumentActions as createActions } from './createContractDocumentActions';
import { saleService } from '@/modules/admin/sale-contracts/service';
import { rentService } from '@/modules/admin/rent-contracts/service';

const contractDocumentConfig = {
    sale: {
        fallbackName: 'sale-contract',
        downloadDocument: downloadContractDocument,
        exportDocument: exportContractDocument,
        printDocument: printContractDocument,
        sendDocumentEmail: saleService.sendDocumentEmail.bind(saleService),
    },
    rent: {
        fallbackName: 'rent-contract',
        downloadDocument: downloadRentContractDocument,
        exportDocument: exportRentContractDocument,
        printDocument: printRentContractDocument,
        sendDocumentEmail: rentService.sendDocumentEmail.bind(rentService),
    },
};

function useScopedContractDocumentActions(type, scope, state, getDocument) {
    const config = contractDocumentConfig[type];

    return createActions({
        scope,
        state,
        getDocument,
        ...config,
    });
}

export function useSaleContractDocumentActions(scope, state, getDocument) {
    return useScopedContractDocumentActions('sale', scope, state, getDocument);
}

export function useRentContractDocumentActions(scope, state, getDocument) {
    return useScopedContractDocumentActions('rent', scope, state, getDocument);
}
