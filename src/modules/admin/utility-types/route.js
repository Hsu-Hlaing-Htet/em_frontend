const routes = [
    {
        path: 'utility-types',
        name: 'utilityType',
        children: [
            {
                path: '',
                name: 'utilityTypeList',
                component: () => import('@/modules/admin/utility-types/list/UtilityTypeList.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility_type',
                    layout: 'default',
                    title: 'Utility Types',
                    breadcrumbs: [
                        { title: 'Utility Type List', routeName: 'utilityTypeList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newUtilityType',
                component: () => import('@/modules/admin/utility-types/entry/NewUtilityType.vue'),
                meta: {
                    action: 'create',
                    resource: 'utility_type',
                    layout: 'default',
                    title: 'Create Utility Type',
                    breadcrumbs: [
                        { title: 'Utility Type List', routeName: 'utilityTypeList' },
                        { title: 'New', routeName: 'newUtilityType' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editUtilityType',
                component: () => import('@/modules/admin/utility-types/entry/EditUtilityType.vue'),
                meta: {
                    action: 'update',
                    resource: 'utility_type',
                    layout: 'default',
                    title: 'Edit Utility Type',
                    breadcrumbs: [
                        { title: 'Utility Type List', routeName: 'utilityTypeList' },
                        { title: 'Edit', routeName: 'editUtilityType' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showUtilityType',
                component: () => import('@/modules/admin/utility-types/entry/ShowUtilityType.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility_type',
                    layout: 'default',
                    title: 'Show Utility Type',
                    breadcrumbs: [
                        { title: 'Utility Type List', routeName: 'utilityTypeList' },
                        { title: 'Show Utility Type', routeName: 'showUtilityType' },
                    ],
                },
            },
        ],
    },
];

export default routes;
