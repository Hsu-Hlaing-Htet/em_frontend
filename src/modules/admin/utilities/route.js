const routes = [
    {
        path: 'utilities',
        name: 'utility',
        children: [
            {
                path: '',
                name: 'utilityList',
                component: () => import('@/modules/admin/utilities/list/UtilityList.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility',
                    layout: 'default',
                    title: 'Utilities',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newUtility',
                component: () => import('@/modules/admin/utilities/entry/EditUtility.vue'),
                meta: {
                    action: 'create',
                    resource: 'utility',
                    layout: 'default',
                    title: 'Create Utility',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                        { title: 'New', routeName: 'newUtility' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editUtility',
                component: () => import('@/modules/admin/utilities/entry/EditUtility.vue'),
                meta: {
                    action: 'update',
                    resource: 'utility',
                    layout: 'default',
                    title: 'Edit Utility',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                        { title: 'Edit', routeName: 'editUtility' },
                    ],
                },
            },
        ],
    },
];

export default routes;
