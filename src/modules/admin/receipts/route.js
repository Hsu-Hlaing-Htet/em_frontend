const routes = [
    {
        path: 'receipts',
        name: 'receipt',
        children: [
            {
                path: '',
                name: 'receiptList',
                component: () => import('@/modules/admin/receipts/list/ReceiptList.vue'),
                meta: {
                    action: 'view',
                    resource: 'receipt',
                    layout: 'default',
                    title: 'Receipts',
                    breadcrumbs: [
                        { title: 'Receipt List', routeName: 'receiptList' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showReceipt',
                component: () => import('@/modules/admin/receipts/entry/ShowReceipt.vue'),
                meta: {
                    action: 'view',
                    resource: 'receipt',
                    layout: 'default',
                    title: 'Show Receipt',
                    breadcrumbs: [
                        { title: 'Receipt List', routeName: 'receiptList' },
                        { title: 'Show Receipt', routeName: 'showReceipt' },
                    ],
                },
            },
        ],
    },
];

export default routes;
