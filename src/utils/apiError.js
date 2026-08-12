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

    if (lower.includes('email') && (lower.includes('already been taken') || lower.includes('already registered') || lower.includes('already exists'))) {
        return 'This email is already registered.';
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

    if (status >= 500) {
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
