import api from '@/services/api';
import { endpoint } from '@/constants/endpoint';

export function loginUser(payload) {
    return api.post(endpoint.login, payload);
}

export function getCurrentUser() {
    return api.get(endpoint.me);
}

export function logoutUser() {
    return api.post(endpoint.logout);
}