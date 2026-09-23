import EventBus from '@/libs/AppEventBus';

function normalizeApiMessage(message, status) {
    const text = String(message || '').trim();
    const lower = text.toLowerCase();

    if (status === 401 || status === 403 || lower.includes('unauthorized') || lower.includes('forbidden')) {
        return 'You do not have permission to perform this action.';
    }

    if (status >= 500) {
        return 'Something went wrong. Please try again.';
    }

    if (lower.includes('required')) {
        return 'This field is required.';
    }

    if (lower.includes('valid email') || lower.includes('must be a valid email') || lower.includes('email must be valid')) {
        return 'Please enter a valid email address.';
    }

    if (lower.includes('reserved') || text === 'This email address is reserved.') {
        return 'This email address is reserved.';
    }

    if (lower.includes('email') && (lower.includes('already been taken') || lower.includes('already registered') || lower.includes('already exists') || lower.includes('already in use'))) {
        return 'This email is already in use.';
    }

    if (lower.includes('username') && (lower.includes('already been taken') || lower.includes('already registered') || lower.includes('already exists') || lower.includes('already in use'))) {
        return 'This username is already in use.';
    }

    if (lower.includes('room') && (lower.includes('already been taken') || lower.includes('already exists'))) {
        return text.includes('already exists in this building')
            ? text
            : 'Room number already exists in this building.';
    }

    if (
        lower.includes('confirmation does not match')
        || lower.includes('confirmation doesn')
        || lower.includes('password confirmation')
        || lower.includes('passwords do not match')
    ) {
        return 'Passwords do not match.';
    }

    return text || 'Something went wrong. Please try again.';
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    const data = error?.data ?? error?.response?.data;
    const status = error?.status ?? error?.response?.status;

    if (status === 401 || status === 403) {
        return 'You do not have permission to perform this action.';
    }

    // Prefer explicit safe API messages for conflict / not-found / method errors.
    if (status === 404) {
        return normalizeApiMessage(data?.message || 'The requested resource could not be found.', status);
    }

    if (status === 405) {
        return normalizeApiMessage(data?.message || 'This action is not supported.', status);
    }

    if (status === 409) {
        return normalizeApiMessage(data?.message || fallback, status);
    }

    if (status >= 500) {
        // Only surface short safe business messages; never stack traces.
        const serverMessage = String(data?.message || '').trim();
        if (
            serverMessage
            && serverMessage.length <= 180
            && !serverMessage.includes('SQLSTATE')
            && !serverMessage.includes('Stack trace')
            && !serverMessage.includes('/')
        ) {
            return normalizeApiMessage(serverMessage, status);
        }

        return 'Something went wrong. Please try again.';
    }

    if (!data) {
        return normalizeApiMessage(fallback, status);
    }

    if (data.data) {
        const messages = Object.values(data.data).flat();

        if (messages.length) {
            return normalizeApiMessage(messages[0], status);
        }
    }

    if (data.errors) {
        const messages = Object.values(data.errors).flat();

        if (messages.length) {
            return normalizeApiMessage(messages[0], status);
        }
    }

    return normalizeApiMessage(data.message || fallback, status);
}

export function showApiErrorToast(error, fallback) {
    EventBus.emit('show-toast', {
        severity: 'error',
        summary: '',
        detail: getApiErrorMessage(error, fallback),
    });
}
