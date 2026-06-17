<template>
    <Toast position="top-right" />
    <ConfirmDialog />
    <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import EventBus from '@/libs/AppEventBus';

const toast = useToast();
let unsubscribe = null;

onMounted(() => {
    unsubscribe = EventBus.on('show-toast', ({ severity, summary, detail, life = 3000 }) => {
        toast.add({ severity, summary, detail, life });
    });
});

onUnmounted(() => {
    unsubscribe?.();
});
</script>
