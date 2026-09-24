const menuList = [
    {
        labelKey: 'navigation.dashboard',
        key: 'dashboard',
        icon: 'pi pi-th-large',
        to: '/admin/dashboard',
    },
    {
        labelKey: 'navigation.buildings',
        key: 'buildings',
        icon: 'pi pi-building',
        to: '/admin/buildings',
    },
    {
        labelKey: 'navigation.rooms',
        key: 'rooms',
        icon: 'pi pi-home',
        to: '/admin/rooms',
    },
    {
        labelKey: 'navigation.users',
        key: 'users',
        icon: 'pi pi-users',
        items: [
            {
                labelKey: 'navigation.residents',
                key: 'residents',
                icon: 'pi pi-users',
                to: '/admin/residents',
            },
            {
                labelKey: 'navigation.staff',
                key: 'staff',
                icon: 'pi pi-user-plus',
                to: '/admin/staff',
            },
        ],
    },
    {
        labelKey: 'navigation.contracts',
        key: 'contracts',
        icon: 'pi pi-file',
        items: [
            {
                labelKey: 'navigation.saleContracts',
                key: 'sale-contracts',
                icon: 'pi pi-check-circle',
                to: '/admin/sale-contracts/active',
            },
            {
                labelKey: 'navigation.rentContracts',
                key: 'rent-contracts',
                icon: 'pi pi-check-circle',
                to: '/admin/rent-contracts/active',
            },
        ],
    },
    {
        labelKey: 'navigation.utilities',
        key: 'utilities',
        icon: 'pi pi-bolt',
        to: '/admin/utilities',
    },
    {
        labelKey: 'navigation.invoices',
        key: 'invoices',
        icon: 'pi pi-receipt',
        to: '/admin/invoices',
    },
    {
        labelKey: 'navigation.payments',
        key: 'payments',
        icon: 'pi pi-wallet',
        to: '/admin/payments',
    },
    {
        labelKey: 'navigation.receipts',
        key: 'receipts',
        icon: 'pi pi-ticket',
        to: '/admin/receipts',
    },
    {
        labelKey: 'navigation.maintenanceRequests',
        key: 'maintenance-requests',
        icon: 'pi pi-wrench',
        to: '/admin/maintenance-requests',
    },
    {
        labelKey: 'navigation.approvals',
        key: 'approvals',
        icon: 'pi pi-verified',
        items: [
            {
                labelKey: 'navigation.approvalSaleContracts',
                key: 'approval-sale-contracts',
                icon: 'pi pi-file-check',
                to: '/admin/approvals/sale-contracts',
            },
            {
                labelKey: 'navigation.approvalRentContracts',
                key: 'approval-rent-contracts',
                icon: 'pi pi-file-check',
                to: '/admin/approvals/rent-contracts',
            },
            {
                labelKey: 'navigation.utilities',
                key: 'approval-utilities',
                icon: 'pi pi-bolt',
                to: '/admin/utilities/approval',
            },
            {
                labelKey: 'navigation.invoices',
                key: 'approval-invoices',
                icon: 'pi pi-receipt',
                to: '/admin/invoices/approval',
            },
            {
                labelKey: 'navigation.payments',
                key: 'approval-payments',
                icon: 'pi pi-wallet',
                to: '/admin/payments/approval',
            },
        ],
    },
    {
        labelKey: 'navigation.settings',
        key: 'settings',
        icon: 'pi pi-cog',
        items: [
            {
                labelKey: 'navigation.roles',
                key: 'roles',
                icon: 'pi pi-shield',
                to: '/admin/roles',
            },
            {
                labelKey: 'navigation.utilityTypes',
                key: 'utility-types',
                icon: 'pi pi-list',
                to: '/admin/utility-types',
            },
            {
                labelKey: 'navigation.utilityRates',
                key: 'utility-rates',
                icon: 'pi pi-dollar',
                to: '/admin/utility-rates',
            },
            {
                labelKey: 'navigation.chargeTypes',
                key: 'charge-types',
                icon: 'pi pi-tags',
                to: '/admin/charge-types',
            },
            {
                labelKey: 'navigation.maintenanceCategories',
                key: 'maintenance-categories',
                icon: 'pi pi-wrench',
                to: '/admin/maintenance-categories',
            },
            {
                labelKey: 'navigation.paymentPlans',
                key: 'payment-plans',
                icon: 'pi pi-calendar',
                to: '/admin/payment-plans',
            },
            {
                labelKey: 'navigation.lateFees',
                key: 'late-fees',
                icon: 'pi pi-clock',
                to: '/admin/late-fees',
            },
            {
                labelKey: 'navigation.paymentMethods',
                key: 'payment-methods',
                icon: 'pi pi-credit-card',
                to: '/admin/payment-methods',
            },
        ],
    },
];

export default menuList;
