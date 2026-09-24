import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

function appendPaymentMethodFormData(formData, params) {
    const fields = [
        'name',
        'type',
        'account_name',
        'account_number',
        'phone_number',
        'instructions',
        'status',
    ];

    fields.forEach((field) => {
        if (params[field] === undefined || params[field] === null) {
            return;
        }

        formData.append(field, String(params[field]));
    });

    if (params.remove_qr_image) {
        formData.append('remove_qr_image', '1');
    }

    if (params.qr_image instanceof File) {
        formData.append('qr_image', params.qr_image);
    }
}

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.paymentMethods, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const formData = new FormData();
        appendPaymentMethodFormData(formData, params);
        const result = await api.post(endpoint.paymentMethods, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.paymentMethods}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        // List status toggle is a light JSON update (no file / type-specific fields).
        if (!params.qr_image && !params.remove_qr_image && params.type === undefined
            && params.phone_number === undefined
            && params.account_name === undefined && params.instructions === undefined) {
            const result = await api.put(`${endpoint.paymentMethods}/${params.id}`, {
                name: params.name,
                status: params.status,
            });
            return result.data;
        }

        const formData = new FormData();
        appendPaymentMethodFormData(formData, params);

        const result = await api.post(`${endpoint.paymentMethods}/${params.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.paymentMethods}/${params.id}`);
        return result.data;
    },
};

export { service };
