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
                    navKey: 'payments',
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
                    navKey: 'payments',
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
                path: 'approval',
                name: 'paymentApprovalList',
                component: () => import('@/modules/admin/payments/approval/PaymentApprovalList.vue'),
                meta: {
                    navKey: 'approval-payments',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'payment_approval',
                    layout: 'default',
                    title: 'Payment Approvals',
                    breadcrumbs: [
                        { title: 'Payment List', routeName: 'paymentList' },
                        { title: 'Approvals', routeName: 'paymentApprovalList' },
                    ],
                },
            },
            {
                path: 'approval/:id',
                name: 'showPaymentApproval',
                component: () => import('@/modules/admin/payments/detail/ShowPayment.vue'),
                meta: {
                    navKey: 'approval-payments',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'payment_approval',
                    layout: 'default',
                    approvalContext: true,
                    title: 'Payment Approval Detail',
                    breadcrumbs: [
                        { title: 'Payment List', routeName: 'paymentList' },
                        { title: 'Approvals', routeName: 'paymentApprovalList' },
                        { title: 'Detail', routeName: 'showPaymentApproval' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showPayment',
                component: () => import('@/modules/admin/payments/detail/ShowPayment.vue'),
                meta: {
                    navKey: 'payments',
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
