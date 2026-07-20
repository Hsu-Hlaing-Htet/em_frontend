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
        path: 'invoices/:id',
        name: 'customerShowInvoice',
        component: () => import('./detail/ShowInvoice.vue'),
        meta: {
            title: 'Invoice Details',
            breadcrumbs: [
                { title: 'Invoices', routeName: 'customerInvoiceList' },
                { title: 'Details', routeName: 'customerShowInvoice' },
            ],
        },
    },
];

export default routes;
