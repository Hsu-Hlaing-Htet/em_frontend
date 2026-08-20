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

    return {
        severity: resolvedSeverity,
        summary: title,
        detail: message,
        life: resolvedLife,
        closable: true,
    };
}
