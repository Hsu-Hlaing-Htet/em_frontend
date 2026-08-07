/**
 * Demo credentials from env (preferred) or seeded UserSeeder defaults.
 * Do not commit secrets beyond the known local demo password already in seeders.
 */
export function adminCredentials() {
    return {
        email: process.env.E2E_ADMIN_EMAIL || 'admin@rosewoodroyale.com',
        password: process.env.E2E_ADMIN_PASSWORD || 'p@ssword',
    };
}

export function customerCredentials() {
    return {
        email: process.env.E2E_CUSTOMER_EMAIL || 'mgmg@rosewoodroyale.com',
        password: process.env.E2E_CUSTOMER_PASSWORD || 'p@ssword',
    };
}

export function otherCustomerCredentials() {
    return {
        email: process.env.E2E_OTHER_CUSTOMER_EMAIL || 'hlahla@rosewoodroyale.com',
        password: process.env.E2E_OTHER_CUSTOMER_PASSWORD || 'p@ssword',
    };
}

export function uniqueSuffix() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
