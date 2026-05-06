import api from '@/services/api';
export function getAdminDashboard() { return api.get('/api/admin/dashboard'); }
