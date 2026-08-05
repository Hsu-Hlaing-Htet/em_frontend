export function omitEmptyParams(params = {}) {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => {
            if (value === null || value === undefined) {
                return false;
            }

            if (typeof value === 'string' && value.trim() === '') {
                return false;
            }

            return true;
        }),
    );
}

export function readQueryString(query, key, fallback = '') {
    const raw = query?.[key];
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    return String(value);
}

export function readQueryNumber(query, key, fallback = null) {
    const raw = readQueryString(query, key, '');

    if (!raw) {
        return fallback;
    }

    const number = Number(raw);

    return Number.isFinite(number) ? number : fallback;
}

export function toQueryDate(value) {
    if (!value) {
        return undefined;
    }

    if (typeof value === 'string') {
        return value.slice(0, 10);
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    return undefined;
}

export function readQueryDate(query, key, parseDate) {
    const raw = readQueryString(query, key, '');

    if (!raw) {
        return null;
    }

    return parseDate(raw.slice(0, 10));
}

export function queriesEqual(a = {}, b = {}) {
    const left = omitEmptyParams(a);
    const right = omitEmptyParams(b);
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    return leftKeys.every((key, index) => (
        key === rightKeys[index] && String(left[key]) === String(right[key])
    ));
}
