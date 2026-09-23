export const TOAST_TITLES = {
    success: 'Success',
    error: 'Error',
    warn: 'Warning',
    warning: 'Warning',
    info: 'Information',
};

const DEFAULT_LIFE = {
    success: 3000,
    info: 3000,
    warn: 7000,
    warning: 7000,
    error: 8000,
};

function normalizeSeverity(severity) {
    if (severity === 'warning') {
        return 'warn';
    }

    return severity || 'info';
}

/** Auth + portal paths that share the Rosewood glass toast system (not Public). */
const GLASS_TOAST_PATH_PREFIXES = [
    '/admin',
    '/customer',
    '/login',
    '/forgot-password',
    '/change-password',
    '/reset-password',
];

/**
 * Glass toasts for Admin/Customer and auth screens that feed into them.
 * Login success fires on /login before redirect — must still get rw-glass-toast.
 * Public marketing pages (e.g. /contact) keep legacy pastel surfaces.
 */
function isPortalGlassToast() {
    if (typeof window === 'undefined') {
        return false;
    }

    const path = window.location?.pathname || '';

    return GLASS_TOAST_PATH_PREFIXES.some(
        (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
}

export function normalizeToastOptions({
    severity = 'info',
    summary = '',
    detail = '',
    life,
} = {}) {
    const resolvedSeverity = normalizeSeverity(severity);
    const title = TOAST_TITLES[resolvedSeverity] || TOAST_TITLES.info;
    const message = String(detail || summary || '').trim();
    const defaultLife = DEFAULT_LIFE[resolvedSeverity] ?? DEFAULT_LIFE.info;
    let resolvedLife = life == null ? defaultLife : Number(life);

    if (resolvedSeverity === 'error' || resolvedSeverity === 'warn') {
        resolvedLife = Math.max(resolvedLife || 0, DEFAULT_LIFE[resolvedSeverity]);
    }

    const options = {
        severity: resolvedSeverity,
        summary: title,
        detail: message,
        life: resolvedLife,
        closable: true,
    };

    if (isPortalGlassToast()) {
        options.styleClass = 'rw-glass-toast';
    }

    return options;
}
