/**
 * Resolve a public storage image URL against the configured API origin.
 *
 * Backend APP_URL may be backend.test while the Vue app calls 127.0.0.1:8000.
 * Prefer the API origin so <img src> hits the same host the SPA already uses.
 *
 * @param {string|null|undefined} urlOrPath Absolute storage URL or relative disk path
 * @returns {string}
 */
export function resolvePublicStorageUrl(urlOrPath) {
    if (!urlOrPath) {
        return '';
    }

    const value = String(urlOrPath).trim();

    if (!value) {
        return '';
    }

    let apiOrigin = '';

    try {
        apiOrigin = new URL(
            import.meta.env.VITE_API_BASE_URL || window.location.origin,
            window.location.origin,
        ).origin;
    } catch {
        apiOrigin = window.location.origin;
    }

    try {
        if (/^https?:\/\//i.test(value)) {
            const parsed = new URL(value);

            if (parsed.pathname.includes('/storage/')) {
                return `${apiOrigin}${parsed.pathname}${parsed.search}`;
            }

            return value;
        }

        const path = value.startsWith('/storage/')
            ? value
            : `/storage/${value.replace(/^\/+/, '')}`;

        return `${apiOrigin}${path}`;
    } catch {
        return value;
    }
}
