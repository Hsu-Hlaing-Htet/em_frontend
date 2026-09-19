import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerPaymentStore = defineStore('customerPaymentStore', {
    state: () => ({
        listResponse: null,
        oneResponse: null,
        submitResponse: null,
        proofResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getOneResponse(state) {
            return state.oneResponse;
        },
        getSubmitResponse(state) {
            return state.submitResponse;
        },
    },

    actions: {
        async fetchAll(params) {
            this.listResponse = await service.getPayments(params);
        },

        async fetchOne(params) {
            this.oneResponse = await service.getPayment(params);
        },

        async submitPayment(params) {
            this.submitResponse = await service.submitPayment(params);
        },

        async uploadProof(params) {
            this.proofResponse = await service.uploadPaymentProof(params);
        },
    },
});
