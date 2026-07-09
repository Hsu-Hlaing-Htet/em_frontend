<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: {
        type: String,
        required: true,
    },
});

const config = computed(() => {
    const map = {
        available: { severity: 'success', icon: 'pi pi-check-circle', label: 'Available' },
        reserved: { severity: 'warning', icon: 'pi pi-bookmark', label: 'Reserved' },
        occupied: { severity: 'info', icon: 'pi pi-home', label: 'Occupied' },
        sold: { severity: 'danger', icon: 'pi pi-tag', label: 'Sold' },
        maintenance: { severity: 'secondary', icon: 'pi pi-wrench', label: 'Maintenance' },
        unpaid: { severity: 'danger', icon: 'pi pi-times-circle', label: 'Unpaid' },
        partial: { severity: 'warning', icon: 'pi pi-minus-circle', label: 'Partial' },
        paid: { severity: 'success', icon: 'pi pi-check', label: 'Paid' },
        overdue: { severity: 'danger', icon: 'pi pi-exclamation-triangle', label: 'Overdue' },
        pending: { severity: 'warning', icon: 'pi pi-hourglass', label: 'Pending' },
        approved: { severity: 'success', icon: 'pi pi-verified', label: 'Approved' },
        rejected: { severity: 'danger', icon: 'pi pi-ban', label: 'Rejected' },
        draft: { severity: 'secondary', icon: 'pi pi-file', label: 'Draft' },
        issued: { severity: 'info', icon: 'pi pi-send', label: 'Issued' },
    };

    const fallbackLabel = props.value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    return map[props.value] || {
        severity: 'secondary',
        icon: 'pi pi-info-circle',
        label: fallbackLabel,
    };
});
</script>

<template>
    <Tag
        :severity="config.severity"
        class="inline-flex items-center gap-1.5"
    >
        <i
            :class="config.icon"
            class="text-xs"
            aria-hidden="true"
        />
        <span>{{ config.label }}</span>
    </Tag>
</template>
