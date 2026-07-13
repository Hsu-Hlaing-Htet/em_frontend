const saleContractRoutes = [
    {
        path: 'sale-contracts',
        name: 'saleContract',
        children: [
            {
                path: 'drafts',
                name: 'saleContractDraftList',
                component: () => import('@/modules/admin/sale-contracts/drafts/list/SaleDraftList.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Drafts',
                    breadcrumbs: [
                        { title: 'Sale Drafts', routeName: 'saleContractDraftList' },
                    ],
                },
            },
            {
                path: 'drafts/create',
                name: 'newSaleContractDraft',
                component: () => import('@/modules/admin/sale-contracts/drafts/entry/NewSaleDraft.vue'),
                meta: {
                    action: 'create',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Create Sale Draft',
                    breadcrumbs: [
                        { title: 'Sale Drafts', routeName: 'saleContractDraftList' },
                        { title: 'Create', routeName: 'newSaleContractDraft' },
                    ],
                },
            },
            {
                path: 'drafts/:id/edit',
                name: 'editSaleContractDraft',
                component: () => import('@/modules/admin/sale-contracts/drafts/entry/EditSaleDraft.vue'),
                meta: {
                    action: 'update',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Edit Sale Draft',
                    breadcrumbs: [
                        { title: 'Sale Drafts', routeName: 'saleContractDraftList' },
                        { title: 'Edit', routeName: 'editSaleContractDraft' },
                    ],
                },
            },
            {
                path: 'drafts/:id/contract',
                name: 'saleContractDraftPdf',
                component: () => import('@/modules/admin/sale-contracts/drafts/entry/ContractPdf.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contract PDF',
                    breadcrumbs: [
                        { title: 'Sale Drafts', routeName: 'saleContractDraftList' },
                        { title: 'Detail', routeName: 'showSaleContractDraft' },
                        { title: 'Contract', routeName: 'saleContractDraftPdf' },
                    ],
                },
            },
            {
                path: 'drafts/:id',
                name: 'showSaleContractDraft',
                component: () => import('@/modules/admin/sale-contracts/drafts/entry/ShowSaleDraft.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Draft Detail',
                    breadcrumbs: [
                        { title: 'Sale Drafts', routeName: 'saleContractDraftList' },
                        { title: 'Detail', routeName: 'showSaleContractDraft' },
                    ],
                },
            },
            {
                path: 'active',
                name: 'activeSaleList',
                component: () => import('@/modules/admin/sale-contracts/active/list/ActiveSaleList.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Active Sales',
                    breadcrumbs: [
                        { title: 'Active Sales', routeName: 'activeSaleList' },
                    ],
                },
            },
            {
                path: 'active/:id',
                name: 'showActiveSale',
                component: () => import('@/modules/admin/sale-contracts/active/entry/ShowActiveSale.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Active Sale Detail',
                    breadcrumbs: [
                        { title: 'Active Sales', routeName: 'activeSaleList' },
                        { title: 'Detail', routeName: 'showActiveSale' },
                    ],
                },
            },
        ],
    },
    {
        path: 'approvals/sale-contracts',
        name: 'saleContractApproval',
        children: [
            {
                path: '',
                name: 'saleContractApprovalList',
                component: () => import('@/modules/admin/sale-contracts/approvals/list/SaleContractApprovalList.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract_approval',
                    layout: 'default',
                    title: 'Sale Contract Approvals',
                    breadcrumbs: [
                        { title: 'Sale Contract Approvals', routeName: 'saleContractApprovalList' },
                    ],
                },
            },
            {
                path: ':id',
                name: 'showSaleContractApproval',
                component: () => import('@/modules/admin/sale-contracts/approvals/entry/ShowSaleContractApproval.vue'),
                meta: {
                    action: 'view',
                    resource: 'sale_contract_approval',
                    layout: 'default',
                    title: 'Sale Contract Approval Detail',
                    breadcrumbs: [
                        { title: 'Sale Contract Approvals', routeName: 'saleContractApprovalList' },
                        { title: 'Detail', routeName: 'showSaleContractApproval' },
                    ],
                },
            },
        ],
    },
];

export default saleContractRoutes;
