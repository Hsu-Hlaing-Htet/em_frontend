const routes = [
    {
        path: 'contracts',
        name: 'contract',
        children: [
            {
                path: '',
                name: 'contractList',
                component: () => import('@/modules/admin/contracts/list/ContractList.vue'),
                meta: {
                    action: 'view',
                    resource: 'contract',
                    layout: 'default',
                    title: 'Contracts',
                    breadcrumbs: [
                        { title: 'Contract List', routeName: 'contractList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newContract',
                component: () => import('@/modules/admin/contracts/entry/NewContract.vue'),
                meta: {
                    action: 'create',
                    resource: 'contract',
                    layout: 'default',
                    title: 'Create Contract',
                    breadcrumbs: [
                        { title: 'Contract List', routeName: 'contractList' },
                        { title: 'New', routeName: 'newContract' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editContract',
                component: () => import('@/modules/admin/contracts/entry/EditContract.vue'),
                meta: {
                    action: 'update',
                    resource: 'contract',
                    layout: 'default',
                    title: 'Edit Contract',
                    breadcrumbs: [
                        { title: 'Contract List', routeName: 'contractList' },
                        { title: 'Edit', routeName: 'editContract' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showContract',
                component: () => import('@/modules/admin/contracts/entry/ShowContract.vue'),
                meta: {
                    action: 'view',
                    resource: 'contract',
                    layout: 'default',
                    title: 'Show Contract',
                    breadcrumbs: [
                        { title: 'Contract List', routeName: 'contractList' },
                        { title: 'Show Contract', routeName: 'showContract' },
                    ],
                },
            },
        ],
    },
];

export default routes;
