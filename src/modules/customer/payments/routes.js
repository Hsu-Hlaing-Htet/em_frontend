const routes = [
    {
        path: 'payments',
        name: 'customerPaymentList',
        component: () => import('./list/PaymentList.vue'),
        meta: {
            title: 'Payment History',
            breadcrumbs: [{ title: 'Payments', routeName: 'customerPaymentList' }],
        },
    },
];

export default routes;
