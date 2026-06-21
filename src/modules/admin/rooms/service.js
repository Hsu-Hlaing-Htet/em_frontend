import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.rooms, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.rooms, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.rooms}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.rooms}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        try {
            const result = await api.delete(`${endpoint.rooms}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    getAllImages: async (params) => {
        try {
            const result = await api.get(endpoint.roomImages, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    addImage: async (params) => {
        const result = await api.post(endpoint.roomImages, params);
        return result.data;
    },

    uploadImage: async (file, roomId) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('room_id', roomId);
        const result = await api.post(endpoint.roomImageUpload, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return result.data;
    },

    getOneImage: async (params) => {
        try {
            const result = await api.get(`${endpoint.roomImages}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    updateImage: async (params) => {
        const result = await api.put(`${endpoint.roomImages}/${params.id}`, params);
        return result.data;
    },

    deleteImage: async (params) => {
        try {
            const result = await api.delete(`${endpoint.roomImages}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },
};

export { service };
