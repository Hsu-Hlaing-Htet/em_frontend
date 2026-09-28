import { defineStore } from 'pinia';
import { service } from './service';

export const useContactInquiryStore = defineStore('useContactInquiryStore', {
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
    },
});
