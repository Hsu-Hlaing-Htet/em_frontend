import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerPaymentStore = defineStore('customerPaymentStore', {
    state: () => ({
        listResponse: null,
        submitResponse: null,
        proofResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getSubmitResponse(state) {
            return state.submitResponse;
        },
    },

    actions: {
        async fetchAll(params) {
            this.listResponse = await service.getPayments(params);
        },

        async submitPayment(params) {
            this.submitResponse = await service.submitPayment(params);
        },

        async uploadProof(params) {
            this.proofResponse = await service.uploadPaymentProof(params);
        },
    },
});
