const routes = [
    {
        path: 'invoices',
        name: 'invoice',
        children: [
            {
                path: '',
                name: 'invoiceList',
                component: () => import('@/modules/admin/invoices/list/InvoiceList.vue'),
                meta: {
                    navKey: 'invoices',
                    action: 'view',
                    resource: 'invoice',
                    layout: 'default',
                    title: 'Invoices',
                    breadcrumbs: [
                        { title: 'Invoice List', routeName: 'invoiceList' },
                    ],
                },
            },
            {
                path: 'approval',
                name: 'invoiceApprovalList',
                component: () => import('@/modules/admin/invoices/approval/InvoiceApprovalList.vue'),
                meta: {
                    navKey: 'approval-invoices',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'invoice_approval',
                    layout: 'default',
                    title: 'Invoice Approvals',
                    breadcrumbs: [
                        { title: 'Invoice List', routeName: 'invoiceList' },
                        { title: 'Approvals', routeName: 'invoiceApprovalList' },
                    ],
                },
            },
            {
                path: 'approval/:id',
                name: 'showInvoiceApproval',
                redirect: (to) => ({
                    name: 'invoiceApprovalDocument',
                    params: { id: to.params.id },
                    query: to.query,
                }),
                meta: {
                    navKey: 'approval-invoices',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'invoice_approval',
                    layout: 'default',
                    approvalContext: true,
                    title: 'Invoice Approval Detail',
                    breadcrumbs: [
                        { title: 'Invoice List', routeName: 'invoiceList' },
                        { title: 'Approvals', routeName: 'invoiceApprovalList' },
                        { title: 'Detail', routeName: 'showInvoiceApproval' },
                    ],
                },
            },
            {
                path: 'approval/:id/document',
                name: 'invoiceApprovalDocument',
                component: () => import('@/modules/admin/invoices/detail/InvoiceDocument.vue'),
                meta: {
                    navKey: 'approval-invoices',
                    parentNavKey: 'approvals',
                    action: 'view',
                    resource: 'invoice_approval',
                    layout: 'default',
                    approvalContext: true,
                    title: 'Invoice Approval Document',
                    breadcrumbs: [
                        { title: 'Invoice List', routeName: 'invoiceList' },
                        { title: 'Approvals', routeName: 'invoiceApprovalList' },
                        { title: 'Document', routeName: 'invoiceApprovalDocument' },
                    ],
                },
            },
            {
                path: ':id/document',
                name: 'invoiceDocument',
                component: () => import('@/modules/admin/invoices/detail/InvoiceDocument.vue'),
                meta: {
                    navKey: 'invoices',
                    action: 'view',
                    resource: 'invoice',
                    layout: 'default',
                    title: 'Invoice Document',
                    breadcrumbs: [
                        { title: 'Invoice List', routeName: 'invoiceList' },
                        { title: 'Document', routeName: 'invoiceDocument' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showInvoice',
                redirect: (to) => ({
                    name: 'invoiceDocument',
                    params: { id: to.params.id },
                    query: to.query,
                }),
                meta: {
                    navKey: 'invoices',
                    action: 'view',
                    resource: 'invoice',
                    layout: 'default',
                    title: 'Show Invoice',
                    breadcrumbs: [
                        { title: 'Invoice List', routeName: 'invoiceList' },
                        { title: 'Show Invoice', routeName: 'showInvoice' },
                    ],
                },
            },
        ],
    },
];

export default routes;
