const menuList = [
    {
        label: 'Dashboard',
        key: 'dashboard',
        icon: 'pi pi-th-large',
        to: '/admin/dashboard',
    },

    {
        label: 'Buildings',
        key: 'buildings',
        icon: 'pi pi-building',
        to: '/admin/buildings',
    },

    {
        label: 'Rooms',
        key: 'rooms',
        icon: 'pi pi-home',
        to: '/admin/rooms',
    },

    {
        label: 'Users',
        key: 'users',
        icon: 'pi pi-users',
        items: [
            {
                label: 'Residents',
                key: 'residents',
                icon: 'pi pi-users',
                to: '/admin/residents',
            },
            {
                label: 'Staffs',
                key: 'staff',
                icon: 'pi pi-user-plus',
                to: '/admin/staff',
            },
        ],
    },

    {
        label: 'Contracts',
        key: 'contracts',
        icon: 'pi pi-file',
        items: [
            {
                label: 'Sale Drafts',
                key: 'sale-drafts',
                icon: 'pi pi-file-edit',
                to: '/admin/sale-contracts/drafts',
            },
            {
                label: 'Active Sales',
                key: 'active-sales',
                icon: 'pi pi-check-circle',
                to: '/admin/sale-contracts/active',
            },
            {
                label: 'Rent Drafts',
                key: 'rent-drafts',
                icon: 'pi pi-file-edit',
                to: '/admin/rent-contracts/drafts',
            },
            {
                label: 'Active Rents',
                key: 'active-rents',
                icon: 'pi pi-check-circle',
                to: '/admin/rent-contracts/active',
            },
        ],
    },

    {
        label: 'Utilities',
        key: 'utilities',
        icon: 'pi pi-bolt',
        to: '/admin/utilities',
    },

    {
        label: 'Invoices',
        key: 'invoices',
        icon: 'pi pi-receipt',
        to: '/admin/invoices',
    },

    {
        label: 'Payments',
        key: 'payments',
        icon: 'pi pi-wallet',
        to: '/admin/payments',
    },
    {
        label: 'Receipts',
        key: 'receipts',
        icon: 'pi pi-ticket',
        to: '/admin/receipts',
    },
    {
        label: 'Maintenance Requests',
        key: 'maintenance-requests',
        icon: 'pi pi-wrench',
        to: '/admin/maintenance-requests',
    },
    {
        label: 'Approvals',
        key: 'approvals',
        icon: 'pi pi-verified',
        items: [
            {
                label: 'Sale Contracts',
                key: 'approval-sale-contracts',
                icon: 'pi pi-file-check',
                to: '/admin/approvals/sale-contracts',
            },
            {
                label: 'Rent Contracts',
                key: 'approval-rent-contracts',
                icon: 'pi pi-file-check',
                to: '/admin/approvals/rent-contracts',
            },
            {
                label: 'Utilities',
                key: 'approval-utilities',
                icon: 'pi pi-bolt',
                to: '/admin/utilities/approval',
            },
            {
                label: 'Invoices',
                key: 'approval-invoices',
                icon: 'pi pi-receipt',
                to: '/admin/invoices/approval',
            },
            {
                label: 'Payments',
                key: 'approval-payments',
                icon: 'pi pi-wallet',
                to: '/admin/payments/approval',
            },
            {
                label: 'Receipts',
                key: 'approval-receipts',
                icon: 'pi pi-ticket',
                to: '/admin/receipts/approval',
            },
        ],
    },

    {
        label: 'Settings',
        key: 'settings',
        icon: 'pi pi-cog',
        items: [
            {
                label: 'Roles',
                key: 'roles',
                icon: 'pi pi-shield',
                to: '/admin/roles',
            },
            {
                label: 'Utility Types',
                key: 'utility-types',
                icon: 'pi pi-list',
                to: '/admin/utility-types',
            },
            {
                label: 'Utility Rates',
                key: 'utility-rates',
                icon: 'pi pi-dollar',
                to: '/admin/utility-rates',
            },
            {
                label: 'Charge Types',
                key: 'charge-types',
                icon: 'pi pi-tags',
                to: '/admin/charge-types',
            },
            {
                label: 'Payment Plans',
                key: 'payment-plans',
                icon: 'pi pi-calendar',
                to: '/admin/payment-plans',
            },
            {
                label: 'Late Fees',
                key: 'late-fees',
                icon: 'pi pi-clock',
                to: '/admin/late-fees',
            },
            {
                label: 'Payment Methods',
                key: 'payment-methods',
                icon: 'pi pi-credit-card',
                to: '/admin/payment-methods',
            },
        ],
    },
];

export default menuList;
