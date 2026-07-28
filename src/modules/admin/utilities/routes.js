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
                component: () => import('@/modules/admin/utilities/entry/NewUtility.vue'),
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
                path: 'approval',
                name: 'utilityApprovalList',
                component: () => import('@/modules/admin/utilities/approval/UtilityApprovalList.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility_approval',
                    layout: 'default',
                    title: 'Utility Approvals',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                        { title: 'Approvals', routeName: 'utilityApprovalList' },
                    ],
                },
            },
            {
                path: 'approval/:id',
                name: 'showUtilityApproval',
                component: () => import('@/modules/admin/utilities/detail/ShowUtility.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility_approval',
                    layout: 'default',
                    approvalContext: true,
                    title: 'Utility Approval Detail',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                        { title: 'Approvals', routeName: 'utilityApprovalList' },
                        { title: 'Detail', routeName: 'showUtilityApproval' },
                    ],
                },
            },
            {
                path: ':id/document',
                name: 'utilityDocument',
                component: () => import('@/modules/admin/utilities/detail/UtilityDocument.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility',
                    layout: 'default',
                    title: 'Utility Bill Document',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                        { title: 'Show Utility', routeName: 'showUtility' },
                        { title: 'Document', routeName: 'utilityDocument' },
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
                        { title: 'Show Utility', routeName: 'showUtility' },
                        { title: 'Edit', routeName: 'editUtility' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showUtility',
                component: () => import('@/modules/admin/utilities/detail/ShowUtility.vue'),
                meta: {
                    action: 'view',
                    resource: 'utility',
                    layout: 'default',
                    title: 'Utility Detail',
                    breadcrumbs: [
                        { title: 'Utility List', routeName: 'utilityList' },
                        { title: 'Detail', routeName: 'showUtility' },
                    ],
                },
            },
        ],
    },
];

export default routes;
