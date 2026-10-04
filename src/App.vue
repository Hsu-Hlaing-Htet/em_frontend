<template>
    <Toast
        position="top-right"
        :pt="{
            root: { 'aria-live': 'polite' },
            closeButton: { 'aria-label': 'Dismiss notification' },
        }"
    />
    <ConfirmDialog />
    <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import EventBus from '@/libs/AppEventBus';
import { normalizeToastOptions } from '@/utils/toast';

const toast = useToast();
let unsubscribe = null;

/** Mouse click on toast close can leave a sticky focus ring; blur pointer-driven focus only. */
function clearToastPointerFocus(event) {
    if (!(event?.detail > 0)) {
        return;
    }

    const closeButton = event.target?.closest?.('.p-toast-icon-close');

    if (!closeButton) {
        return;
    }

    requestAnimationFrame(() => {
        if (document.activeElement === closeButton) {
            closeButton.blur?.();
        }
    });
}

onMounted(() => {
    document.addEventListener('click', clearToastPointerFocus);

    unsubscribe = EventBus.on('show-toast', (payload) => {
        toast.add(normalizeToastOptions(payload));
    });
});

onUnmounted(() => {
    document.removeEventListener('click', clearToastPointerFocus);
    unsubscribe?.();
});
</script>
