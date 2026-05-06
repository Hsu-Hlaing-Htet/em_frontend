import api from '@/services/api';
export function getAdminOwners() { return api.get('/api/admin/owners'); }
export function getAdminProperties(params = {}) { return api.get('/api/admin/properties', { params }); }
export function createAdminProperty(payload) { return api.post('/api/admin/properties', payload); }
export function updateAdminProperty(id, payload) { return api.put(`/api/admin/properties/${id}`, payload); }
export function deleteAdminProperty(id) { return api.delete(`/api/admin/properties/${id}`); }
