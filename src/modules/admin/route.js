import Layout from './layouts/App.vue';
import DashboardPage from './dashboard/Dashboard.vue';
import NotFound from '@/pages/NotFound.vue';
import roleRoutes from './roles/route';
import residentRoutes from './residents/route';
import staffRoutes from './staff/route';
import buildingRoutes from './buildings/route';
import roomRoutes from './rooms/route';
import utilityTypeRoutes from './utility-types/route';
import utilityRateRoutes from './utility-rates/route';
import chargeTypeRoutes from './charge-types/route';
import paymentPlanRoutes from './payment-plans/route';
import lateFeeRoutes from './late-fees/route';
import paymentMethodRoutes from './payment-methods/route';
import contractRoutes from './contracts/route';
import utilityRoutes from './utilities/route';
import invoiceRoutes from './invoices/route';
import paymentRoutes from './payments/route';
import receiptRoutes from './receipts/route';
import maintenanceRequestRoutes from './maintenance-requests/route';
import saleContractRoutes from './sale-contracts/route';

export const adminRoutes = [
    {
        path: '/admin',
        component: Layout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardPage,
                meta: { title: 'Dashboard' },
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
            ...contractRoutes,
            ...utilityRoutes,
            ...invoiceRoutes,
            ...paymentRoutes,
            ...receiptRoutes,
            ...maintenanceRequestRoutes,
            {
                path: ':pathMatch(.*)*',
                name: 'admin-not-found',
                component: NotFound,
                meta: { title: 'Page not found' },
            },
            ...saleContractRoutes,
        ],
    },
];
