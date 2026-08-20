<template>
    <Toast position="top-right" />
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

onMounted(() => {
    unsubscribe = EventBus.on('show-toast', (payload) => {
        toast.add(normalizeToastOptions(payload));
    });
});

onUnmounted(() => {
    unsubscribe?.();
});
</script>
