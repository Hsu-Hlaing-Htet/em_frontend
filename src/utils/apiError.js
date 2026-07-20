import EventBus from '@/libs/AppEventBus';

export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
    const data = error?.data ?? error?.response?.data;

    if (!data) {
        return fallback;
    }

    if (data.data) {
        const messages = Object.values(data.data).flat();

        if (messages.length) {
            return messages[0];
        }
    }

    if (data.errors) {
        const messages = Object.values(data.errors).flat();

        if (messages.length) {
            return messages[0];
        }
    }

    return data.message || fallback;
}

export function showApiErrorToast(error, fallback) {
    EventBus.emit('show-toast', {
        severity: 'error',
        summary: '',
        detail: getApiErrorMessage(error, fallback),
    });
}
