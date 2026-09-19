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
                    title: 'Payment',
                    breadcrumbs: [
                        { title: 'Invoice Detail', routeName: 'invoiceDocument' },
                        { title: 'Payment', routeName: 'newPayment' },
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
                        { title: 'Approvals', routeName: 'paymentApprovalList' },
                        { title: 'Payments', routeName: 'paymentApprovalList' },
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
                    title: 'Payment Approval Details',
                    breadcrumbs: [
                        { title: 'Approvals', routeName: 'paymentApprovalList' },
                        { title: 'Payments', routeName: 'paymentApprovalList' },
                        { title: 'Details', routeName: 'showPaymentApproval' },
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
                    title: 'Payment Details',
                    breadcrumbs: [
                        { title: 'Payments', routeName: 'paymentList' },
                        { title: 'Details', routeName: 'showPayment' },
                    ],
                },
            },
        ],
    },
];

export default routes;
