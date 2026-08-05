import {
    ACTIVITY_TIMELINE,
    AGENTS,
    BOOKINGS,
    CONTRACTS,
    DASHBOARD_SETTINGS,
    INVOICES,
    INVOICE_STATS,
    KPI_STATS,
    MAINTENANCE_REQUESTS,
    NOTIFICATIONS,
    OCCUPANCY_BY_BUILDING,
    PAYMENTS,
    PENDING_APPROVAL_BREAKDOWN,
    PERMISSION_MODULES,
    PROPERTY_STATS,
    QUICK_ACTIONS,
    RECEIVABLE_AGING,
    RECENT_CLIENTS,
    RECENT_INQUIRIES,
    RECENT_PROPERTIES,
    REPORTS,
    REPORT_STATS,
    REVENUE_CHART,
    REVENUE_COLLECTIONS,
    REVENUE_SUMMARY,
    ROLES,
    TENANTS,
    UPCOMING_CONTRACTS,
} from '../mockData';

const MOCK_DELAY_MS = 700;

function clone(value) {
    return structuredClone(value);
}

function delay(ms = MOCK_DELAY_MS) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

const mockRepository = {
    async getAll() {
        await delay();

        return {
            kpi_stats: clone(KPI_STATS),
            revenue_summary: clone(REVENUE_SUMMARY),
            revenue_chart: clone(REVENUE_CHART),
            revenue_collections: clone(REVENUE_COLLECTIONS),
            receivable_aging: clone(RECEIVABLE_AGING),
            occupancy_by_building: clone(OCCUPANCY_BY_BUILDING),
            upcoming_contracts: clone(UPCOMING_CONTRACTS),
            pending_approval_breakdown: clone(PENDING_APPROVAL_BREAKDOWN),
            property_stats: clone(PROPERTY_STATS),
            invoice_stats: clone(INVOICE_STATS),
            properties: clone(RECENT_PROPERTIES),
            customers: clone(RECENT_CLIENTS),
            agents: clone(AGENTS),
            tenants: clone(TENANTS),
            inquiries: clone(RECENT_INQUIRIES),
            contracts: clone(CONTRACTS),
            invoices: clone(INVOICES),
            payments: clone(PAYMENTS),
            bookings: clone(BOOKINGS),
            maintenance_requests: clone(MAINTENANCE_REQUESTS),
            notifications: clone(NOTIFICATIONS),
            activity_timeline: clone(ACTIVITY_TIMELINE),
            reports: clone(REPORTS),
            report_stats: clone(REPORT_STATS),
            roles: clone(ROLES),
            permission_modules: clone(PERMISSION_MODULES),
            settings: clone(DASHBOARD_SETTINGS),
            quick_actions: clone(QUICK_ACTIONS),
        };
    },

    async getSection(sectionKey) {
        const data = await this.getAll();
        const sectionMap = {
            overview: {
                kpi_stats: data.kpi_stats,
                property_stats: data.property_stats,
                invoice_stats: data.invoice_stats,
                revenue_summary: data.revenue_summary,
                revenue_chart: data.revenue_chart,
                activity_timeline: data.activity_timeline,
                quick_actions: data.quick_actions,
                properties: data.properties,
            },
            revenue: {
                revenue_summary: data.revenue_summary,
                revenue_chart: data.revenue_chart,
            },
            properties: { properties: data.properties },
            customers: { customers: data.customers },
            agents: { agents: data.agents },
            tenants: { tenants: data.tenants },
            inquiries: { inquiries: data.inquiries },
            contracts: { contracts: data.contracts },
            invoices: { invoices: data.invoices },
            payments: { payments: data.payments },
            bookings: { bookings: data.bookings },
            maintenance: { maintenance_requests: data.maintenance_requests },
            notifications: { notifications: data.notifications },
            activity: { activity_timeline: data.activity_timeline },
            reports: {
                reports: data.reports,
                report_stats: data.report_stats,
            },
            roles: {
                roles: data.roles,
                permission_modules: data.permission_modules,
            },
            settings: { settings: data.settings },
        };

        return sectionMap[sectionKey] ?? null;
    },
};

export { mockRepository };
