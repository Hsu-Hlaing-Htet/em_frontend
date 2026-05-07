import api from '@/services/api';

export function getFeaturedProperties() { return api.get('/api/public/properties/featured'); }
export function getPropertyStats() { return api.get('/api/public/properties/stats'); }
export function getPublicProperties(params = {}) { return api.get('/api/public/properties', { params }); }
export function getPublicProperty(id) { return api.get(`/api/public/properties/${id}`); }
export function submitContactMessage(payload) { return api.post('/api/public/contact', payload); }
export function submitViewingRequest(payload) { return api.post('/api/public/viewing-requests', payload); }
