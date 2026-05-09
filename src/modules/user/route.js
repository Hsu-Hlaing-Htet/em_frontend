import UserLayout from '@/layouts/UserLayout.vue';
import UserDashboardPage from '@/pages/user/UserDashboardPage.vue';
import UserMyPropertyPage from '@/pages/user/UserMyPropertyPage.vue';
import UserMyInvoicesPage from '@/pages/user/UserMyInvoicesPage.vue';
import UserInvoiceDetailPage from '@/pages/user/UserInvoiceDetailPage.vue';
import UserPaymentHistoryPage from '@/pages/user/UserPaymentHistoryPage.vue';
import UserReceiptDetailPage from '@/pages/user/UserReceiptDetailPage.vue';

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
