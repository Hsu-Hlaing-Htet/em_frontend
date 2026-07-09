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
                path: ':id',
                name: 'showInvoice',
                component: () => import('@/modules/admin/invoices/entry/ShowInvoice.vue'),
                meta: {
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
