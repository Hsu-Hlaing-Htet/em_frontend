const routes = [
    {
        path: 'payments',
        name: 'payment',
        children: [
            {
                path: '',
                name: 'paymentList',
                component: () => import('@/modules/admin/payments/list/PaymentList.vue'),
                meta: {
                    action: 'view',
                    resource: 'payment',
                    layout: 'default',
                    title: 'Payments',
                    breadcrumbs: [
                        { title: 'Payment List', routeName: 'paymentList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newPayment',
                component: () => import('@/modules/admin/payments/entry/NewPayment.vue'),
                meta: {
                    action: 'create',
                    resource: 'payment',
                    layout: 'default',
                    title: 'Create Payment',
                    breadcrumbs: [
                        { title: 'Payment List', routeName: 'paymentList' },
                        { title: 'New', routeName: 'newPayment' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showPayment',
                component: () => import('@/modules/admin/payments/entry/ShowPayment.vue'),
                meta: {
                    action: 'view',
                    resource: 'payment',
                    layout: 'default',
                    title: 'Show Payment',
                    breadcrumbs: [
                        { title: 'Payment List', routeName: 'paymentList' },
                        { title: 'Show Payment', routeName: 'showPayment' },
                    ],
                },
            },
        ],
    },
];

export default routes;
