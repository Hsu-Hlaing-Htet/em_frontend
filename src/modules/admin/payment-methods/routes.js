const routes = [
    {
        path: 'payment-methods',
        name: 'paymentMethod',
        children: [
            {
                path: '',
                name: 'paymentMethodList',
                component: () => import('@/modules/admin/payment-methods/list/PaymentMethodList.vue'),
                meta: {
                    navKey: 'payment-methods',
                    parentNavKey: 'settings',
                    action: 'view',
                    resource: 'payment_method',
                    layout: 'default',
                    title: 'Payment Methods',
                    breadcrumbs: [
                        { title: 'Payment Method List', routeName: 'paymentMethodList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newPaymentMethod',
                component: () => import('@/modules/admin/payment-methods/entry/NewPaymentMethod.vue'),
                meta: {
                    navKey: 'payment-methods',
                    parentNavKey: 'settings',
                    action: 'create',
                    resource: 'payment_method',
                    layout: 'default',
                    title: 'Create Payment Method',
                    breadcrumbs: [
                        { title: 'Payment Method List', routeName: 'paymentMethodList' },
                        { title: 'New', routeName: 'newPaymentMethod' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editPaymentMethod',
                component: () => import('@/modules/admin/payment-methods/entry/EditPaymentMethod.vue'),
                meta: {
                    navKey: 'payment-methods',
                    parentNavKey: 'settings',
                    action: 'update',
                    resource: 'payment_method',
                    layout: 'default',
                    title: 'Edit Payment Method',
                    breadcrumbs: [
                        { title: 'Payment Method List', routeName: 'paymentMethodList' },
                        { title: 'Edit', routeName: 'editPaymentMethod' },
                    ],
                },
            },
        ],
    },
];

export default routes;
