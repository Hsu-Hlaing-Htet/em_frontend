import UserLayout from '@/public/layouts/UserLayout.vue';
import UserDashboardPage from './entry/UserDashboardPage.vue';
import UserMyPropertyPage from './entry/UserMyPropertyPage.vue';
import UserMyInvoicesPage from './entry/UserMyInvoicesPage.vue';
import UserInvoiceDetailPage from './entry/UserInvoiceDetailPage.vue';
import UserPaymentHistoryPage from './entry/UserPaymentHistoryPage.vue';
import UserReceiptDetailPage from './entry/UserReceiptDetailPage.vue';

export const userRoutes = [
    {
        path: '/user',
        component: UserLayout,
        meta: { requiresAuth: true, role: 'owner' },
        children: [
            { path: 'dashboard', name: 'user-dashboard', component: UserDashboardPage },
            { path: 'my-property', name: 'user-my-property', component: UserMyPropertyPage },
            { path: 'my-invoices', name: 'user-my-invoices', component: UserMyInvoicesPage },
            { path: 'my-invoices/:id', name: 'user-invoice-detail', component: UserInvoiceDetailPage, props: true },
            { path: 'payment-history', name: 'user-payment-history', component: UserPaymentHistoryPage },
            { path: 'receipts/:id', name: 'user-receipt-detail', component: UserReceiptDetailPage, props: true },
        ],
    },
];
