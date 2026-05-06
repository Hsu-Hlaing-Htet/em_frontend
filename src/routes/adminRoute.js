import AdminLayout from '@/layouts/AdminLayout.vue';
import { adminDashboardRoute } from '@/routes/admin/dashboardRoute';
import { adminPropertiesRoute } from '@/routes/admin/propertiesRoute';
import { adminPaymentsRoute } from '@/routes/admin/paymentsRoute';
import { adminPlaceholdersRoute } from '@/routes/admin/placeholdersRoute';

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: 'admin' },
        children: [adminDashboardRoute, adminPropertiesRoute, adminPaymentsRoute, adminPlaceholdersRoute],
    },
];
