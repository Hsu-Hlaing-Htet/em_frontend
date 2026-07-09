const routes = [
    {
        path: 'payment-plans',
        name: 'paymentPlan',
        children: [
            {
                path: '',
                name: 'paymentPlanList',
                component: () => import('@/modules/admin/payment-plans/list/PaymentPlanList.vue'),
                meta: {
                    action: 'view',
                    resource: 'payment_plan',
                    layout: 'default',
                    title: 'Payment Plans',
                    breadcrumbs: [
                        { title: 'Payment Plan List', routeName: 'paymentPlanList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newPaymentPlan',
                component: () => import('@/modules/admin/payment-plans/entry/NewPaymentPlan.vue'),
                meta: {
                    action: 'create',
                    resource: 'payment_plan',
                    layout: 'default',
                    title: 'Create Payment Plan',
                    breadcrumbs: [
                        { title: 'Payment Plan List', routeName: 'paymentPlanList' },
                        { title: 'New', routeName: 'newPaymentPlan' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editPaymentPlan',
                component: () => import('@/modules/admin/payment-plans/entry/EditPaymentPlan.vue'),
                meta: {
                    action: 'update',
                    resource: 'payment_plan',
                    layout: 'default',
                    title: 'Edit Payment Plan',
                    breadcrumbs: [
                        { title: 'Payment Plan List', routeName: 'paymentPlanList' },
                        { title: 'Edit', routeName: 'editPaymentPlan' },
                    ],
                },
            },
        ],
    },
];

export default routes;
