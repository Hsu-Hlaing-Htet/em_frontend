import CustomerLayout from '@/layouts/customer/CustomerLayout.vue';
import dashboardRoutes from './dashboard/routes';
import profileRoutes from './profile/routes';
import contractRoutes from './contracts/routes';
import invoiceRoutes from './invoices/routes';
import paymentRoutes from './payments/routes';
import receiptRoutes from './receipts/routes';
import notificationRoutes from './notifications/routes';
import maintenanceRequestRoutes from './maintenance-requests/routes';
import NotFound from '@/pages/404.vue';

export const customerRoutes = [
    {
        path: '/customer',
        component: CustomerLayout,
        meta: { requiresAuth: true, role: 'customer' },
        children: [
            {
                path: '',
                redirect: { name: 'customerDashboard' },
            },
            ...dashboardRoutes,
            ...profileRoutes,
            ...contractRoutes,
            ...invoiceRoutes,
            ...paymentRoutes,
            ...receiptRoutes,
            ...notificationRoutes,
            ...maintenanceRequestRoutes,
            {
                path: ':pathMatch(.*)*',
                name: 'customer-not-found',
                component: NotFound,
                meta: { title: 'Page not found' },
            },
        ],
    },
];
