const routes = [
    {
        path: 'late-fees',
        name: 'lateFee',
        children: [
            {
                path: '',
                name: 'lateFeeList',
                component: () => import('@/modules/admin/late-fees/list/LateFeeList.vue'),
                meta: {
                    navKey: 'late-fees',
                    parentNavKey: 'settings',
                    action: 'view',
                    resource: 'late_fee',
                    layout: 'default',
                    title: 'Late Fees',
                    breadcrumbs: [
                        { title: 'Late Fee List', routeName: 'lateFeeList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newLateFee',
                component: () => import('@/modules/admin/late-fees/entry/NewLateFee.vue'),
                meta: {
                    navKey: 'late-fees',
                    parentNavKey: 'settings',
                    action: 'create',
                    resource: 'late_fee',
                    layout: 'default',
                    title: 'Create Late Fee',
                    breadcrumbs: [
                        { title: 'Late Fee List', routeName: 'lateFeeList' },
                        { title: 'New', routeName: 'newLateFee' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editLateFee',
                component: () => import('@/modules/admin/late-fees/entry/EditLateFee.vue'),
                meta: {
                    navKey: 'late-fees',
                    parentNavKey: 'settings',
                    action: 'update',
                    resource: 'late_fee',
                    layout: 'default',
                    title: 'Edit Late Fee',
                    breadcrumbs: [
                        { title: 'Late Fee List', routeName: 'lateFeeList' },
                        { title: 'Edit', routeName: 'editLateFee' },
                    ],
                },
            },
        ],
    },
];

export default routes;
