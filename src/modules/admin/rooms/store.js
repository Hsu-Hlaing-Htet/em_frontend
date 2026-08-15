import { defineStore } from 'pinia';
import { service } from './service';

export const useRoomStore = defineStore('useRoomStore', {
    state: () => ({
        listResponse: null,
        detailResponse: null,
        updateResponse: null,
        addResponse: null,
        deleteResponse: null,
        bulkDeleteResponse: null,
        imageListResponse: null,
        imageDetailResponse: null,
        imageAddResponse: null,
        imageUpdateResponse: null,
        imageDeleteResponse: null,
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
        getBulkDeleteResponse(state) {
            return state.bulkDeleteResponse;
        },
        getImageListResponse(state) {
            return state.imageListResponse;
        },
        getImageDetailResponse(state) {
            return state.imageDetailResponse;
        },
        getImageAddResponse(state) {
            return state.imageAddResponse;
        },
        getImageUpdateResponse(state) {
            return state.imageUpdateResponse;
        },
        getImageDeleteResponse(state) {
            return state.imageDeleteResponse;
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
        async bulkDelete(params) {
            const response = await service.bulkDelete(params);
            this.bulkDeleteResponse = response;
        },
        async deactivate(params) {
            this.updateResponse = await service.deactivate(params);
        },
        async activate(params) {
            this.updateResponse = await service.activate(params);
        },
        async fetchAllImages(params) {
            const response = await service.getAllImages(params);
            this.imageListResponse = response;
        },
        async fetchOneImage(params) {
            if (!params.id) {
                return;
            }

            const response = await service.getOneImage(params);
            this.imageDetailResponse = response;
        },
        async addImage(params) {
            const response = await service.addImage(params);
            this.imageAddResponse = response;
        },
        async uploadImage(file, roomId) {
            return service.uploadImage(file, roomId);
        },
        async updateImage(params) {
            const response = await service.updateImage(params);
            this.imageUpdateResponse = response;
        },
        async deleteImage(params) {
            const response = await service.deleteImage(params);
            this.imageDeleteResponse = response;
        },
    },
});
