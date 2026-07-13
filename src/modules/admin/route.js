import Layout from './layouts/App.vue';
import DashboardPage from './dashboard/Dashboard.vue';
import roleRoutes from './roles/route';
import residentRoutes from './residents/route';
import staffRoutes from './staff/route';
import buildingRoutes from './buildings/route';
import roomRoutes from './rooms/route';
import utilityTypeRoutes from './utility-types/route';
import utilityRateRoutes from './utility-rates/route';
import chargeTypeRoutes from './charge-types/route';
import lateFeeRoutes from './late-fees/route';
import paymentMethodRoutes from './payment-methods/route';
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
            ...lateFeeRoutes,
            ...paymentMethodRoutes,
            ...saleContractRoutes,
        ],
    },
];
