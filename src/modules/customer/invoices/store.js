import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerInvoiceStore = defineStore('customerInvoiceStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        paymentResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getOneResponse(state) {
            return state.detailResponse;
        },
        getPaymentResponse(state) {
            return state.paymentResponse;
        },
    },

    actions: {
        async fetchAll(params) {
            this.listResponse = await service.getInvoices(params);
        },

        async fetchOne(params) {
            this.detailResponse = await service.getInvoice(params);
        },

        downloadDocument(id, filename) {
            return service.downloadInvoiceDocument(id, filename);
        },
    },
});
