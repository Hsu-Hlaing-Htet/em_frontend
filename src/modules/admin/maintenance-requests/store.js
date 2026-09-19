import { defineStore } from 'pinia';
import { service } from './service';

export const useMaintenanceRequestStore = defineStore('useMaintenanceRequestStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        updateResponse: null,
        addResponse: null,
        deleteResponse: null,
        actionResponse: null,
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
        async start(params) {
            const response = await service.start(params);
            this.actionResponse = response;
        },
        async accept(params) {
            const response = await service.accept(params);
            this.actionResponse = response;
        },
        async assign(params) {
            const response = await service.assign(params);
            this.actionResponse = response;
        },
        async complete(params) {
            const response = await service.complete(params);
            this.actionResponse = response;
        },
        async reject(params) {
            const response = await service.reject(params);
            this.actionResponse = response;
        },
        async cancel(params) {
            const response = await service.cancel(params);
            this.actionResponse = response;
        },
    },
});
