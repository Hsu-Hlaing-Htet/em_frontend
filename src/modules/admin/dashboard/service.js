import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    get: async () => {
        try {
            const result = await api.get(endpoint.dashboard);
            return result.data;
        } catch {
            return null;
        }
    },
};

export { service };
