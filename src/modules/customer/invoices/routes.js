const routes = [
    {
        path: 'invoices',
        name: 'customerInvoiceList',
        component: () => import('./list/InvoiceList.vue'),
        meta: {
            title: 'My Invoices',
            breadcrumbs: [{ title: 'Invoices', routeName: 'customerInvoiceList' }],
        },
    },
    {
        path: 'invoices/:id/document',
        name: 'customerInvoiceDocument',
        component: () => import('./detail/InvoiceDocument.vue'),
        meta: {
            title: 'Invoice Document',
            breadcrumbs: [
                { title: 'Invoices', routeName: 'customerInvoiceList' },
                { title: 'Document', routeName: 'customerInvoiceDocument' },
            ],
        },
    },
    {
        path: 'invoices/:id',
        name: 'customerShowInvoice',
        component: () => import('./detail/ShowInvoice.vue'),
        meta: {
            title: 'Make Payments',
            breadcrumbs: [
                { title: 'Invoices', routeName: 'customerInvoiceList' },
                { title: 'Details', routeName: 'customerShowInvoice' },
            ],
        },
    },
];

export default routes;
