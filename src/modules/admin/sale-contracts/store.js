import { defineStore } from 'pinia';
import { saleService, service } from './service';

export const useSaleContractDraftStore = defineStore('useSaleContractDraftStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        updateResponse: null,
        addResponse: null,
        deleteResponse: null,
    }),

    getters: {
        getAllResponse(state) {
            return state.listResponse;
        },
        getOneResponse(state) {
            return state.detailResponse;
        },
        getAddResponse(state) {
            return state.addResponse;
        },
        getUpdateResponse(state) {
            return state.updateResponse;
        },
        getDeleteResponse(state) {
            return state.deleteResponse;
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
        async update(params) {
            const response = await service.update(params);
            this.updateResponse = response;
        },
        async add(params) {
            const response = await service.add(params);
            this.addResponse = response;
        },
        async delete(params) {
            const response = await service.delete(params);
            this.deleteResponse = response;
        },
    },
});

export const useSaleStore = defineStore('useSaleStore', {
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
        async fetchDrafts(params) {
            const response = await saleService.getDrafts(params);
            this.listResponse = response;
        },
        async fetchApproved(params) {
            const response = await saleService.getApproved(params);
            this.listResponse = response;
        },
        async fetchDraft(params) {
            if (!params.id) {
                return;
            }

            const response = await saleService.getDraft(params);
            this.detailResponse = response;
        },
        async fetchApprovedOne(params) {
            if (!params.id) {
                return;
            }

            const response = await saleService.getApprovedOne(params);
            this.detailResponse = response;
        },
        async approve(params) {
            const response = await saleService.approve(params);
            this.actionResponse = response;
        },
        async reject(params) {
            const response = await saleService.reject(params);
            this.actionResponse = response;
        },
    },
});
