import api from '@/services/api';

const publicEndpoint = {
    aiPropertyAsk: 'public/ai/property/ask',
    properties: 'public/properties',
    propertiesFeatured: 'public/properties/featured',
    propertiesStats: 'public/properties/stats',
    contact: 'public/contact',
};

export function askPropertyQuestion(payload) {
    return api.post(publicEndpoint.aiPropertyAsk, payload);
}

export function getFeaturedProperties() {
    return api.get(publicEndpoint.propertiesFeatured);
}

export function getPropertyStats() {
    return api.get(publicEndpoint.propertiesStats);
}

export function getPublicProperties(params = {}) {
    return api.get(publicEndpoint.properties, { params });
}

export function getPublicProperty(id, params = {}) {
    return api.get(`${publicEndpoint.properties}/${id}`, { params });
}

export function submitContactMessage(payload) {
    return api.post(publicEndpoint.contact, payload);
}
