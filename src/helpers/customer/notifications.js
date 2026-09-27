const TERMINAL_STATUSES = new Set(['read', 'paid', 'approved', 'completed', 'rejected']);

/**
 * Unread is driven by persisted read_at only.
 * Entity status (issued/approved/pending/etc.) must never imply "read".
 */
export function isCustomerNotificationUnread(item) {
    if (!item) {
        return false;
    }

    return !item.read_at;
}

/**
 * @deprecated Kept for any legacy callers; prefer read_at.
 */
export function isCustomerNotificationTerminalStatus(status) {
    return TERMINAL_STATUSES.has(String(status || '').toLowerCase());
}

export function customerNotificationIcon(type) {
    return {
        invoice: 'pi pi-file',
        payment: 'pi pi-wallet',
        receipt: 'pi pi-receipt',
        contract: 'pi pi-home',
        utility: 'pi pi-bolt',
        maintenance: 'pi pi-wrench',
        announcement: 'pi pi-megaphone',
    }[type] || 'pi pi-bell';
}

export function customerNotificationTone(type) {
    return {
        invoice: 'tone-burgundy',
        payment: 'tone-gold',
        receipt: 'tone-purple',
        contract: 'tone-green',
        utility: 'tone-blue',
        maintenance: 'tone-blue',
        announcement: 'tone-neutral',
    }[type] || 'tone-neutral';
}

export function customerNotificationRoute(item) {
    if (item?.type === 'payment') {
        if (item.status === 'approved' && item.receipt_id) {
            return {
                name: 'customerShowReceipt',
                params: { id: item.receipt_id },
            };
        }

        const paymentId = item.payment_id
            || (item.status === 'approved' ? null : item.resource_id);

        if (paymentId) {
            return {
                name: 'customerShowPayment',
                params: { id: paymentId },
            };
        }

        return null;
    }

    const routeByType = {
        invoice: 'customerShowInvoice',
        receipt: 'customerShowReceipt',
        contract: 'customerShowContract',
        utility: 'customerShowInvoice',
        maintenance: 'customerShowMaintenanceRequest',
    };

    const routeName = routeByType[item?.type];

    if (!routeName || !item?.resource_id) {
        return null;
    }

    return { name: routeName, params: { id: item.resource_id } };
}

import {
    formatProjectDate,
    parseProjectDateTimeParts,
    toProjectDate,
} from '@/utils/timezone';

export function formatRelativeTime(value, locale = 'en-GB') {
    if (!value) {
        return '—';
    }

    const date = toProjectDate(value);
    if (!date) {
        return value;
    }

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
        return 'Just now';
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
        return `${diffDays}d ago`;
    }

    return formatProjectDate(value) || String(value);
}

export function formatContractTypeLabel(type) {
    if (type === 'rent') {
        return 'Residential Lease Agreement';
    }

    if (type === 'sale') {
        return 'Residential Sale Agreement';
    }

    if (!type) {
        return 'Property Agreement';
    }

    return `${String(type).charAt(0).toUpperCase()}${String(type).slice(1)} Agreement`;
}

export function formatPropertyLabel(contract) {
    const building = contract?.building_name?.trim();
    const room = contract?.room_number?.trim();

    if (building && room) {
        return `${building} · Unit ${room}`;
    }

    if (building) {
        return building;
    }

    if (room) {
        return `Unit ${room}`;
    }

    return '';
}

export function invoiceDueStatus(invoice) {
    if (!invoice?.due_date) {
        return { label: 'Due', badgeValue: 'issued' };
    }

    const due = parseProjectDateTimeParts(invoice.due_date);
    if (!due) {
        return { label: 'Due', badgeValue: 'issued' };
    }

    const today = parseProjectDateTimeParts(new Date());
    const dueKey = due.year * 10000 + due.month * 100 + due.day;
    const todayKey = today.year * 10000 + today.month * 100 + today.day;

    if (invoice.status === 'overdue' || dueKey < todayKey) {
        return { label: 'Overdue', badgeValue: 'overdue' };
    }

    const diffDays = Math.round(
        (Date.UTC(due.year, due.month - 1, due.day)
            - Date.UTC(today.year, today.month - 1, today.day)) / 86400000,
    );

    if (diffDays <= 7) {
        return { label: 'Due Soon', badgeValue: 'pending' };
    }

    return { label: 'Upcoming', badgeValue: 'issued' };
}
