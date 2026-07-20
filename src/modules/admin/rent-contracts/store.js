import { defineStore } from 'pinia';
import { rentService, service } from './service';

export const useRentContractDraftStore = defineStore('useRentContractDraftStore', {
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

export const useRentStore = defineStore('useRentStore', {
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
            const response = await rentService.getDrafts(params);
            this.listResponse = response;
        },
        async fetchActive(params) {
            const response = await rentService.getActive(params);
            this.listResponse = response;
        },
        async fetchDraft(params) {
            if (!params.id) {
                return;
            }

            const response = await rentService.getDraft(params);
            this.detailResponse = response;
        },
        async fetchActiveOne(params) {
            if (!params.id) {
                return;
            }

            const response = await rentService.getActiveOne(params);
            this.detailResponse = response;
        },
        async approve(params) {
            const response = await rentService.approve(params);
            this.actionResponse = response;
        },
        async reject(params) {
            const response = await rentService.reject(params);
            this.actionResponse = response;
        },
    },
});
