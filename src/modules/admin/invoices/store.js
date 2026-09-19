import { defineStore } from 'pinia';
import { service } from './service';

export const useInvoiceStore = defineStore('useInvoiceStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        actionResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getOneResponse(state) {
            return state.detailResponse;
        },
        getActionResponse(state) {
            return state.actionResponse;
        },
    },

    actions: {
        async fetchAll(params) {
            const response = await service.getAll(params);
            this.listResponse = response;
        },
        async fetchOne(params) {
            if (!params.id) {
                return;
            }

            const response = await service.getOne(params);
            this.detailResponse = response;
        },
        async issue(params) {
            const response = await service.issue(params);
            this.actionResponse = response;
        },
        async delete(params) {
            const response = await service.delete(params);
            this.actionResponse = response;
        },
    },
});
