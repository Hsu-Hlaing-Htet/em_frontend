const routes = [
    {
        path: 'utility-rates',
        name: 'utilityRate',
        children: [
            {
                path: '',
                name: 'utilityRateList',
                component: () => import('@/modules/admin/utility-rates/list/UtilityRateList.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility_rate',
                    layout: 'default',
                    title: 'Utility Rates',
                    breadcrumbs: [
                        { title: 'Utility Rate List', routeName: 'utilityRateList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newUtilityRate',
                component: () => import('@/modules/admin/utility-rates/entry/NewUtilityRate.vue'),
                meta: {
                    action: 'create',
                    resource: 'utility_rate',
                    layout: 'default',
                    title: 'Create Utility Rate',
                    breadcrumbs: [
                        { title: 'Utility Rate List', routeName: 'utilityRateList' },
                        { title: 'New', routeName: 'newUtilityRate' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editUtilityRate',
                component: () => import('@/modules/admin/utility-rates/entry/EditUtilityRate.vue'),
                meta: {
                    action: 'update',
                    resource: 'utility_rate',
                    layout: 'default',
                    title: 'Edit Utility Rate',
                    breadcrumbs: [
                        { title: 'Utility Rate List', routeName: 'utilityRateList' },
                        { title: 'Edit', routeName: 'editUtilityRate' },
                    ],
                },
            },
        ],
    },
];

export default routes;
