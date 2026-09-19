<script setup>
import RwEmptyState from '@/components/global/RwEmptyState.vue';

defineProps({
    title: {
        type: String,
        default: 'No records found',
    },
    message: {
        type: String,
        default: 'Try adjusting your search or filter criteria.',
    },
    icon: {
        type: String,
        default: 'pi pi-inbox',
    },
});
</script>

<template>
    <RwEmptyState
        compact
        :icon="icon"
        :title="title"
        :message="message"
    />
</template>
