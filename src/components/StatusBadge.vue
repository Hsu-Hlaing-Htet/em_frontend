<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: {
        type: String,
        required: true,
    },
});

const severity = computed(() => {
    const map = {
        available: 'success',
        reserved: 'warning',
        occupied: 'info',
        sold: 'danger',
        unpaid: 'danger',
        partial: 'warning',
        paid: 'success',
        overdue: 'danger',
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
    };

    return map[props.value] || 'secondary';
});

const label = computed(() => props.value.replaceAll('_', ' ').toUpperCase());
</script>

<template>
    <Tag :value="label" :severity="severity" />
</template>
