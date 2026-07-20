import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerReceiptStore = defineStore('customerReceiptStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getOneResponse(state) {
            return state.detailResponse;
        },
    },

    actions: {
        async fetchAll(params) {
            this.listResponse = await service.getReceipts(params);
        },

        async fetchOne(params) {
            this.detailResponse = await service.getReceipt(params);
        },

        downloadDocument(id, filename) {
            return service.downloadReceiptDocument(id, filename);
        },
    },
});
