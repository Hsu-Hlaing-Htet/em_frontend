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
                    navKey: 'receipts',
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
                path: 'approval',
                name: 'receiptApprovalList',
                component: () => import('@/modules/admin/receipts/approval/ReceiptApprovalList.vue'),
                meta: {
                    navKey: 'approval-receipts',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'receipt_approval',
                    layout: 'default',
                    title: 'Receipt Approvals',
                    breadcrumbs: [
                        { title: 'Receipt List', routeName: 'receiptList' },
                        { title: 'Approvals', routeName: 'receiptApprovalList' },
                    ],
                },
            },
            {
                path: 'approval/:id',
                name: 'showReceiptApproval',
                component: () => import('@/modules/admin/receipts/detail/ShowReceipt.vue'),
                meta: {
                    navKey: 'approval-receipts',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'receipt_approval',
                    layout: 'default',
                    approvalContext: true,
                    title: 'Receipt Approval Detail',
                    breadcrumbs: [
                        { title: 'Receipt List', routeName: 'receiptList' },
                        { title: 'Approvals', routeName: 'receiptApprovalList' },
                        { title: 'Detail', routeName: 'showReceiptApproval' },
                    ],
                },
            },
            {
                path: ':id/document',
                name: 'receiptDocument',
                component: () => import('@/modules/admin/receipts/detail/ReceiptDocument.vue'),
                meta: {
                    navKey: 'receipts',
                    action: 'view',
                    resource: 'receipt',
                    layout: 'default',
                    title: 'Receipt Document',
                    breadcrumbs: [
                        { title: 'Receipt List', routeName: 'receiptList' },
                        { title: 'Show Receipt', routeName: 'showReceipt' },
                        { title: 'Document', routeName: 'receiptDocument' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showReceipt',
                component: () => import('@/modules/admin/receipts/detail/ShowReceipt.vue'),
                meta: {
                    navKey: 'receipts',
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
