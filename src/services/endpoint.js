export const endpoint = {

    /** Auth */
    login: 'auth/login',
    logout: 'auth/logout',
    me: 'auth/me',
    forgotPassword: 'auth/forgot-password',
    resetPassword: 'auth/reset-password',

    /** Customer portal */
    customerDashboard: 'customer/dashboard',
    customerProfile: 'customer/profile',
    customerContracts: 'customer/contracts',
    customerInvoices: 'customer/invoices',
    customerPayments: 'customer/payments',
    customerReceipts: 'customer/receipts',
    customerNotifications: 'customer/notifications',
    customerPaymentMethods: 'customer/payment-methods',

    /** Dashboard */
    dashboard: 'dashboard',
    adminDashboardCharts: 'admin/dashboard/charts',

    /** Authorization */
    roles: 'roles',

    /** Users */
    users: 'users',
    profiles: 'profiles',
    residents: 'residents',
    staff: 'staff',

    /** Properties */
    buildings: 'buildings',
    rooms: 'rooms',
    roomImages: 'room-images',
    roomImageUpload: 'room-images/upload',

    /** Utilities */
    utilityTypes: 'utility-types',
    utilityRates: 'utility-rates',

    /** Billing */
    chargeTypes: 'charge-types',
    lateFees: 'late-fees',
    paymentMethods: 'payment-methods',
    paymentPlans: 'payment-plans',
    contracts: 'contracts',
    saleContractDrafts: 'sale-contract-drafts',
    saleContractsApproved: 'sale-contracts/approved',
    rentContractDrafts: 'rent-contract-drafts',
    rentContractsActive: 'rent-contracts/active',
    utilities: 'utilities',
    utilityItems: 'utility-items',
    invoices: 'invoices',
    invoiceItems: 'invoice-items',
    payments: 'payments',
    receipts: 'receipts',
    maintenanceRequests: 'maintenance-requests',
    listExportPdf: 'list-exports/pdf',
};