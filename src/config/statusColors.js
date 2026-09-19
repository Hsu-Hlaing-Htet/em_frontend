/**
 * Global status color + label config.
 * Backend status string values are used as keys unchanged.
 */

export const STATUS_TONES = {
    neutral: 'neutral',
    info: 'info',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    accent: 'accent',
};

/** @type {Record<string, { tone: string, label: string, icon?: string }>} */
export const STATUS_DEFINITIONS = {
    // Room / property
    available: { tone: STATUS_TONES.success, label: 'Available', icon: 'pi pi-check-circle' },
    occupied: { tone: STATUS_TONES.info, label: 'Occupied', icon: 'pi pi-home' },
    sold: { tone: STATUS_TONES.accent, label: 'Sold', icon: 'pi pi-tag' },
    // Operational
    inactive: { tone: STATUS_TONES.neutral, label: 'Inactive', icon: 'pi pi-pause' },

    // Workflow / approval
    draft: { tone: STATUS_TONES.info, label: 'Draft', icon: 'pi pi-file' },
    pending: { tone: STATUS_TONES.warning, label: 'Pending', icon: 'pi pi-hourglass' },
    pending_approval: { tone: STATUS_TONES.warning, label: 'Pending Approval', icon: 'pi pi-hourglass' },
    approved: { tone: STATUS_TONES.success, label: 'Approved', icon: 'pi pi-verified' },
    accepted: { tone: STATUS_TONES.info, label: 'Accepted', icon: 'pi pi-check' },
    rejected: { tone: STATUS_TONES.danger, label: 'Rejected', icon: 'pi pi-ban' },

    // Contract / lifecycle
    active: { tone: STATUS_TONES.success, label: 'Active', icon: 'pi pi-check' },
    completed: { tone: STATUS_TONES.success, label: 'Completed', icon: 'pi pi-flag-fill' },
    cancelled: { tone: STATUS_TONES.danger, label: 'Cancelled', icon: 'pi pi-times' },
    terminated: { tone: STATUS_TONES.danger, label: 'Terminated', icon: 'pi pi-times' },
    in_progress: { tone: STATUS_TONES.accent, label: 'In Progress', icon: 'pi pi-spin pi-spinner' },

    // Billing
    issued: { tone: STATUS_TONES.info, label: 'Issued', icon: 'pi pi-send' },
    partial: { tone: STATUS_TONES.info, label: 'Issued', icon: 'pi pi-send' },
    paid: { tone: STATUS_TONES.success, label: 'Paid', icon: 'pi pi-check' },
    unpaid: { tone: STATUS_TONES.info, label: 'Issued', icon: 'pi pi-send' },
    overdue: { tone: STATUS_TONES.danger, label: 'Overdue', icon: 'pi pi-exclamation-triangle' },
};

const DEFAULT_DEFINITION = {
    tone: STATUS_TONES.neutral,
    icon: 'pi pi-info-circle',
};

function normalizeStatus(status) {
    if (status == null || status === '') {
        return '';
    }

    return String(status).trim().toLowerCase().replace(/\s+/g, '_');
}

function formatStatusLabel(status) {
    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function resolveStatusDefinition(status) {
    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
        return {
            ...DEFAULT_DEFINITION,
            label: '-',
        };
    }

    const definition = STATUS_DEFINITIONS[normalizedStatus];

    if (definition) {
        return definition;
    }

    return {
        ...DEFAULT_DEFINITION,
        label: formatStatusLabel(normalizedStatus),
    };
}

export function getStatusLabel(status) {
    return resolveStatusDefinition(status).label;
}

export function getStatusTone(status) {
    return resolveStatusDefinition(status).tone;
}

export function getStatusIcon(status) {
    return resolveStatusDefinition(status).icon;
}
