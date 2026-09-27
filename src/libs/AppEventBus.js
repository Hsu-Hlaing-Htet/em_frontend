const listeners = new Map();

const EventBus = {
    on(event, callback) {
        // Toast listeners must be singular — HMR / remount without unmount
        // previously stacked handlers and produced duplicate toasts per emit.
        if (event === 'show-toast') {
            listeners.set(event, new Set([callback]));
        } else {
            if (!listeners.has(event)) {
                listeners.set(event, new Set());
            }

            listeners.get(event).add(callback);
        }

        return () => {
            listeners.get(event)?.delete(callback);
        };
    },

    off(event, callback) {
        listeners.get(event)?.delete(callback);
    },

    emit(event, payload) {
        listeners.get(event)?.forEach((callback) => {
            callback(payload);
        });
    },
};

export default EventBus;
