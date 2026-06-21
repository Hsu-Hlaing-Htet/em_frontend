export function resolveMediaUrl(pathOrUrl) {
    if (!pathOrUrl) {
        return '';
    }

    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const appBase = apiBase.replace(/\/api\/?$/, '');

    if (pathOrUrl.startsWith('/storage/')) {
        return `${appBase}${pathOrUrl}`;
    }

    const normalizedPath = pathOrUrl.replace(/^\/+/, '');

    return `${appBase}/storage/${normalizedPath}`;
}
