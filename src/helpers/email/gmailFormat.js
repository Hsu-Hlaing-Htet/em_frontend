import {
    SUPER_ADMIN_EMAIL,
    isReservedSuperAdminEmail,
    normalizeEmail,
} from '@/utils/formValidation';

export const GMAIL_DOMAIN = '@gmail.com';

export { SUPER_ADMIN_EMAIL, isReservedSuperAdminEmail };

/**
 * Keep only the Gmail local-part. Strips domains from pasted full addresses.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function sanitizeGmailUsername(value) {
    let raw = String(value || '').trim();

    if (!raw) {
        return '';
    }

    if (raw.includes('@')) {
        const [local = ''] = raw.split('@');
        raw = local;
    }

    // Gmail local-part allows letters, numbers, dots, underscores, hyphens, plus.
    return raw.replace(/[^a-zA-Z0-9._+-]/g, '').toLowerCase();
}

/**
 * @param {unknown} username
 * @returns {string} Full address like hsuhsu@gmail.com, or '' when empty
 */
export function formatGmailAddress(username) {
    const local = sanitizeGmailUsername(username);

    if (!local) {
        return '';
    }

    return `${local}${GMAIL_DOMAIN}`;
}

/**
 * Display username for a stored email. Returns null when Super Admin reserved email
 * should use the plain full-email UI instead.
 *
 * @param {unknown} email
 * @returns {string|null}
 */
export function parseGmailUsername(email) {
    const normalized = normalizeEmail(email);

    if (!normalized) {
        return '';
    }

    if (isReservedSuperAdminEmail(normalized)) {
        return null;
    }

    if (normalized.endsWith(GMAIL_DOMAIN)) {
        return normalized.slice(0, -GMAIL_DOMAIN.length);
    }

    if (normalized.includes('@')) {
        return sanitizeGmailUsername(normalized.split('@')[0]);
    }

    return sanitizeGmailUsername(normalized);
}

/**
 * Whether the Gmail username suffix UI should be used for this account email.
 */
export function shouldUseGmailUsernameInput(email, originalEmail = null) {
    if (isReservedSuperAdminEmail(email) || isReservedSuperAdminEmail(originalEmail)) {
        return false;
    }

    return true;
}
