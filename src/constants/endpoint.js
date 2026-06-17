export const endpoint = {

    /** Auth */
    login: 'auth/login',
    logout: 'auth/logout',
    me: 'auth/me', 
    
    /** Dashboard */
    dashboard: 'dashboard',

    /** Authorization */
    roles: 'roles',

    /** Users */
    users: 'users',
    profiles: 'profiles',

    /** Properties */
    buildings: 'properties/buildings',
    rooms: 'properties/rooms',
    roomImages: 'properties/room-images',

    /** Contracts */
    contracts: 'contracts',
    paymentPlans: 'contracts/payment-plans',

    /** Utilities */
    utilityTypes: 'utilities/types',
    utilityRates: 'utilities/rates',
    utilities: 'utilities',
    utilityItems: 'utilities/items',

    /** Billing */
    invoices: 'billing/invoices',
    invoiceItems: 'billing/invoice-items',
    payments: 'billing/payments',
    paymentMethods: 'billing/payment-methods',
    receipts: 'billing/receipts',
    chargeTypes: 'billing/charge-types',
    lateFees: 'billing/late-fees',

    /** Maintenance */
    maintenanceRequests: 'maintenance/requests',

    /** CMS */
    categories: 'cms/categories',
    contents: 'cms/contents',
    media: 'cms/media',
};
