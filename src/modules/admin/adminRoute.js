import AdminLayout from '@/public/layouts/AdminLayout.vue';
import { adminDashboardRoute } from './dashboard/dashboardRoute';
import { adminPropertiesRoute } from './properties/propertiesRoute';
import { adminPaymentsRoute } from './payments/paymentsRoute';
import { adminPlaceholdersRoute } from './placeholders/placeholdersRoute';

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            adminDashboardRoute,
            adminPropertiesRoute,
            adminPaymentsRoute,
            adminPlaceholdersRoute,
        ],
    },
];
