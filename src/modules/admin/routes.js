import Layout from '@/layouts/admin/App.vue';
import DashboardPage from './dashboard/Dashboard.vue';
import NotFound from '@/pages/404.vue';
import roleRoutes from './roles/routes';
import residentRoutes from './residents/routes';
import staffRoutes from './staff/routes';
import buildingRoutes from './buildings/routes';
import roomRoutes from './rooms/routes';
import utilityTypeRoutes from './utility-types/routes';
import utilityRateRoutes from './utility-rates/routes';
import chargeTypeRoutes from './charge-types/routes';
import paymentPlanRoutes from './payment-plans/routes';
import lateFeeRoutes from './late-fees/routes';
import paymentMethodRoutes from './payment-methods/routes';
import utilityRoutes from './utilities/routes';
import invoiceRoutes from './invoices/routes';
import paymentRoutes from './payments/routes';
import receiptRoutes from './receipts/routes';
import maintenanceRequestRoutes from './maintenance-requests/routes';
import saleContractRoutes from './sale-contracts/routes';
import rentContractRoutes from './rent-contracts/routes';
import profileRoutes from './profile/routes';

export const adminRoutes = [
    {
        path: '/admin',
        component: Layout,
        meta: { requiresAuth: true, allowedRoles: ['admin', 'super_admin'] },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardPage,
                meta: { title: 'Dashboard', navKey: 'dashboard' },
            },
            ...roleRoutes,
            ...residentRoutes,
            ...staffRoutes,
            ...buildingRoutes,
            ...roomRoutes,
            ...utilityTypeRoutes,
            ...utilityRateRoutes,
            ...chargeTypeRoutes,
            ...paymentPlanRoutes,
            ...lateFeeRoutes,
            ...paymentMethodRoutes,
            ...utilityRoutes,
            ...invoiceRoutes,
            ...paymentRoutes,
            ...receiptRoutes,
            ...maintenanceRequestRoutes,
            ...saleContractRoutes,
            ...rentContractRoutes,
            ...profileRoutes,
            {
                path: ':pathMatch(.*)*',
                name: 'admin-not-found',
                component: NotFound,
                meta: { title: 'Page not found' },
            },
        ],
    },
];
