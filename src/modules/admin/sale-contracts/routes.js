const saleContractRoutes = [
    {
        path: 'sale-contracts',
        name: 'saleContract',
        children: [
            {
                path: 'drafts',
                name: 'saleContractDraftList',
                component: () => import('@/modules/admin/sale-contracts/draft/SaleDraftList.vue'),
                meta: {
                    navKey: 'sale-drafts',
                    parentNavKey: 'contracts',
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
                component: () => import('@/modules/admin/sale-contracts/draft/NewSaleDraft.vue'),
                meta: {
                    navKey: 'sale-drafts',
                    parentNavKey: 'contracts',
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
                component: () => import('@/modules/admin/sale-contracts/draft/EditSaleDraft.vue'),
                meta: {
                    navKey: 'sale-drafts',
                    parentNavKey: 'contracts',
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
                redirect: (to) => ({ name: 'showSaleContractDraft', params: to.params }),
                meta: {
                    navKey: 'sale-drafts',
                    parentNavKey: 'contracts',
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
                component: () => import('@/modules/admin/sale-contracts/draft/ContractPdf.vue'),
                meta: {
                    navKey: 'sale-drafts',
                    parentNavKey: 'contracts',
                    action: 'view',
                    resource: 'sale_contract',
                    layout: 'default',
                    title: 'Sale Contract Draft',
                    breadcrumbs: [
                        { title: 'Sale Drafts', routeName: 'saleContractDraftList' },
                        { title: 'Detail', routeName: 'showSaleContractDraft' },
                    ],
                },
            },
            {
                path: 'active',
                name: 'activeSaleList',
                component: () => import('@/modules/admin/sale-contracts/active/ActiveSaleList.vue'),
                meta: {
                    navKey: 'active-sales',
                    parentNavKey: 'contracts',
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
                component: () => import('@/modules/admin/sale-contracts/active/ShowActiveSale.vue'),
                meta: {
                    navKey: 'active-sales',
                    parentNavKey: 'contracts',
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
                component: () => import('@/modules/admin/sale-contracts/approval/SaleContractApprovalList.vue'),
                meta: {
                    navKey: 'approval-sale-contracts',
                    parentNavKey: 'approvals',
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
                component: () => import('@/modules/admin/sale-contracts/approval/ShowSaleContractApproval.vue'),
                meta: {
                    navKey: 'approval-sale-contracts',
                    parentNavKey: 'approvals',
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
