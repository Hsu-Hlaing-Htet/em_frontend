import api from '@/services/api';
import { endpoint } from '@/services/endpoint';

export function loginUser(payload) {
    return api.post(endpoint.login, payload);
}

export function getCurrentUser() {
    return api.get(endpoint.me);
}

export function logoutUser() {
    return api.post(endpoint.logout);
}

export function requestPasswordReset(payload) {
    return api.post(endpoint.forgotPassword, payload);
}

export function resetPassword(payload) {
    return api.post(endpoint.resetPassword, payload);
}

export function changePassword(payload) {
    return api.post(endpoint.changePassword, payload);
}