/**
 * Context-aware Customer Portal resource-not-found copy.
 * Keep shared — detail pages pass a resource key, not duplicated markup.
 */
export const CUSTOMER_RESOURCE_NOT_FOUND = {
    invoice: {
        title: 'Invoice Not Found',
        message: 'The invoice you requested could not be found or is not available to your account.',
        backLabel: 'Back to Invoices',
        backRoute: { name: 'customerInvoiceList' },
    },
    receipt: {
        title: 'Receipt Not Found',
        message: 'The receipt you requested could not be found or is not available to your account.',
        backLabel: 'Back to Receipts',
        backRoute: { name: 'customerReceiptList' },
    },
    payment: {
        title: 'Payment Not Found',
        message: 'The payment you requested could not be found or is not available to your account.',
        backLabel: 'Back to Payments',
        backRoute: { name: 'customerPaymentList' },
    },
    contract: {
        title: 'Contract Not Found',
        message: 'The contract you requested could not be found or is not available to your account.',
        backLabel: 'Back to Contracts',
        backRoute: { name: 'customerContractList' },
    },
    utility: {
        title: 'Utility Not Found',
        message: 'The utility bill you requested could not be found or is not available to your account.',
        backLabel: 'Back to Invoices',
        backRoute: { name: 'customerInvoiceList' },
    },
    maintenance: {
        title: 'Request Not Found',
        message: 'The maintenance request you requested could not be found or is not available to your account.',
        backLabel: 'Back to Maintenance Requests',
        backRoute: { name: 'customerMaintenanceRequestList' },
    },
    page: {
        title: 'Page Not Found',
        message: 'The page you are looking for may have been moved, removed, or never existed.',
        backLabel: 'Back to Dashboard',
        backRoute: { name: 'customerDashboard' },
    },
};

export function getCustomerResourceNotFound(resource = 'page') {
    return CUSTOMER_RESOURCE_NOT_FOUND[resource] || CUSTOMER_RESOURCE_NOT_FOUND.page;
}
