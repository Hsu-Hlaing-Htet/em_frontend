import { defineStore } from 'pinia';
import { service } from './service';

export const useUserStore = defineStore('useUserStore', {
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
            this.listResponse = await service.getAll(params);
        },
        async fetchOne(params) {
            if (!params.id) {
                return;
            }

            this.detailResponse = await service.getOne(params);
        },
        async update(params) {
            this.updateResponse = await service.update(params);
        },
        async add(params) {
            this.addResponse = await service.add(params);
        },
        async delete(params) {
            this.deleteResponse = await service.delete(params);
        },
    },
});
