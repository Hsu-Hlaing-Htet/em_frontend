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
    {
        path: 'payments/:id',
        name: 'customerShowPayment',
        component: () => import('./detail/ShowPayment.vue'),
        meta: {
            title: 'Payment Details',
            breadcrumbs: [
                { title: 'Payments', routeName: 'customerPaymentList' },
                { title: 'Details', routeName: 'customerShowPayment' },
            ],
        },
    },
];

export default routes;
