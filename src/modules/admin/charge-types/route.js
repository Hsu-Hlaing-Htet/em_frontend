const routes = [
    {
        path: 'charge-types',
        name: 'chargeType',
        children: [
            {
                path: '',
                name: 'chargeTypeList',
                component: () => import('@/modules/admin/charge-types/list/ChargeTypeList.vue'),
                meta: {
                    action: 'view',
                    resource: 'charge_type',
                    layout: 'default',
                    title: 'Charge Types',
                    breadcrumbs: [
                        { title: 'Charge Type List', routeName: 'chargeTypeList' },
                    ],
                },
            },
            {
                path: 'create',
                name: 'newChargeType',
                component: () => import('@/modules/admin/charge-types/entry/NewChargeType.vue'),
                meta: {
                    action: 'create',
                    resource: 'charge_type',
                    layout: 'default',
                    title: 'Create Charge Type',
                    breadcrumbs: [
                        { title: 'Charge Type List', routeName: 'chargeTypeList' },
                        { title: 'New', routeName: 'newChargeType' },
                    ],
                },
            },
            {
                path: ':id/edit',
                name: 'editChargeType',
                component: () => import('@/modules/admin/charge-types/entry/EditChargeType.vue'),
                meta: {
                    action: 'update',
                    resource: 'charge_type',
                    layout: 'default',
                    title: 'Edit Charge Type',
                    breadcrumbs: [
                        { title: 'Charge Type List', routeName: 'chargeTypeList' },
                        { title: 'Edit', routeName: 'editChargeType' },
                    ],
                },
            },
        ],
    },
];

export default routes;
