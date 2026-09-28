const routes = [
    {
        path: 'contact-inquiries',
        name: 'contactInquiry',
        children: [
            {
                path: '',
                name: 'contactInquiryList',
                component: () => import('@/modules/admin/contact-inquiries/list/ContactInquiryList.vue'),
                meta: {
                    navKey: 'contact-inquiries',
                    action: 'view',
                    resource: 'contact_inquiry',
                    layout: 'default',
                    title: 'Contact Inquiries',
                    breadcrumbs: [
                        { title: 'Contact Inquiries', routeName: 'contactInquiryList' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showContactInquiry',
                component: () => import('@/modules/admin/contact-inquiries/detail/ShowContactInquiry.vue'),
                meta: {
                    navKey: 'contact-inquiries',
                    action: 'view',
                    resource: 'contact_inquiry',
                    layout: 'default',
                    title: 'Contact Inquiry Detail',
                    breadcrumbs: [
                        { title: 'Contact Inquiries', routeName: 'contactInquiryList' },
                        { title: 'Detail', routeName: 'showContactInquiry' },
                    ],
                },
            },
        ],
    },
];

export default routes;
