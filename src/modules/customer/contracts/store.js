import { defineStore } from 'pinia';
import { service } from '../service';

export const useCustomerContractStore = defineStore('customerContractStore', {
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
            this.listResponse = await service.getContracts(params);
        },

        async fetchOne(params) {
            this.detailResponse = await service.getContract(params);
        },

        downloadDocument(id, fallbackFilename) {
            return service.downloadContractDocument(id, fallbackFilename);
        },
    },
});
