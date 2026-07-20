import api from '@/services/api';

const publicEndpoint = {
    properties: 'public/properties',
    propertiesFeatured: 'public/properties/featured',
    propertiesStats: 'public/properties/stats',
    contact: 'public/contact',
    viewingRequests: 'public/viewing-requests',
};

export function getFeaturedProperties() {
    return api.get(publicEndpoint.propertiesFeatured);
}

export function getPropertyStats() {
    return api.get(publicEndpoint.propertiesStats);
}

export function getPublicProperties(params = {}) {
    return api.get(publicEndpoint.properties, { params });
}

export function getPublicProperty(id) {
    return api.get(`${publicEndpoint.properties}/${id}`);
}

export function submitContactMessage(payload) {
    return api.post(publicEndpoint.contact, payload);
}

export function submitViewingRequest(payload) {
    return api.post(publicEndpoint.viewingRequests, payload);
}
